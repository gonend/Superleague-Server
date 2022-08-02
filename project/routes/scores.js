var express = require("express");
var router = express.Router();
const scores_utils = require("./utils/scores_utils");

// add score to a match
router.post("/add", async (req, res, next) => {
  try {
    await scores_utils.addScore(
      req.body.matchId, 
      req.body.home,
      req.body.away
    );
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
