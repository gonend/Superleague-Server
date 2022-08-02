var express = require("express");
var router = express.Router();
const events_utils = require("./utils/events_utils");

router.post("/add", async (req, res, next) => {
  try {
    await events_utils.addEvent(
      req.body.matchId, 
      req.body.minute,
      req.body.eventType,
      req.body.description,
    );
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
