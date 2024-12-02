
const {  DataTypes } = require('sequelize');

module.exports.Proxy = function (sequelize) {
    return sequelize.define('proxy', {
        id: {
            type: DataTypes.INTEGER,
          //  allowNull: true,
            primaryKey: true,
            autoIncrement: true, 
          },
          name: DataTypes.STRING,
          type: DataTypes.STRING,
          protocol: DataTypes.STRING,
          capacity:DataTypes.STRING,
          tags:DataTypes.STRING,
          user_name:DataTypes.STRING,
          password:DataTypes.STRING,
          payment_status:DataTypes.STRING
    });
}
