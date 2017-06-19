/*
  ClassName: TournamentAPI
  Purpose:   To make the required get and post requests
             to the server to get the required data.
*/
class TournamentAPI {
  /*
    Creates a tournament for the specified numberOfTeams
    and teamsPerMatch values.
  */
  static async createTournament(numberOfTeams, teamsPerMatch) {
    const url = ENDPOINTS.TOURNAMENT_ENDPOINT;
    const parameters = {
      numberOfTeams: numberOfTeams,
      teamsPerMatch: teamsPerMatch
    };

    try {
      const firstRound = await HTTPRequestHandler.post(url, parameters);
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

   /*
    Gets the team data from the server
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

  /*
    Gets the match data from the server which is
    further used to get the winning team score
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
  
  /*
    Gets the winning team score of the match from the server
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
      console.log('getWinner error', error.toString());
    }
  }
}
