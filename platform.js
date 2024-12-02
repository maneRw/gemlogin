const {  DataTypes } = require('sequelize');

module.exports.Platform = function (sequelize) {
    return sequelize.define('platform', {
        id: {
            type: DataTypes.INTEGER,
          //  allowNull: true,
            primaryKey: true,
            autoIncrement: true, 
          },
          name:DataTypes.STRING,
          icon:DataTypes.STRING
    });
}
