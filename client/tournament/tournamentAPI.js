/**
 * Tournament API wrapper for sending requests to the server.
 *
 * @external HTTPRequest
 * @class TournamentAPI
 */
class TournamentAPI {
  /**
   * Creates a tournament from the server.
   *
   * @static
   * @param {number} numberOfTeams - The number of teams.
   * @param {number} teamsPerMatch - The number of teams per match.
   * @returns {Object} The tournament ID and the entire list of teams.
   * @example <caption>Example first round object.</caption>
   * {
   *  tournamentId: 0,
   *  teamIds: [1, 2, 3, 4, 5, 7, 8]
   * }
   */
  static async createTournament(numberOfTeams, teamsPerMatch) {
    const url = ENDPOINTS.TOURNAMENT_ENDPOINT;
    const parameters = {
      numberOfTeams: numberOfTeams,
      teamsPerMatch: teamsPerMatch
    };

    try {
      const firstRound = await HTTPRequestHandler.post(url, parameters);
      // Create flat list of team IDs
      const firstRoundTeams = firstRound.matchUps
        .map((match) => match.teamIds)
        .reduce((currentMatchUp, nextMatchUp) => {
          return currentMatchUp.concat(nextMatchUp);
        });

      return {
        tournamentId: firstRound.tournamentId,
        teams: firstRoundTeams
      }
    } catch (error) {
      console.log('createTournament error', error.message);
    }
  }

  /**
   * Gets the winning score of a round/match from the server.
   *
   * @static
   * @param {number} tournamentId - The tournament ID.
   * @param {number} matchScore - The score of this match.
   * @param {number[]} teamScores - List of team scores.
   * @param {number} round - The round number.
   * @param {number} match - The match number.
   * @returns {Object} Winner of the round
   * @example <caption>Example winner object.</caption>
   * {
   *  score: 69,
   *  round: 0,
   *  match: 0
   * }
   */
  static async getRoundWinner(tournamentId, matchScore, teamScores, round, match) {
    const url = ENDPOINTS.WINNER_ENDPOINT;
    const parameters = {
      tournamentId: tournamentId,
      teamScores: teamScores,
      matchScore: matchScore
    };

    try {
      const winner = await HTTPRequestHandler.get(url, parameters);
      return {
        score: winner.score,
        round: round,
        match: match
      };
    } catch (error) {
      console.log('_getWinner error', error.toString());
    }
  }

  /**
   * Gets the score of a round/match from the server.
   *
   * @static
   * @param {number} tournamentId - The tournament ID.
   * @param {number} round - The round number.
   * @param {number} match - The match number.
   * @returns {Object} The score of the match, as well as the match and round number for reference
   * @example <caption>Example match score object.</caption>
   * {
   *  score: 69,
   *  number: 0, // match number
   *  round: 0
   * }
   */
  static async getMatchScore(tournamentId, round, match) {
    const url = ENDPOINTS.MATCH_SCORE_ENDPOINT;
    const parameters = {
      tournamentId: tournamentId,
      round: round,
      match: match
    };

    try {
      const matchScore = await HTTPRequestHandler.get(url, parameters);
      return {
        score: matchScore.score,
        number: match,
        round: round
      }
    } catch (error) {
      console.log('getTeam error', error.toString());
    }
  }

  /**
   * Gets a team from the server.
   *
   * @static
   * @param {number} tournamentId - The tournament ID.
   * @param {number} teamId - The ID of the team.
   * @returns {Object} Team
   * @example <caption>Example team object.</caption>
   * {
   *  teamId: 1,
   *  name: 'Malicious Tall Jan',
   *  score: 69
   * }
   */
  static async getTeam(tournamentId, teamId) {
    const url = ENDPOINTS.TEAM_ENDPOINT;
    const parameters = {
      tournamentId: tournamentId,
      teamId: teamId
    };

    try {
      const team = await HTTPRequestHandler.get(url, parameters);
      return team;
    } catch(error) {
      console.log('getTeam error', error.toString());
    }
  }
}
