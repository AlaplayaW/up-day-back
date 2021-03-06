const Sequelize = require("sequelize");
const sequelize = require("../connect");

const Event = sequelize.define(
  "event",
  {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    nature: {
      type: Sequelize.STRING,
      allowNull: false
    },
    volume: {
      type: Sequelize.STRING,
      allowNull: false
    },
    context: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: true
    }
  },
  {
    // options
  }
);

module.exports = Event;
