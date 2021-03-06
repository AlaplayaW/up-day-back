const should = require("should");
const { init } = require("../src/server");
const { User } = require("../src/db/user/user.model");
const Event = require("../src/db/event/event.model");

describe("# Users routes", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("## GET /users", () => {
    it("should return the code 200 and an array containing all the users existing in the database if the requestor is admin", async () => {
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
        url: "/users",
        headers: {
          authorization: "myToken1"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match([user1, user2]);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users",
        payload: {},
        headers: {
          authorization: "anInvalidToken"
        }
      });

      should(res.statusCode).equal(403);
    });

    it("should return the code 403 if the requestor is not admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "standard",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/users",
        payload: {},
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## GET /users/{uuid}", () => {
    it("should return the code 200 and an object containing the user info if the user exists and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-123456789012",
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match({
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        email: "anyMail@gmail.com",
        role: "admin"
      });
    });

    it("should return the code 200 and 'null' if the user doesn't exist and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-111111111111",
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(200);
      should(res.payload).equal("");
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-111111111111",
        payload: {},
        headers: {
          authorization: "anInvalidToken"
        }
      });

      should(res.statusCode).equal(403);
    });

    it("should return the code 403 if the requestor is not admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "standard",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-123456789012",
        payload: {},
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## GET /users/{uuid}/events", () => {
    it("should return the code 200 and an array containing the user events if the user exists and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const event1 = {
        date: "2019-06-04T12:59:00.000Z",
        type: "pipi",
        nature: "normale",
        volume: "+++",
        context: ["fuite", "urgence"],
        comment: "pipi",
        uuid: "12345678-1234-1234-1234-123456789012"
      };
      const event2 = {
        date: "2019-06-05T13:59:00.000Z",
        type: "pipi",
        nature: "mitigé",
        volume: "+",
        context: ["fuite", "urgence"],
        comment: "gros pipi",
        uuid: "12345678-1234-1234-1234-123456789012"
      };
      await Event.create(event1);
      await Event.create(event2);

      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-123456789012/events",
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match([event1, event2]);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-123456789012/events",
        payload: {},
        headers: {
          authorization: "anInvalidToken"
        }
      });

      should(res.statusCode).equal(403);
    });

    it("should return the code 403 if the requestor is not admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "standard",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "GET",
        url: "/users/12345678-1234-1234-1234-123456789012/events",
        payload: {},
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## POST /users", () => {
    it("should return the code 200 and the user just created if the payload is properly field and if the user doesn't already exists in the database and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "Jiji",
          password: "1234",
          email: "Jiji@gmail.com",
          role: "admin"
        },
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(200);
      should(JSON.parse(res.payload)).match({
        name: "Jiji",
        email: "Jiji@gmail.com",
        role: "admin"
      });
    });

    it("should return the code 400 if the payload is not properly filled and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {},
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(400);
    });

    it("should return the code 400 if the user already exist in the database and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "anyName",
          password: "anyPassword",
          email: "anyMail@gmail.com",
          role: "admin"
        },
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(400);
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {},
        headers: {
          authorization: "toto"
        }
      });

      should(res.statusCode).equal(403);
    });

    it("should return the code 403 if the requestor is not admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "standard",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: {
          name: "anyName",
          password: "anyPassword",
          email: "anyMail@gmail.com",
          role: "standard"
        },
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(403);
    });
  });

  describe("## DELETE /users/{uuid}", () => {
    it("should return the code 200 and the message '1' if the user has been successfully deleted and if the requestor is admin", async () => {
      const user = {
        uuid: "1753df50-9cbf-11e9-bf9b-6da555a523dd",
        name: "Chuck",
        password: "Norris",
        email: "myMail@gmail.com",
        role: "admin",
        token: "tok"
      };
      await User.create(user);

      const res = await server.inject({
        method: "DELETE",
        url: "/users/1753df50-9cbf-11e9-bf9b-6da555a523dd",
        payload: {},
        headers: {
          authorization: "tok"
        }
      });

      should(res.statusCode).equal(200);
      should(res.payload).equal("1");
    });

    it("should return the code 200 and the message '0' if the user doesn't exist in the database and if the requestor is admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "admin",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "DELETE",
        url: "/users/1753df50-9cbf-11e9-bf9b-6da555a523dd",
        payload: {},
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(200);
      should(res.payload).equal("0");
    });

    it("should return the code 403 if the token provided in the hearder doesn't exist in the database", async () => {
      const res = await server.inject({
        method: "DELETE",
        url: "/users/1753df50-9cbf-11e9-bf9b-6da555a523dd",
        payload: {},
        headers: {
          authorization: "toto"
        }
      });

      should(res.statusCode).equal(403);
    });

    it("should return the code 403 if the requestor is not admin", async () => {
      const user = {
        uuid: "12345678-1234-1234-1234-123456789012",
        name: "anyName",
        password: "anyPassword",
        email: "anyMail@gmail.com",
        role: "standard",
        token: "aValidToken"
      };
      await User.create(user);

      const res = await server.inject({
        method: "DELETE",
        url: "/users/12345678-1234-1234-1234-123456789012",
        payload: {},
        headers: {
          authorization: "aValidToken"
        }
      });

      should(res.statusCode).equal(403);
    });
  });
});
