var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const match_utils = require("./utils/matches_utils");
const teams_utils = require("./utils/teams_utils");

router.get("/all", async (req, res, next) => {
  try {
    const team_details = await teams_utils.getAllTeams();
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

// search team by name
router.get("/search", async (req, res, next) => {
  try {
    //searching parameters
    teamName = req.query.name || ""
    limit = req.query.limit || 50
    offset = req.query.offset || 0
    sortField = req.query.sortField || ""
    sortOrder = req.query.sortOrder || "asc"

    const team_details = await teams_utils.getTeamDetailsByQuery(teamName, limit, offset, sortField, sortOrder);
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

// get team by team id
router.get("/:teamId", async (req, res, next) => {
  try {
    if (isNaN(parseInt(req.params.teamId))) {
      res.sendStatus(400)
    }
    const team_details = await teams_utils.getTeamDetails(req.params.teamId);
    if (team_details) {
      res.send(team_details);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;
