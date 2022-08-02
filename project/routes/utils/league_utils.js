const axios = require("axios");
const LEAGUE_ID = 271;
const api_domain = "https://soccer.sportmonks.com/api/v2.0"

// get the league data
async function getLeagueDetails() {
  const league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.sportmonks_api_token,
      },
    }
  );

  return {
    id: league?.data?.data?.id,
    name: league?.data?.data?.name,
    current_season_id: league?.data?.data?.current_season_id,
    current_round_id: league?.data?.data?.current_round_id,
    current_season_name: league?.data?.data?.season?.data.name,
  };
}
exports.getLeagueDetails = getLeagueDetails;
