const {  DataTypes } = require('sequelize');

module.exports.Config_profile = function (sequelize) {
    return sequelize.define('config_profile', {
        id: {
            type: DataTypes.INTEGER,
          //  allowNull: true,
            primaryKey: true,
            autoIncrement: true, 
          },
          name:DataTypes.STRING,
          config_profile:DataTypes.STRING
    });
}
