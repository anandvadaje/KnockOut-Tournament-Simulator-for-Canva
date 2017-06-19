/*
  ClassName:  TournamentController
  Purpose:    Contains all the business logic to for finding the winner 
              of the tournament
*/
class TournamentController {

  //Instantiates TournamentController class
  constructor(tournamentModel, progressBar) {
    this.model = tournamentModel;
    this.progressBar = progressBar;
  }

  //Starts the business logic to run tournament
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
      this.SetMatchScores(TOURNAMENT.FIRST_ROUND),
      this.SetTeamScores(tournament.teams)
    ]);
    const winner = await this.GetWinner();
    elements.winnertitle.innerHTML = "The Winner is : ";
    elements.winner.innerHTML = winner.name;
    this.model.setWinner(winner);
  }

  //Set the team scores which it retrieves it from the server
  async SetTeamScores(teams) {
    try {
      const teamPromises = teams.map(async (teamId) => {
        const team = await TournamentAPI.getTeam(this.model.getTournamentId(), teamId);
        return team;
      });

      //Resolve promises and set the team scores in tournamentModel
      for (const teamPromise of teamPromises) {
        const team = await teamPromise;
        this.model.setTeam(team);
      }
    } catch (error) {
      console.log('setMatchScore error', error.toString());
    }
  }

  //Sets the matche scores of a round which is retrieved from the server
  async SetMatchScores(round) {
    try {
      const numberOfMatches = this.model.getRound(round).length;
      // Make an array from 0->numberOfMatches)
      const matches = [...Array(numberOfMatches).keys()];

      const matchPromises = matches.map(async (match) => {
        const matchScore = await TournamentAPI.getMatchScore(this.model.getTournamentId(), round, match);
        return matchScore;
      });

      //Resolve promises and set the team match score in tournamentModel
      for (const matchPromise of matchPromises) {
        const match = await matchPromise;
        this.model.setMatchScore(round, match.number, match.score);
      }
    } catch (error) {
      console.log('setMatchScore error', error.toString());
    }
  }

  //Runs the tournament further after first round and return the winner team object 
  async GetWinner() {
    try {
      for (let round = 0; round < this.model.getNumberOfRounds(); round++) {
        
        if (round != TOURNAMENT.FIRST_ROUND) await this.SetMatchScores(round);

        const roundScores = this.model.getRoundScores(round);
        const roundWinners = await this.GetRoundWinners(roundScores);
        
        if (round < this.model.getNumberOfRounds() - 1) {
          this.model.setRoundMatchUps(round + 1, roundWinners);
        } else {
          const winner = this.model.getTeam(roundWinners[0]);
          return winner;
        }
      }
    } catch (error) {
      console.log('GetWinner error', error.toString());
    }

    return null;
  }

  //Gets the winning team ids of a particular round
  async GetRoundWinners(matchScores) {
    try {
      const roundWinners = [];

      const roundScoresPromises = matchScores.map(async (match) => {
        const teamScores = Object
          .keys(match.teamScores)
          .map(teamId => match.teamScores[teamId]);

        const winner = await TournamentAPI.getRoundWinner(this.model.getTournamentId(), match.matchScore, teamScores, match.round, match.match);
        return winner;
      });

      // Resolve promises and find the winner
      for (const roundScoresPromise of roundScoresPromises) {
        const winner = await roundScoresPromise;
        const winningTeam = Object
          .keys(matchScores[winner.match].teamScores)
          .filter((teamId) => {
            const teamScore = matchScores[winner.match].teamScores[teamId];
            return teamScore === winner.score;
          })
          .reduce((currentTeamId, nextTeamId) => {
            // If tie, choose team with lowest ID
            return currentTeamId < nextTeamId ? currentTeamId : nextTeamId;
          });
  
          if (this.progressBar) {
          this.progressBar.update();
        }
        
        roundWinners.push(winningTeam);
      }
      return roundWinners;
    } catch (error) {
      console.log('GetRoundWinners error', error.toString());
    }

    return null;
  }
}
