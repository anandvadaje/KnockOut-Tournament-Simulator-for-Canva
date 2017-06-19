window.onload = function() {
  elements.startButton.addEventListener('click', startTournament.bind(this, input), false);
};

function startTournament(input) {
	  var numberOfRounds = Math.log10(elements.numberOfTeams.value)/Math.log10(elements.teamsPerMatch.value);
    validate(numberOfRounds);
    let progressBar;
    var totalNoofMatcheds = getTotalMatches();
    progressBar = new ProgressBar(elements.progressBar, totalNoofMatcheds);
    const tournamentModel = new TournamentModel(elements.numberOfTeams.value, elements.teamsPerMatch.value, numberOfRounds);
    const tournamentController = new TournamentController(tournamentModel, progressBar);
    tournamentController.run(); 
}

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

function validate(numberOfRounds) {
  elements.error.textContent = "";
    if(elements.teamsPerMatch.value < 2){
      elements.error.textContent = "Teams per match cannot be less than 2";
      elements.progressBar.css("display") = "none";
    }
    if(elements.numberOfTeams.value < 2){
      elements.error.textContent = "Number of teams cannot be less than 2";
      elements.progressBar.css("display") = "none";
    }
    if(numberOfRounds - Math.ceil(numberOfRounds) != 0){
      elements.error.textContent = "Invalid pair of number of team: "+ elements.numberOfTeams.value+" and teams per match: "+elements.teamsPerMatch.value;
      elements.progressBar.css("display") = "none";
    }
}
