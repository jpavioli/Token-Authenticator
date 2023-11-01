// The Users Model includes information not considered Personal Identifyable
// but still relates to the user and can be collected for marketing and
// personalization

const Sequelize = require('sequelize');

const STRING = Sequelize.STRING;
const INTEGER = Sequelize.INTEGER;
const UUID = Sequelize.UUID;

//Open Database Connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
})

//Create Users Schema
const Users = sequelize.define('users',{
  customerId: {
    type:         UUID,
    allowNull:    false,
    primaryKey:   true
  },
  firstName:  {type:STRING},
  lastName:   {type:STRING},
  birthday:   {type:STRING},
  city:       {type:STRING},
  state:      {type:STRING},
  zip:        {type:INTEGER},
});

module.exports = Users

sequelize.sync()
