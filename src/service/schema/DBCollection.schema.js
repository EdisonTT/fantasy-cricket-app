const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
  Player: String,
  Team: String,
  Role: String,
});
const teamSchema = new mongoose.Schema({
  teamName: String,
  captain: String,
  viceCaptain: String,
  players: Array,
  score: Number,
});
const matchSchema = new mongoose.Schema({
  ID: Number,
  innings: Number,
  overs: Number,
  ballnumber: Number,
  batter: String,
  bowler: String,
  "non-striker": String,
  extra_type: String,
  batsman_run: Number,
  extras_run: Number,
  total_run: Number,
  non_boundary: Number,
  isWicketDelivery: Number,
  player_out: String,
  kind: String,
  fielders_involved: String,
  BattingTeam: String,
});
module.exports = {
  playerSchema,
  teamSchema,
  matchSchema,
};
