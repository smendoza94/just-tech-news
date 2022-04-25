const { Model, DataType } = require('sequelize');
const sequelize = require('../config/connection');

// STEP: 1 USER MODEL WILL DETERMINE THE TYPE OF DATA IN THE TABLE

// create our User model
class User extends Model {}

// define table columns and configuration 
User.init(
  { // table column definitions
    id: { // define id column
      type: DataType.INTEGER, // sequelize DataTypes object provides type of data
      allowNull: false, // not null, id must be filled
      primaryKey: true, // set id to primary key
      autoIncrement: true // id is on auto increment
    },
    username: { // define a username column
      type: DataType.STRING,
      allowNull: false
    },
    email: {
      type: DataType.STRING, 
      allowNull: false,
      unique: true, // there cannot be any duplicate emails in this table
      validate: { // if allowNull is false, data validators optional
        isEmail: true,
      }
    },
    password: { // define password column
      type: DataType.STRING,
      allowNull: false,
      validate: {
        len: [4]// password must be AT LEAST 4 characters long
      }
    }
  },
  { // table configuration options (https://sequelize.org/v5/manual/models-definition.html#configuration)
    sequelize, // pass in our imported sequilize connection (direct connection to our db)
    timestaps: false, // don't automatically create createAt/updateAt timestamp fields
    freezeTableName: true, // don't pluralize name of database table
    underscored: true, // use underscores instead of camel-case
    modelName: 'user' // model name stays lowercase in db
  }
);

module.exports = User;