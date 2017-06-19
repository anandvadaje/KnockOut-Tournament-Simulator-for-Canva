/**
 * Tournament controller that coordinates with the tournament API to simulate a tournament.
 */
class TournamentController {
  /**
   * Creates an instance of TournamentController.
   *
   * @param {Object} tournamentModel - The TournamentModel to attach.
   */
  constructor(tournamentModel, progressBar) {
    this.model = tournamentModel;
    this.progressBar = progressBar;
  }

  /**
   * Main method to begin the tournament simulation.
   *
   * @returns {void}
   */
  async run() {
    this.progressBar.remove();
    
    if (this.progressBar) {
      this.progressBar.init();
    }
    const tournament = await TournamentAPI.createTournament(this.model.getNumberOfTeams(), this.model.getTeamsPerMatch());

    this.model.setTournamentId(tournament.tournamentId);
    this.model.setRoundMatchUps(TOURNAMENT.FIRST_ROUND, tournament.teams);
    if (this.progressBar) {
      this.progressBar.update();
    }
    await Promise.all([
      this._setMatchScores(TOURNAMENT.FIRST_ROUND),
      this._setTeamScores(tournament.teams)
    ]);
    const winner = await this._getWinner();
    elements.winnertitle.innerHTML = "The winner is: ";
    elements.winner.innerHTML = winner.name;
    this.model.setWinner(winner);
  }

  /**
   * Simulates the 'rest' of the tournament matches after the first round.
   *
   * @returns {Object} Winner of the tournament
   * @example <caption>Example winner object.</caption>
   * {
   *  teamId: 1,
   *  name: 'Malicious Tall Jan',
   *  score: 69
   * }
   */
  async _getWinner() {
    try {
      for (let round = 0; round < this.model.getNumberOfRounds(); round++) {
        // Avoid trip to server since we already have first round scores
        if (round != TOURNAMENT.FIRST_ROUND) await this._setMatchScores(round);

        // Get this round's scores and winners
        const roundScores = this.model.getRoundScores(round);
        const roundWinners = await this._getRoundWinners(roundScores);
        
        if (round < this.model.getNumberOfRounds() - 1) {
          // Set the next round of matchups
          this.model.setRoundMatchUps(round + 1, roundWinners);
        } else {
          // Final round, return the winner
          const winner = this.model.getTeam(roundWinners[0]);
          return winner;
        }
      }
    } catch (error) {
      console.log('_getWinner error', error.toString());
    }

    return null;
  }

  /**
   * Gets the winning team ID given the match scores for a given round.
   *
   * Requests for each match of the round are first aggregated as promises
   * and then asynchronously retrieved to save a sever round-trip.
   *
   * @param {Object[]} matchScores - The match score as well as the team scores for this round (see example below)
   * @returns {number[]} The winning team ID
   * @example <caption>Example match scores object.</caption>
   * [ // Array indexed by match number
   *  { round: 0, match: 0, matchScore: 49, teamScores: {0: 83, 1: 99} }, // teamScores indexed by team ID
   *  { round: 0, match: 1, matchScore: 68, teamScores: {2: 68, 3: 18} }
   * ]
   */
  async _getRoundWinners(matchScores) {
    try {
      const roundWinners = [];

      // Map array of team scores to promises
      const roundScoresPromises = matchScores.map(async (match) => {
        // Hacky way to iterate over objects like an array
        const teamScores = Object
          .keys(match.teamScores)
          .map(teamId => match.teamScores[teamId]);

        // Create promise to later resolve
        const winner = await TournamentAPI.getRoundWinner(this.model.getTournamentId(), match.matchScore, teamScores, match.round, match.match);
        return winner;
      });

      // Resolve promises and find the winner
      for (const roundScoresPromise of roundScoresPromises) {
        const winner = await roundScoresPromise;
        // Iterate over team scores
        const winningTeam = Object
          .keys(matchScores[winner.match].teamScores)
          .filter((teamId) => {
            // Find team ID with matching score
            const teamScore = matchScores[winner.match].teamScores[teamId];
            return teamScore === winner.score;
          })
          .reduce((currentTeamId, nextTeamId) => {
            // Break ties: choose team with lowest ID
            return currentTeamId < nextTeamId ? currentTeamId : nextTeamId;
          });
          if (this.progressBar) {
          this.progressBar.update();
        }
          roundWinners.push(winningTeam);
      }

      return roundWinners;
    } catch (error) {
      console.log('_getRoundWinners error', error.toString());
    }

    return null;
  }

  /**
   * Gets the team scores from the server and sets them in the tournament model.
   *
   * Requests for each team score are first aggregated as promises
   * and then asynchronously retrieved to save a sever round-trip.
   *
   * @param {number[]} teams - Array of team IDs.
   * @returns {void}
   */
  async _setTeamScores(teams) {
    try {
      // Map array of team IDs to promises
      const teamPromises = teams.map(async (teamId) => {
        // Create promise to later resolve
        const team = await TournamentAPI.getTeam(this.model.getTournamentId(), teamId);
        return team;
      });

      // Resolve promises and set the team in the model
      for (const teamPromise of teamPromises) {
        const team = await teamPromise;
        this.model.setTeam(team);
      }
    } catch (error) {
      console.log('setMatchScore error', error.toString());
    }
  }

  /**
   * Gets the match scores for a round from the server and sets them in the tournament model.
   *
   * Requests for each match score are first aggregated as promises
   * and then asynchronously retrieved to save a sever round-trip.
   *
   * @param {number} round - The round number.
   * @returns {void}
   */
  async _setMatchScores(round) {
    try {
      const numberOfMatches = this.model.getRound(round).length;
      // Potentially hacky way to make an array from 0 -> numberOfMatches :)
      const matches = [...Array(numberOfMatches).keys()];

      // Map array of match numbers to promises
      const matchPromises = matches.map(async (match) => {
        // Create promise to later resolve
        const matchScore = await TournamentAPI.getMatchScore(this.model.getTournamentId(), round, match);
        return matchScore;
      });

      // Resolve promises and set the match score for the team in the model
      for (const matchPromise of matchPromises) {
        const match = await matchPromise;
        this.model.setMatchScore(round, match.number, match.score);
      }
    } catch (error) {
      console.log('setMatchScore error', error.toString());
    }
  }
}
