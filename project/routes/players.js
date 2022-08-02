var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

// search players by name
router.get("/search", async (req, res, next) => {
  try {
    // searching parameters
    player_name = req.query.name || ""
    position = req.query.position || ""
    limit = req.query.limit || 50
    offset = req.query.offset || 0
    sortField = req.query.sortField || ""
    sortOrder = req.query.sortOrder || "asc"

    if (!player_name) {
      res.send([]);
    } else {
      const player_details = await players_utils.getPlayerDetailsByQuery(player_name, position, limit, offset, sortField, sortOrder);
      res.send(player_details);
    }
  }
  catch (error) {
    next(error);
  }
});

// get player by id
router.get("/:playerId", async (req, res, next) => {
  try {
    if (isNaN(parseInt(req.params.playerId))) {
      res.sendStatus(400)
    }
    const player_details = await players_utils.getPlayerDetails(req.params.playerId);
    if (player_details) {
      res.send(player_details);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

// get team's players by team id
router.get("/findByTeam/:teamId", async (req, res, next) => {
  try {
    if (isNaN(parseInt(req.params.teamId))) {
      res.sendStatus(400)
    }
    const players_details = await players_utils.getPlayersByTeam(req.params.teamId);
    if (players_details) {
      res.send(players_details);
    }
    else {
      res.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});





module.exports = router;