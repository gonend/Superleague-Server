const DButils = require("./DButils");

// add match to favorites
async function markMatchAsFavorite(user_id, match_id) {

  favorite_matches = await getFavoriteMatches(user_id)
  if (favorite_matches.find(f => f.MatchId == match_id)) {
    return;
  } else {
    await DButils.execQuery(
      `insert into FavoriteMatches values (${user_id},${match_id})`
    );
  }
}

// returns all favorite matches
async function getFavoriteMatches(user_id) {
  const match_ids = await DButils.execQuery(
    `select MatchId from FavoriteMatches where UserId=${user_id}`
  );
  return match_ids;
}

// remove match from favorites
async function deleteFavoriteMatch(user_id, match_id) {
  await DButils.execQuery(
    `delete from FavoriteMatches where UserId=${user_id} and MatchId=${match_id}`
  );
}

exports.markMatchAsFavorite = markMatchAsFavorite;
exports.getFavoriteMatches = getFavoriteMatches;
exports.deleteFavoriteMatch = deleteFavoriteMatch;
