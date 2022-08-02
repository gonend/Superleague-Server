const DButils = require("./DButils");
const teams_utils = require("./teams_utils");

// return all the match details from DB
async function getMatchDetails(match_id) {
  match_from_db = await getMatchFromDb(match_id)

  return match_from_db
}

async function getMatchesDetails(match_ids) {
  if (match_ids.length == 0) {
    return []
  }
  const dbResults = await DButils.execQuery(`SELECT * FROM dbo.Matches where MatchId IN (${match_ids})`)
  const future_matches = dbResults.filter(x => !!x).sort((a, b) => (a.Start > b.Start) ? 1 : -1)
  return await populateDbMatches(future_matches)
}

async function getAllMatches() {
  const dbResults = await DButils.execQuery(`SELECT * FROM dbo.Matches`)

  const matches = await populateDbMatches(dbResults)

  return matches
}

async function populateDbMatches(db_matches) {
  const match_ids = db_matches.map(match => match.MatchId)
  const scores = await DButils.execQuery(`SELECT MatchId, HomeGoals, AwayGoals FROM dbo.Scores where MatchId IN (${match_ids})`);
  const events = await DButils.execQuery(`SELECT MatchId, Minute, EventType, Descrip FROM dbo.Events where MatchId IN (${match_ids})`);

  matches = []
  for (i = 0; i < db_matches.length; i++) {
    const curr_db_match = db_matches[i]
    const curr_match_id = curr_db_match.MatchId
    const match_score = scores.find(score => score.MatchId == curr_match_id)
    const match_events = events.filter(event => event.MatchId == curr_match_id)
    const match = await populateDbMatchWithScoreAndEvents(curr_db_match, match_score, match_events);
    matches.push(match)
  }

  return matches
}

async function populateDbMatchWithScoreAndEvents(match, match_score, match_events) {
  // get match's events objects sort by minute
  const eventsToReturn = match_events.map(event => ({
    'minute': event.Minute,
    'description': event.Descrip,
    'type': event.EventType
  })).sort((a, b) => (a.minute > b.minute) ? 1 : -1)

  // get teams information to return in match object
  let home_team_info = await teams_utils.getTeamDetails(match.HomeTeamId)
  let away_team_info = await teams_utils.getTeamDetails(match.AwayTeamId)

  // In case the API is down / maximum requests
  if (!home_team_info) {
    home_team_info = {
      stadiumId: "1",
      stadium_name: "Sami Offer",
      name: "Hapoel haifa",
      logo: "https://upload.wikimedia.org/wikipedia/he/thumb/a/a2/Hapoel_Haifa_Football_Club_Logo.png/400px-Hapoel_Haifa_Football_Club_Logo.png",
    }
  }

  if (!away_team_info) {
    away_team_info = {
      stadiumId: "2",
      stadium_name: "Camp Nou",
      name: "Barcelona",
      logo: "http://t3.gstatic.com/images?q=tbn:ANd9GcTdlZboGqqXYQquR6s1qeDckeEdPetLAHMKbDaMpE0Pyn009AoV",
    }
  }

  return {
    id: match?.MatchId,
    league_id: match?.LeagueId,
    season_id: match?.SeasonId,
    round_id: match?.RoundId,
    stadium: {
      id: home_team_info?.stadiumId,
      name: home_team_info?.stadium_name
    },
    home_team: {
      id: match?.HomeTeamId,
      name: home_team_info?.name,
      stadium_id: home_team_info?.stadiumId,
      stadium_name: home_team_info?.stadium_name,
      team_logo: home_team_info?.logo,
    },
    away_team: {
      id: match?.AwayTeamId,
      name: away_team_info?.name,
      stadium_id: away_team_info?.stadiumId,
      stadium_name: away_team_info?.stadium_name,
      team_logo: away_team_info?.logo,
    },
    referee: {
      name: match?.RefereeName,
    },
    events: eventsToReturn,
    start: match?.StartTime,
    home_team_goals: getHomeScore(match_score),
    away_team_goals: getAwayScore(match_score),
    status: getCurrentDbGameStatus(match_score, match)
  };
}

async function getMatchesByTeam(team_id) {
  start_date = `2020-08-02`
  end_date = `2021-07-02`

  matchesFromDB = await getMatchesFromDbByTeamId(team_id)

  return matchesFromDB.sort((a, b) => (a.start > b.start) ? 1 : -1)
}

