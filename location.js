const {  DataTypes } = require('sequelize');

module.exports.Location = function (sequelize) {
    return sequelize.define('location', {
        id: {
            type: DataTypes.INTEGER,
          //  allowNull: true,
            primaryKey: true,
            autoIncrement: true, 
          },
          location: DataTypes.STRING,
    });
}