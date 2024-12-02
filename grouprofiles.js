const {  DataTypes } = require('sequelize');

module.exports.groupProfiles = function (sequelize) {
    return sequelize.define('profile_groups', {
        id: {
            type: DataTypes.INTEGER,
          //  allowNull: true,
            primaryKey: true,
            autoIncrement: true, 
          },
          user_id: DataTypes.STRING,
          name:DataTypes.STRING,
          profile_group_metadata: DataTypes.TEXT,
    });
}
