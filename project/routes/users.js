var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const matches_utils = require("./utils/matches_utils");

// add favorite match to a user
router.post("/favoriteMatch", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id = req.body.match_id;
    await users_utils.markMatchAsFavorite(user_id, match_id);
    res.status(201).send("The Match successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

// get all user's favorite matches
router.get("/favoriteMatches", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_ids = await users_utils.getFavoriteMatches(user_id);
    let match_ids_array = [];
    match_ids.map((element) => match_ids_array.push(element.MatchId));
    const results = await matches_utils.getMatchesDetails(match_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

// delete favorite match from user
router.delete("/favoriteMatch/:matchId", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const match_id = req.params.matchId;
    await users_utils.deleteFavoriteMatch(user_id, match_id);
    res.status(200).send("The Match successfully removed from favorites");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
