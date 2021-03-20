const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
  // find all categories
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

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Category, Product }],
      // include: [{ model:Category, model:Product, }],
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

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create({
  
      category_name: req.body.category_name,
    
    });
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
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
