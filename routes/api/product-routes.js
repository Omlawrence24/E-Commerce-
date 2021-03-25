const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');


// GET ALL PRODUCTS 
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    
    const userData = await Product.findAll({
   include: [{ model: Category, Product, Tag, ProductTag }],
    });
  
  if (!userData) {
    res.status(404).json({ message: 'No products found!' });
    return;
  }
  
  res.status(200).json(userData);
  } catch (err) {
  res.status(500).json(err);
  }
});

// GET ONE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const userCategory = await Product.findByPk(req.params.id, {
      include: [{ model: Category, Product }],
      // include: [{ model:Category, model:Product, }],
    });

    if (!userCategory) {
      res.status(404).json({ message: 'No Catergory found with that id!' });
      return;
    }

    res.status(200).json(userCatergory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  // create a new product
  try {
    console.log(req.body);
    const newProduct = await Product.create({
      category_id: req.body.category_id,
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,

    });
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const choosenProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!choosenProduct) {
      res.status(404).json({ message: 'No Product found with that id!' });
      return;
    }

    res.status(200).json(choosenProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;