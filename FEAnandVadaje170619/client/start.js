//Adds listener to startButton click when the page is loaded successfully
window.onload = function() {
  elements.startButton.addEventListener('click', startTournament.bind(this, input), false);
};

//starts the validation of inputs and if all good further processing of the tournment
function startTournament(input) {
  var numberOfRounds = Math.log10(elements.numberOfTeams.value)/Math.log10(elements.teamsPerMatch.value);
  if(validate(numberOfRounds)) {
    let progressBar;
    var totalNoofMatcheds = getTotalMatches();
    progressBar = new ProgressBar(elements.progressBar, totalNoofMatcheds);
    const tournamentModel = new TournamentModel(elements.numberOfTeams.value, elements.teamsPerMatch.value, numberOfRounds);
    const tournamentController = new TournamentController(tournamentModel, progressBar);
    tournamentController.run(); 
  }
}

//Calculates the total number of matches for the Tournament
function getTotalMatches() {
  let teamsPerMatch = elements.teamsPerMatch.value;
  let noOfTeams = elements.numberOfTeams.value;
  let noOfRounds = noOfTeams / teamsPerMatch;
  let totalMatches = noOfRounds;

  while (noOfRounds > 1) {
    noOfRounds /= teamsPerMatch;
    totalMatches += noOfRounds;
  }

  return totalMatches;
}

//Validates the input given by the user
function validate(numberOfRounds) {
  elements.error.textContent = "";
  elements.winnertitle.textContent = "";
  elements.winner.textContent = "";
  
  if(elements.teamsPerMatch.value < 2){
    elements.error.textContent = "Teams per match cannot be less than 2";
    return false;
  }
  if(elements.numberOfTeams.value < 2){
    elements.error.textContent = "Number of teams cannot be less than 2";
    return false;
  }
  if(numberOfRounds - Math.ceil(numberOfRounds) != 0){
    elements.error.textContent = "Invalid pair of number of team: "+ elements.numberOfTeams.value+" and teams per match: "+elements.teamsPerMatch.value;
    return false;
  }
  
  return true;
}
