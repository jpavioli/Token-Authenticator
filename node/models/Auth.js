// The Auth Model includes encrypted email / password combinations as they
// relate to Customer ID. There is no user details associted with PII

const Sequelize = require('sequelize');

const STRING = Sequelize.STRING;
const UUID = Sequelize.UUID;

//Open Database Connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

//Create Users Schema
const Auth = sequelize.define('auths',{
  customerId: {
    type:         UUID,
    allowNull:    false,
    primaryKey:   true
  },
  email:      {type:STRING},
  password:   {type:STRING}
});

module.exports = Auth

sequelize.sync()
