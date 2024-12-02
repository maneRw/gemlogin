const {  DataTypes } = require('sequelize');

module.exports.Profiles = function (sequelize) {
    return sequelize.define('profiles', {
        id: {
            type: DataTypes.INTEGER,
          //  allowNull: true,
            primaryKey: true,
            autoIncrement: true, 
          },
        user_id: DataTypes.STRING,
        name:DataTypes.STRING,
        resource: DataTypes.TEXT,
        proxy: DataTypes.TEXT,
        version:DataTypes.NUMBER,
        os:DataTypes.TEXT,
        status:DataTypes.NUMBER,
        profile_metadata:DataTypes.TEXT,
        profile_data:DataTypes.TEXT,
        profile_group_id:DataTypes.TEXT,
        last_start:DataTypes.DATE,
        last_sync:DataTypes.DATE,
        current_time:DataTypes.NUMBER,
        note:DataTypes.TEXT,
    });
}
