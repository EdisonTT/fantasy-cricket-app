const mongoose = require("mongoose");
const { ServerError, BadRequestError } = require("../error/error");
const {
  playerSchema,
  teamSchema,
  matchSchema,
} = require("./schema/DBCollection.schema");
class DBConnectorService {
  player = mongoose.model("players", playerSchema, "players");
  team = mongoose.model("teams", teamSchema, "teams");
  matchResult = mongoose.model("matchDetails", matchSchema, "matchDetails");

  async connectToDB() {
    try {
      await mongoose.connect("mongodb://127.0.0.1:27017/cricket");
      console.log("Connected to DB");
    } catch (error) {
      throw new ServerError("Failed to connect to DB");
    }
  }

  closeDBConnection() {
    mongoose.connection.close();
    console.log("DB Connection has been closed");
  }

  async findPlayer(playerName) {
    const p = await this.player.findOne({ Player: playerName });
    if (p) {
      return p;
    } else {
      throw new BadRequestError(`Player ${playerName}, not found`);
    }
  }

  async isTeamAlreadyExist(teamName) {
    const t = await this.team.findOne({ teamName });
    if (t) {
      throw new BadRequestError(`Team ${teamName}, already exists`);
    } else {
      return true;
    }
  }

  async storeTeamToDB(teamDetails) {
    const t = new this.team(teamDetails);
    try {
      await t.save();
    } catch (error) {
      throw new ServerError("Failed to store data");
    }
  }
  // fetching the score of teams which is not calculated to save time.
  async getTeamsScoreNotCalculated() {
    try {
      return await this.team.find({ score: -1 });
    } catch (error) {
      console.log("db error teams", error);
      throw new ServerError("Failed to retrieve teams from DB");
    }
  }

  async fetchDataFromMatchResult(query = {}) {
    try {
      return await this.matchResult.find(query);
    } catch (error) {
      throw new ServerError("Failed to retrieve match data from DB");
    }
  }

  async updateTeamScore(teamName, score) {
    try {
      return await this.team.findOneAndUpdate(
        {
          teamName,
        },
        {
          score,
        }
      );
    } catch (error) {
      console.log("db error teams", error);
      throw new ServerError("Failed to retrieve match data from DB");
    }
  }

  async fetchTeamAndScore() {
    try {
      return await this.team.find({}, { _id: 0, teamName: 1, score: 1 });
    } catch (error) {
      console.log("db error teams", error);
      throw new ServerError("Failed to retrieve match data from DB");
    }
  }
}

module.exports = new DBConnectorService();
