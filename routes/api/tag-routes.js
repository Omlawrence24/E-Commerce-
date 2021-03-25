const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {

    // be sure to include its associated Products
    const tagData = await Tag.findAll({
      include: [{model: Product}],
    });
  
  if (!tagData) {
    res.status(404).json({ message: 'No Tag found with that id!' });
    return;
  }
  
  res.status(200).json(tagData);
  } catch (err) { 
  res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: ProductTag, Product }],
     
    });

    if (!tagData) {
      res.status(404).json({ message: 'No Tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
    
  try {
    const newCategory = await Category.create({
  
      category_name: req.body.category_name,
    
    });
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  router.put('/:id', async (req, res) => {
    // update product data
    Tag.update(req.body, {
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
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
 router.delete('/:id', async (req, res) => {
 
    const choosenTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    }).catch ((err) => res.json(err));
    res.json(choosenTag);
    console.log(choosenTag);
  });
});

module.exports = router;
