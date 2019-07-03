"use strict";
require("dotenv").config();

var cors = require("cors");
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 3030,
  host: "localhost",
  routes: {
    cors: true
  }
});

server.route(require("./resources/events/event.routes"));
server.route(require("./resources/users/user.routes"));

exports.init = async () => {
  const sequelize = require("./db/connect");
  await sequelize.sync({ force: true });
  await server.initialize();
  return server;
};

exports.start = async () => {
  const sequelize = require("./db/connect");
  await sequelize.sync();
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

server.events.on("response", function(request) {
  console.log(
    request.info.remoteAddress +
      ": " +
      request.method.toUpperCase() +
      " " +
      request.path +
      " --> " +
      request.response.statusCode
  );
});

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});
