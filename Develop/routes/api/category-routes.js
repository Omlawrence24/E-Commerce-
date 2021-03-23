const router = require('express').Router();
const { Category, Product } = require('../../models');


// GET ALL CATEGORIES 
router.get('/', async (req, res) => {
  try {

  // be sure to include its associated Products
  const categoryData = await Category.findAll({
    include: [{model: Product}],
  });

if (!categoryData) {
  res.status(404).json({ message: 'No Catergory found with that id!' });
  return;
}

res.status(200).json(categoryData);
} catch (err) { 
res.status(500).json(err);
}
});

// GET CATEGORY BY ID
router.get('/:id', async (req, res) => {
  
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Category, Product }],
     
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No Catergory found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// CREATE A NEW CATEGORY 
router.post('/', async (req, res) => {
  
  try {
    const newCategory = await Category.create({
  
      category_name: req.body.category_name,
    
    });
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE A CATEGORY

  router.put('/:id', async (req, res) => {
    // update product data
    Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        console.log(product)
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

      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
  });
  


// DELETE AT CATEGORY 
router.delete('/:id', async (req, res) => {
 
    const choosenProduct = await Category.destroy({
      where: {
        id: req.params.id,
      },
    }).catch ((err) => res.json(err));
    res.json(choosenProduct);
    console.log(choosenProduct);
  
});

module.exports = router;
