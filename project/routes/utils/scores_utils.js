const DButils = require("./DButils");

// add score to a match in DB
async function addScore(matchId, homeTeamGoals, awayTeamGoals) {
  await DButils.execQuery(
    `insert into dbo.Scores values (${matchId},${homeTeamGoals},${awayTeamGoals})`
  );
}

exports.addScore = addScore;
