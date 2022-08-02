const axios = require("axios");
const { map } = require("mssql");
const DButils = require("./DButils");
const matches_utils = require("./matches_utils");

async function getRoundDetails(round_id) {

  // get all matches from DB with this round id
  match_ids_from_db = await DButils.execQuery(`SELECT MatchId FROM dbo.Matches where RoundId = '${round_id}'`)
  match_ids_from_db = match_ids_from_db.map(f => f.MatchId)

  matches = await matches_utils.getMatchesDetails(match_ids_from_db)
  return {
    'id': round_id,
    'matches': matches
  };
}
exports.getRoundDetails = getRoundDetails;
