const Event = require("../db/event/event.model");
const { deleteEvent } = require("../db/event/event.actions");
const Joi = require("@hapi/joi");

module.exports = [
  {
    method: "GET",
    path: "/events",
    options: {
      auth: false
    },
    handler: function() {
      return Event.findAll().catch(err => console.log(err));
    }
  },
  {
    method: "GET",
    path: "/events/{userId}",
    handler: function(request) {
      const userId = request.params.userId;
      return Event.findAll({
        where: {
          userId: userId
        }
      }).catch(err => console.log(err));
    },
    options: {
      auth: false,
      validate: {
        params: {
          userId: Joi.number()
            .integer()
            .required()
        }
      }
    }
  },
  {
    method: "POST",
    path: "/events",
    options: {
      auth: false
    },
    handler: function(request, h) {
      if (
        !request.payload ||
        !request.payload.hasOwnProperty("date") ||
        !request.payload.hasOwnProperty("type") ||
        !request.payload.hasOwnProperty("nature") ||
        !request.payload.hasOwnProperty("volume")
      ) {
        return h.response("Wrong payload").code(500);
      }
      return Event.create(request.payload).catch(err => console.log(err));
    }
  },
  {
    method: "DELETE",
    path: "/events/{id}",
    handler: async function(request, h) {
      const eventId = request.params.id;
      const nbDeletedEvent = await deleteEvent(eventId);
      if (nbDeletedEvent === 0) {
        return h.response("This event id doesn't exist").code(400);
      }
      return h.response(`Event ${eventId} deleted`).code(200);
    },
    options: {
      auth: false,
      validate: {
        params: {
          id: Joi.number()
            .integer()
            .required()
        }
      }
    }
  }
];