// returns the relevant match data from DB according to match id
async function getMatchFromDb(match_id) {
  const dbResults = await DButils.execQuery(`SELECT * FROM dbo.Matches where MatchId = '${match_id}'`)
  const match = dbResults[0]

  if (match) {
    return await populateDbMatch(match);
  }
  else {
    return null
  }
}

async function getMatchesFromDbByTeamId(team_id) {
  const dbResults = await DButils.execQuery(`SELECT * FROM dbo.Matches where HomeTeamId = '${team_id}' or AwayTeamId = '${team_id}'`)
  matches = await populateDbMatches(dbResults)
  return matches
}

// returns the match object with the relevant details
async function populateDbMatch(match) {
  // get scores and events in the match according to match id
  const scores = await DButils.execQuery(`SELECT HomeGoals, AwayGoals FROM dbo.Scores where MatchId = '${match.MatchId}'`);
  const events = await DButils.execQuery(`SELECT Minute, EventType, Descrip FROM dbo.Events where MatchId = '${match.MatchId}'`);

  // get match's events objects sort by minute
  const eventsToReturn = events.map(event => ({
    'minute': event.Minute,
    'description': event.Descrip,
    'type': event.EventType
  })).sort((a, b) => (a.minute > b.minute) ? 1 : -1)

  // get teams information to return in match object
  let home_team_info = await teams_utils.getTeamDetails(match.HomeTeamId)
  let away_team_info = await teams_utils.getTeamDetails(match.AwayTeamId)

  // In case the API is down / maximum requests
  if (!home_team_info) {
    home_team_info = {
      stadiumId: "1",
      stadium_name: "Sami Offer",
      name: "Hapoel haifa",
      logo: "https://upload.wikimedia.org/wikipedia/he/thumb/a/a2/Hapoel_Haifa_Football_Club_Logo.png/400px-Hapoel_Haifa_Football_Club_Logo.png",
    }
  }

  if (!away_team_info) {
    away_team_info = {
      stadiumId: "2",
      stadium_name: "Camp Nou",
      name: "Barcelona",
      logo: "http://t3.gstatic.com/images?q=tbn:ANd9GcTdlZboGqqXYQquR6s1qeDckeEdPetLAHMKbDaMpE0Pyn009AoV",
    }
  }

  return {
    id: match?.MatchId,
    league_id: match?.LeagueId,
    season_id: match?.SeasonId,
    round_id: match?.RoundId,
    stadium: {
      id: home_team_info?.stadiumId,
      name: home_team_info?.stadium_name
    },
    home_team: {
      id: match?.HomeTeamId,
      name: home_team_info?.name,
      stadium_id: home_team_info?.stadiumId,
      stadium_name: home_team_info?.stadium_name,
      team_logo: home_team_info?.logo,
    },
    away_team: {
      id: match?.AwayTeamId,
      name: away_team_info?.name,
      stadium_id: away_team_info?.stadiumId,
      stadium_name: away_team_info?.stadium_name,
      team_logo: away_team_info?.logo,
    },
    referee: {
      name: match?.RefereeName,
    },
    events: eventsToReturn,
    start: match?.StartTime,
    home_team_goals: getHomeScore(scores[0]),
    away_team_goals: getAwayScore(scores[0]),
    status: getCurrentDbGameStatus(scores[0], match)
  };
}

// add match to DB
async function addMatch(roundId, homeTeamId, awayTeamId, refereeName, startTime) {
  await DButils.execQuery(
    `insert into dbo.Matches (RoundId,HomeTeamId,AwayTeamId,RefereeName,StartTime)`
    + ` values (${roundId},${homeTeamId},${awayTeamId},'${refereeName}','${startTime}')`
  );

  id = await DButils.execQuery(
    `select @@identity`
  );

  return id[0]['']
}

function getHomeScore(score) {
  if (score) {
    return score.HomeGoals
  }
  else {
    return null
  }
}

function getAwayScore(score) {
  if (score) {
    return score.AwayGoals
  } else {
    return null
  }
}

function getCurrentDbGameStatus(score, match) {
  current_time = new Date().getTime();
  starting_at = Date.parse(match.StartTime)

  if (current_time < starting_at)
    return 'future';
  else if (score) {
    return 'done';
  } else {
    return 'playing';
  }
}


exports.getMatchDetails = getMatchDetails;
exports.getMatchesDetails = getMatchesDetails;
exports.getMatchesByTeam = getMatchesByTeam;
exports.addMatch = addMatch;
exports.getAllMatches = getAllMatches;
