
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Holiday = sequelize.define('Holiday', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(2), 
      allowNull: false,
    },
  }, {
    tableName: 'Holidays',
    timestamps: false,
  });

  return Holiday;
};