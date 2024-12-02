const {  DataTypes } = require('sequelize');

module.exports.Scripts = function (sequelize) {
    return sequelize.define('apps', {
        id: {
            type: DataTypes.NUMBER,
            allowNull: true,
            primaryKey: true
          },
        user_id: DataTypes.STRING,
        name:DataTypes.STRING,
        description: DataTypes.TEXT,
        version:DataTypes.TEXT,
        script:DataTypes.TEXT,
        table:DataTypes.TEXT,
        input:DataTypes.TEXT,
        enabale_input:DataTypes.TEXT,
        metadata:DataTypes.TEXT,
        expired_at:DataTypes.TEXT,
        type:DataTypes.TEXT,
    });
}
