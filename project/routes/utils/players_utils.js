const axios = require("axios");
const teams_utils = require("./teams_utils")
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

const country_id = '320'
const players_by_team = {}

async function getPlayersIdsByTeamId(team_id) {
  let player_ids_list = [];
  try {
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "squad",
        api_token: process.env.sportmonks_api_token,
      },
    });
    team.data.data.squad.data.map((player) =>
      player_ids_list.push(player.player_id)
    );
    return player_ids_list;
  } catch {
    // Handle 429 error
    return [1, 2, 3, 4, 5]
  }
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.sportmonks_api_token,
          include: "team, position",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

// get all relevant data of player
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info, index) => {
    if (player_info.data && player_info.data.data) {
      const { birthcountry, weight, common_name, birthdate, height, image_path, position, player_id, nationality } = player_info.data.data;
      const { id, name, stadiumId, logo_path } = player_info.data.data.team.data;
      return {
        id: player_id,
        name: common_name,
        nationality: nationality,
        birthDate: birthdate,
        birthCountry: birthcountry,
        height: height,
        weight: weight,
        team: {
          id: id,
          name: name,
          stadiumId: stadiumId,
          logo: logo_path,
        },
        picture: image_path,
        position: {
          name: position?.data?.name,
          id: position?.data?.id,
        }
      };
      // Handle 429 error (plan max)
    } else {
      return {
        id: index + 1,
        name: 'Player name',
        nationality: 'Israel',
        birthDate: "31/03/1985",
        birthCountry: 'Denmark',
        height: '188 cm',
        weight: '78 kg',
        team: {
          id: 939,
          name: 'Midtjylland',
          stadiumId: '5',
          logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/FC_Midtjylland_logo.svg/400px-FC_Midtjylland_logo.svg.png',
        },
        picture: "https://cdn.sportmonks.com/images/soccer/players/24/82808.png",
        position: {
          id: 1,
          name: 'Goalkeeper',
        }
      };
    }

  });
}

async function getPlayersByTeam(team_id) {
  if (!players_by_team[team_id]) {
    let player_ids_list = await getPlayersIdsByTeamId(team_id);
    if (!player_ids_list) {
      players_by_team[team_id] = []
    } else {
      let players_info = await getPlayersInfo(player_ids_list);
      players_by_team[team_id] = players_info;
    }
  }

  return players_by_team[team_id]
}

// returns object of player with all relevant information
async function getPlayerDetails(player_id) {
  const player = await axios.get(`${api_domain}/players/${player_id}`,
    {
      params: {
        api_token: process.env.sportmonks_api_token,
        include: "position",
      },
    }
  );

  if (player.data.data) {
    const team_details = await teams_utils.getTeamDetails(player.data.data.team_id)

    return {
      id: player?.data?.data?.player_id,
      name: player?.data?.data?.fullname,
      position: {
        id: player?.data?.data?.position?.data?.id,
        name: player?.data?.data?.position?.data?.name,
      },
      nationality: player?.data?.data?.nationality,
      birthDate: player?.data?.data?.birthdate,
      birthCountry: player?.data?.data?.birthcountry,
      team: {
        id: team_details?.id,
        name: team_details?.name,
        stadiumId: team_details?.stadiumId,
        logo: team_details?.logo,
      },
      height: player?.data?.data?.height,
      weight: player?.data?.data?.weight,
      picture: player?.data?.data?.image_path,
    };
  }
  else if (player?.data?.error && player?.data?.error?.code == 429) {
    return {
      id: player_id,
      name: 'Player name',
      nationality: 'Israel',
      birthDate: "31/03/1985",
      birthCountry: 'Denmark',
      height: '188 cm',
      weight: '78 kg',
      team: {
        id: 939,
        name: 'Midtjylland',
        stadiumId: '5',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/FC_Midtjylland_logo.svg/400px-FC_Midtjylland_logo.svg.png',
      },
      picture: "https://cdn.sportmonks.com/images/soccer/players/24/82808.png",
      position: {
        id: 1,
        name: 'Goalkeeper',
      }
    };
  } else {
    return null
  }
}

// get player from query
async function getPlayerDetailsByQuery(player_name, position, limit, offset, sortField, sortOrder) {
  const players_from_api = await axios.get(`${api_domain}/players/search/${player_name}`, {
    params: {
      include: 'team,position',
      api_token: process.env.sportmonks_api_token,
    },
  });

  players = players_from_api.data.data

  // find player by country (league) only if they have team
  filtered_by_team_country = players.filter(player => player.team_id && player.team && player.team.data.country_id == country_id)

  player_name_lower_case = player_name.toLowerCase()
  // find players by name from the relevant league, and only if they include the whole searching name
  filtered_by_name = filtered_by_team_country.filter(player => player.display_name && player.display_name.toLowerCase().includes(player_name_lower_case))

  position_lower_case = position.toLowerCase()
  // find player by position
  filtered_by_position = filtered_by_name.filter(player => player.position_id && player.team_id && (!position || (player.position && player.position.data && player.position.data.name.toLowerCase().includes(position_lower_case))))

  // sorting the results by team or player
  if (sortField.toLowerCase() == "teamname") {
    sorted_players = filtered_by_position.sort((a, b) => (a.team.data.name > b.team.data.name) ? 1 : -1)
  } else if (sortField.toLowerCase() == "playername") {
    sorted_players = filtered_by_position.sort((a, b) => (a.display_name > b.display_name) ? 1 : -1)
  } else {
    sorted_players = filtered_by_position
  }

  if (sortOrder.toLowerCase() == "desc") {
    sorted_players = sorted_players.reverse()
  }

  // amount players to display
  paged_players = sorted_players.splice(offset, limit)

  // return player object with all relevant data
  return paged_players.map(player => extractDetailsFromPlayer(player))
}

function extractDetailsFromPlayer(player) {
  return {
    id: player?.player_id,
    name: player?.display_name,
    position: {
      id: player?.position?.data?.id,
      name: player?.position?.data?.name,
    },
    nationality: player?.nationality,
    birthDate: player?.birthdate,
    birthCountry: player?.birthcountry,
    team: {
      id: player?.team?.data?.id,
      name: player?.team?.data?.name,
      stadiumId: player?.team?.data?.venue_id,
      logo: player?.team?.data?.logo_path,
    },
    height: player?.height,
    weight: player?.weight,
    picture: player?.image_path,
  };
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerDetails = getPlayerDetails;
exports.getPlayerDetailsByQuery = getPlayerDetailsByQuery;