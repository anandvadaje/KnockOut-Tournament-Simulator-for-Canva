const input = {
  teamsPerMatch: document.getElementById('teamsPerMatch'),
  numberOfTeams: document.getElementById('numberOfTeams'),
  startButton: document.getElementById('start')
}

const output = {
  winner: document.getElementById('winner'),
  winnertitle: document.getElementById('winnertitle'),
  error: document.getElementById('error'),
  progressBar : document.getElementById('progressBar')
}

const elements = Object.assign(input, output);
