const should = require("should");
const { init } = require("../src/server");
const User = require("../src/db/user/user.model");

describe("# Users routes", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## GET /users", () => {
    it("should return the code 200 and an empty array if no user has been created yet", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users"
      });
      const payload = JSON.parse(res.payload);
      should(res.statusCode).equal(200);
      should(payload).deepEqual([]);
    });

    it("should return the code 200 an array containing 2 users if 2 users exist in the database", async () => {
      const user1 = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236b",
        name: "Jojo",
        password: "1234",
        email: "jojo@gmail.com",
        role: "admin",
        token: "myToken1"
      };
      const user2 = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a5236c",
        name: "Floflo",
        password: "1234",
        email: "floflo@gmail.com",
        role: "standard",
        token: "myToken2"
      };

      await User.create(user1);
      await User.create(user2);

      const res = await server.inject({
        method: "GET",
        url: "/users"
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match([user1, user2]);
    });
  });

  describe("## POST /users", () => {
    it("should return the code 200 and the user just created if the payload is properly field and the user doesn't already exists in the database", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "Jiji",
          password: "1234",
          email: "Jiji@gmail.com",
          role: "admin"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match({
        name: "Jiji",
        email: "Jiji@gmail.com",
        role: "admin"
      });
    });

    it("should return the code 400 if the payload is not properly filled", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {}
      });

      should(res.statusCode).equal(400);
    });

    it("should return the code 400 if the user already exist in the database", async () => {
      await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "Jiji",
          password: "1234",
          email: "Jiji@gmail.com",
          role: "admin"
        }
      });

      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "Jiji",
          password: "1234",
          email: "Jiji@gmail.com",
          role: "admin"
        }
      });

      should(res.statusCode).equal(400);
    });
  });

  describe("## DELETE /users/{uuid}", () => {
    it("should return the code 200 and the message '1' if the user has been successfully deleted", async () => {
      const user = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a523dd",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "standard",
        token: "tok"
      };
      await User.create(user);

      const res = await server.inject({
        method: "DELETE",
        url: "/users/1753df50-9cbf-11e9-bf9b-6da555a523dd",
        payload: {}
      });

      should(res.statusCode).equal(200);
      should(res.payload).equal("1");
    });

    it("should return the code 200 and the message '0' if the user doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "DELETE",
        url: "/users/1753df50-9cbf-11e9-bf9b-6da555a523dd",
        payload: {}
      });

      should(res.statusCode).equal(200);
      should(res.payload).equal("0");
    });
  });
});
