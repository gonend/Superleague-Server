const axios = require("axios");
const league_utils = require("./league_utils")

const api_domain = "https://soccer.sportmonks.com/api/v2.0";

const team_by_ids_cache = {}
let all_teams_cache = []

async function getTeamDetails(team_id) {
  if (!team_by_ids_cache[team_id]) {
    const team = await axios.get(`${api_domain}/teams/${team_id}`,
      {
        params: {
          include: 'venue',
          api_token: process.env.sportmonks_api_token,
        },
      }
    );

    // return team object with the relevant information
    if (team.data.data) {
      team_by_ids_cache[team_id] = {
        id: team?.data?.data?.id,
        name: team?.data?.data?.name,
        stadiumId: team?.data?.data?.venue_id,
        stadium_name: team?.data?.data?.venue?.data?.name,
        logo: team?.data?.data?.logo_path,
      };
    }
    // Return stub data if reached max 
    else if (team.data.error.code === 429) {
      return {
        id: team_id,
        name: team_id + "(reached max)",
        stadiumId: '1',
        stadium_name: 'Camp Nou',
        logo: "http://t3.gstatic.com/images?q=tbn:ANd9GcTdlZboGqqXYQquR6s1qeDckeEdPetLAHMKbDaMpE0Pyn009AoV",
      };
    }
    else {
      team_by_ids_cache[team_id] = null
    }
  }

  return team_by_ids_cache[team_id]

}

async function getAllTeams() {
  if (all_teams_cache.length == 0) {
    league_data = await league_utils.getLeagueDetails()

    const teams = await axios.get(`${api_domain}/teams/season/${league_data.current_season_id}`,
      {
        params: {
          include: 'venue',
          api_token: process.env.sportmonks_api_token,
        },
      }
    );

    all_teams_cache = await extractDetailsFromTeamsList(teams.data.data)
  }

  return all_teams_cache
}

async function getTeamDetailsByQuery(team_name, limit, offset, sortField, sortOrder) {
  if (team_name == "") {
    team_name = "a"
  }
  const teams_from_api = await axios.get(`${api_domain}/teams/search/${team_name}`, {
    params: {
      include: 'venue',
      api_token: process.env.sportmonks_api_token,
    },
  });

  const teams = teams_from_api.data.data

  // sort by team name
  if (sortField.toLowerCase() == "teamname") {
    sorted_teams = teams.sort((a, b) => (a.name > b.name) ? 1 : -1)
  } else {
    sorted_teams = teams
  }

  if (sortOrder.toLowerCase() == "desc") {
    sorted_teams = sorted_teams.reverse()
  }
  // return all relevant teams with all relevant data
  return extractDetailsFromTeamsList(sorted_teams.splice(offset, limit));
}

async function extractDetailsFromTeamsList(teams_list) {
  return teams_list.map((team_info) => {
    const { id, logo_path, name, venue_id, venue } = team_info;
    return {
      id: id,
      name: name,
      stadiumId: venue_id,
      stadiumName: venue?.data?.name,
      logo: logo_path,
    };
  });
}

exports.getTeamDetails = getTeamDetails;
exports.getTeamDetailsByQuery = getTeamDetailsByQuery;
exports.getAllTeams = getAllTeams;
