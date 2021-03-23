const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');
const seedProducts = require('../seeds/product-seeds.js');

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      onDelete: "cascade",
      references: {
        model: "product",
        key : "id",
      }
      
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
      onDelete: "cascade",
      
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Category',
  }
);

module.exports = Category;
