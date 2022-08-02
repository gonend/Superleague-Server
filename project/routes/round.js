var express = require("express");
var router = express.Router();
const round_utils = require("./utils/round_utils");

// get round by round id
router.get("/:roundId", async (req, res, next) => {
  try {
    if (isNaN(parseInt(req.params.roundId))) {
      res.sendStatus(400)
    }
    const round_details = await round_utils.getRoundDetails(req.params.roundId);
    if (round_details) {
      res.send(round_details);
    }
    else {
      res.sendStatus(404)
    }
  } catch (error) {
    // if the round id not belong to current league or season
    if (error.response.status == 403) {
      res.sendStatus(404)
    } else {
      next(error);
    }
  }
});

module.exports = router;
