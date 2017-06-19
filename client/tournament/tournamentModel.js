/**
 * Tournament model representing the state of the tournament.
 * @extends Model
 */
class TournamentModel extends Model {
  /**
   * Creates an instance of TournamentModel.
   *
   * @param {number} numberOfTeams - Number of teams playing in the tournament.
   * @param {number} teamsPerMatch - Number of teams that play per match.
   * @param {any} numberOfRounds - Number of rounds that will be played.
   * @returns {void}
   */
  constructor(numberOfTeams, teamsPerMatch, numberOfRounds) {
    super();
    // Defaults
    this.set('id', null);
    this.set('teams', {});
    this.set('winner', {});

    // Initialize empty tournament
    this.set('numberOfTeams', numberOfTeams);
    this.set('teamsPerMatch', teamsPerMatch);
    this.set('numberOfRounds', numberOfRounds);
    this.set('roundMatchUps', this._initRoundMatchUps());
    this.set('numberOfMatches', this._numberOfMatches());
  }

  /**
   * Calculates the number of matches that will be played based on the
   * number of teams and teams per match.
   *
   * Simply keeps on dividing the number of teams by the teams per match
   * until the last round.
   *
   * @returns {number} Number of matches that will be played.
   */
  _numberOfMatches() {
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

  /**
   * Getter for the number of matches that will be played.
   *
   * @returns {number} Number of matches that will be played.
   */
  getNumberOfMatches() {
    return this.get('numberOfMatches');
  }

  /**
   * Stores a team with their ID, name, and score, indexed by their team ID.
   *
   * @param {Object} team - Team to store
   * @returns {void}
   * @example <caption>Example team object.</caption>
   * {
   *  teamId: 1,
   *  name: 'Malicious Tall Jan',
   *  score: 69
   * }
   */
  setTeam(team) {
    const teams = this.get('teams');

    teams[team.teamId] = {
      teamId: team.teamId,
      name: team.name,
      score: team.score
    };

    this.set('teams', teams);
  }

  /**
   * Sets the match score for a given round/match and publishes an
   * event that a match was completed, passing the scored matchup
   * to any listeners.
   *
   * @param {number} round - The round number.
   * @param {number} match - The match number.
   * @param {number} score - The score of the round/match.
   * @returns {void}
   *
   * @example <caption>Round object before/after setting the score.</caption>
   * // Before
   * {
   *  teamIds: [1, 2]
   * }
   * // After
   * {
   *  teamIds: [1, 2],
   *  score: 69
   * }
   */
  setMatchScore(round, match, score) {
    const roundMatchUps = this.get('roundMatchUps');
    const roundMatchUp = roundMatchUps[round][match];

    const scoredRoundMatchUp = Object.assign(roundMatchUp, { score: score });
    roundMatchUps[round][match] = scoredRoundMatchUp;
    this.set('roundMatchUps', roundMatchUps);

  }

  /**
   * Sets the matchups for a particular round.
   *
   * @param {number} round - The round number.
   * @param {number[]} teams - List of team IDs.
   * @returns {void}
   */
  setRoundMatchUps(round, teams) {
    const roundMatchUps = this.get('roundMatchUps');
    const teamsPerMatch = this.get('teamsPerMatch');
    const numberOfMatches = roundMatchUps[round].length;

    // Defensive copy not to modify original teams when splice'ing
    const teamsCopy = Object.assign([], teams);

    for (let match = 0; match < numberOfMatches; match++) {
      const roundMatchUp = roundMatchUps[round][match];
      // Assign teams for this match
      const teamIds = teamsCopy.splice(0, teamsPerMatch);
      const matchUps = Object.assign(roundMatchUp, { teamIds: teamIds });
      roundMatchUps[round][match] = matchUps;
      this.set('roundMatchUps', roundMatchUps);
    }
  }

  /**
   * Gets the team scores and match score for a paticular round.
   *
   * @param {number} round - The round number.
   * @returns {Object[]} List of round scores including the round and match number for reference.
   * @example <caption>Example round score object that will be returned.</caption>
   * {
   *  round: 1,
   *  match: 1,
   *  matchScore: 69,
   *  teamScores: {
   *    0: 19, // key is the teamId
   *    1: 42
   *  }
   * }
   */
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

  /**
   * Initializes tournament matches for each round with empty placeholdlers.
   *
   * @returns {Object[]} List of empty match objects indexed by round.
   */
  _initRoundMatchUps() {
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

  /**
   * Getter for the number of teams.
   *
   * @returns {number} The number of teams.
   */
  getNumberOfTeams() {
    return this.get('numberOfTeams');
  }

  /**
   * Getter for the teams per match.
   *
   * @returns {number} The number of teams per match.
   */
  getTeamsPerMatch() {
    return this.get('teamsPerMatch');
  }

  /**
   * Getter for the number of rounds.
   *
   * @returns {number} The number of rounds.
   */
  getNumberOfRounds() {
    return this.get('numberOfRounds');
  }

  /**
   * Setter to set the tournament ID.
   *
   * Publishes a NEW_TOURNAMENT event to all listeners.
   *
   * @param {number} tournamentId - Tournament ID as returned by the server.
   * @returns {void}
   */
  setTournamentId(tournamentId) {
    this.set('id', tournamentId);
  }

  /**
   * Getter for the tournament ID.
   *
   * @returns {number} The current tournament ID.
   * @returns {void}
   */
  getTournamentId() {
    return this.get('id');
  }

  /**
   * Sets the final winner of the tournament.
   *
   * Publishes a TOURNAMENT_COMPLETED event to all listeners.
   *
   * @param {Object} winner - The winning team.
   * @returns {void}
   */
  setWinner(winner) {
    return this.set('winner', winner);
  }

  /**
   * Getter for getting a team by ID.
   *
   * @param {number} teamId - The team ID.
   * @returns {Object} team
   * @example <caption>Example team object.</caption>
   * {
   *  teamId: 1,
   *  name: 'Malicious Tall Jan',
   *  score: 69
   * };
   */
  getTeam(teamId) {
    const teams = this.get('teams');
    return teams[teamId];
  }

  /**
   * Getter for getting a round by the round number.
   *
   * @param {number} round - The round number.
   * @returns {Object[]} Round matches (a list of teamIds)
   * @example <caption>Example round object.</caption>
   * {
   *  [
   *    { teamIds: [1, 2] },
   *    { teamIds: [3, 4] }
   *  ]
   * }
   */
  getRound(round) {
    const roundMatchUps = this.get('roundMatchUps');
    return roundMatchUps[round];
  }
}
