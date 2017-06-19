/*
  ClassName: TournamentModel
  Purpose:   Extends the base model class to handle all the 
             tournament data used by the business logic tournamentController
*/

class TournamentModel extends Model {
  
  //Constructs an instance of the tournament model.
  constructor(numberOfTeams, teamsPerMatch, numberOfRounds) {
    super();
    this.set('id', null);
    this.set('teams', {});
    this.set('winner', {});

    this.set('numberOfTeams', numberOfTeams);
    this.set('teamsPerMatch', teamsPerMatch);
    this.set('numberOfRounds', numberOfRounds);
    this.set('roundMatchUps', this.initializeRoundMatchUps());
    this.set('numberOfMatches', this.numberOfMatches());
  }

  //Getter function for numberOfTeams parameter
  getNumberOfTeams() {
    return this.get('numberOfTeams');
  }

  //Getter function for teamsPerMatch parameter
  getTeamsPerMatch() {
    return this.get('teamsPerMatch');
  }

  //Getter function for numberOfRounds parameter
  getNumberOfRounds() {
    return this.get('numberOfRounds');
  }

  //Setter function for TournamentId parameter
  setTournamentId(tournamentId) {
    this.set('id', tournamentId);
  }

  //Getter function for tournamentId parameter
  getTournamentId() {
    return this.get('id');
  }

  //Setter function for winner parameter
  setWinner(winner) {
    return this.set('winner', winner);
  }

  //Getter function to get team object
  getTeam(teamId) {
    const teams = this.get('teams');
    return teams[teamId];
  }

  //Getter function to get the matches in a particular round 
  getRound(round) {
    const roundMatchUps = this.get('roundMatchUps');
    return roundMatchUps[round];
  }

  //Initializes a tournament structure with total match objects for a tournament
  initializeRoundMatchUps() {
    const numberOfTeams = this.get('numberOfTeams');
    const numberOfRounds = this.get('numberOfRounds');
    const teamsPerMatch = this.get('teamsPerMatch');

    const matches = [];
    let numberOfMatchesThisRound = numberOfTeams;

    for (let round = 0; round < numberOfRounds; round++) {
      matches[round] = [];
      numberOfMatchesThisRound /= teamsPerMatch;

      for (let match = 0; match < numberOfMatchesThisRound; match++) {
        matches[round].push({});
      }
    }
    return matches;
  }

  //Calculates and returns the total number of matches that will be played in the tournament
  numberOfMatches() {
    const numberOfTeams = this.get('numberOfTeams');
    const teamsPerMatch = this.get('teamsPerMatch');

    let rounds = numberOfTeams / teamsPerMatch;
    let matches = rounds;

    while (rounds > 1) {
      rounds /= teamsPerMatch;
      matches += rounds;
    }

    return matches;
  }

  //Getter function for numberOfMatches parameter
  getNumberOfMatches() {
    return this.get('numberOfMatches');
  }

  //Setter function for teams parameter
  setTeam(team) {
    const teams = this.get('teams');

    teams[team.teamId] = {
      teamId: team.teamId,
      name: team.name,
      score: team.score
    };

    this.set('teams', teams);
  }

  //Setter function to set match score for a match
  setMatchScore(round, match, score) {
    const roundMatchUps = this.get('roundMatchUps');
    const roundMatchUp = roundMatchUps[round][match];

    const scoredRoundMatchUp = Object.assign(roundMatchUp, { score: score });
    roundMatchUps[round][match] = scoredRoundMatchUp;
    this.set('roundMatchUps', roundMatchUps);
  }

  //Sets the matched for the specified round
  setRoundMatchUps(round, teams) {
    const roundMatchUps = this.get('roundMatchUps');
    const teamsPerMatch = this.get('teamsPerMatch');
    const numberOfMatches = roundMatchUps[round].length;

    const teamsCopy = Object.assign([], teams);

    for (let match = 0; match < numberOfMatches; match++) {
      const roundMatchUp = roundMatchUps[round][match];
      const teamIds = teamsCopy.splice(0, teamsPerMatch);
      const matchUps = Object.assign(roundMatchUp, { teamIds: teamIds });
      roundMatchUps[round][match] = matchUps;
      this.set('roundMatchUps', roundMatchUps);
    }
  }

  //Gets the team scores and further the match scores of matched in a round 
  getRoundScores(round) {
    const teams = this.get('teams');
    const roundMatchUps = this.get('roundMatchUps');

    const roundScores = [];

    for (let match = 0; match < roundMatchUps[round].length; match++) {
      const matchScore = roundMatchUps[round][match].score;
      const matchTeams = roundMatchUps[round][match].teamIds;
      const teamScores = {};

      for (let team = 0; team < matchTeams.length; team++) {
        const teamId = matchTeams[team];
        const teamScore = teams[teamId].score;
        teamScores[teamId] = teamScore;
      }

      roundScores.push({
        round: round,
        match: match,
        matchScore: matchScore,
        teamScores: teamScores
      });
    }
    return roundScores;
  }
}
