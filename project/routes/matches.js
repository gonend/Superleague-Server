var express = require("express");
var router = express.Router();
const matches_utils = require("./utils/matches_utils");

router.get("/all", async (req, res, next) => {
  try {
    const matches_details = await matches_utils.getAllMatches();
    res.send(matches_details);
  } catch (error) {
    next(error);
  }
});

// get match by match id
router.get("/:matchId", async (req, res, next) => {
  try {
    if (isNaN(parseInt(req.params.matchId))) {
      res.sendStatus(400)
    }
    const match_details = await matches_utils.getMatchDetails(req.params.matchId);
    if (match_details) {
      res.send(match_details);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

// get list of matches by ids
router.get("/list/:matchIds", async (req, res, next) => {
  try {
    matchIds = req.params.matchIds.split(',')
    for (i = 0; i < matchIds.length; i++) {
      if (isNaN(parseInt(matchIds[i]))) {
        res.sendStatus(400)
      }
    }
    const matches_details = await matches_utils.getMatchesDetails(matchIds);
    if (matches_details) {
      res.send(matches_details);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

// get team's matches
router.get("/findByTeam/:teamId", async (req, res, next) => {
  try {
    if (isNaN(parseInt(req.params.teamId))) {
      res.sendStatus(400)
    }
    const matches_details = await matches_utils.getMatchesByTeam(req.params.teamId);
    if (matches_details) {
      res.send(matches_details);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

// add new match
router.post("/add", async (req, res, next) => {
  try {
    matchId = await matches_utils.addMatch(
      ~~req.body.roundId,
      ~~req.body.homeTeamId,
      ~~req.body.awayTeamId,
      req.body.refereeName,
      req.body.startTime,
    );

    const match_details = await matches_utils.getMatchDetails(matchId);

    res.status(201).send(match_details)
  }
  catch (error) {
    next(error);
  }
})

module.exports = router;
