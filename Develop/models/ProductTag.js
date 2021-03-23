const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      onDELETE: "CASCADE"
    },
    product_id: {
      type: DataTypes.INTEGER,
     references:{
       model: "Product",
       key: "id",
     }
    },
    tag_id: {
      type: DataTypes.INTEGER,
     references:{
       model: "Tag",
       key: "id",
     }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "cascade",
      references: {
        model: "Category",
        key : "id",
    },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
