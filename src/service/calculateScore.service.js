const { ServerError } = require("../error/error");
const dbConnector = require("./dbConnector");

module.exports = new (class CalculateTeamScoreService {
  constructor() {}

  async calculateTeamScore(players) {
    let totalScore = 0;
    const playersScore = {};
    for (let p of players) {
      const bs = await this.calculateBattingScore(p);
      const bowlingScore = await this.calculateBowlingScore(p);
      const fs = await this.calculateFieldingScore(p);
      totalScore += bs + bowlingScore + fs;
      playersScore[p] = bs + bowlingScore + fs;
    }
    console.log("Individual player score", playersScore);
    return totalScore;
  }

  /**
   * @description Calculate the batting score of an Individual player
   * @argument playerName Name of the player
   * @returns The batting Score
   */
  async calculateBattingScore(playerName) {
    try {
      let s = 0;
      let r = 0;
      const matchData = await dbConnector.fetchDataFromMatchResult({
        batter: playerName,
      });
      if (!matchData.length) return 0;
      for (let d of matchData) {
        r += d.batsman_run;
        s += d.batsman_run;
        if (d.batsman_run === 4) s += 1;
        if (d.batsman_run === 6) s += 2;
      }
      if (r === 0) {
        s -= 2;
      } else if (r >= 100) {
        s += 16 + 8 + 4;
      } else if (r >= 50) {
        s += 8 + 4;
      } else if (r >= 30) {
        s += 4;
      }
      return s;
    } catch (error) {
      throw new ServerError(error);
    }
  }

  /**
   * @description Calculate the Bowling score of an Individual player
   * @argument playerName Name of the player
   * @returns The bowling Score
   */
  async calculateBowlingScore(playerName) {
    try {
      // calculate scores for wicket
      let s = 0;
      const matchData = await dbConnector.fetchDataFromMatchResult({
        bowler: playerName,
        isWicketDelivery: 1,
      });
      if (!matchData.length) return 0;
      for (let d of matchData) {
        if (d.kind !== "run out") s += 25;
        if (["lbw", "bowled"].includes(d.kind)) s += 8;
      }
      if (matchData.length >= 5) {
        s += 16;
      } else if (matchData.length === 4) {
        s += 8;
      } else if (matchData.length === 4) {
        s += 4;
      }

      // calculate score for maiden over

      //find over threw by the bowler
      let dataFromDB = await dbConnector.fetchDataFromMatchResult({
        bowler: playerName,
      });
      const over = [...new Set(dataFromDB.map((d) => d.overs))];

      for (let o of over) {
        const d = await dbConnector.fetchDataFromMatchResult({
          bowler: playerName,
          overs: o,
          total_run: { $ne: 0 },
        });
        // check over is maiden
        if (!d.length) s += 12;
      }
      return s;
    } catch (error) {
      throw new ServerError(error);
    }
  }

  /**
   * @description Calculate the fielding score of an Individual player
   * @argument playerName Name of the player
   * @returns The fielding Score
   */
  async calculateFieldingScore(playerName) {
    try {
      let s = 0;
      let c = 0;
      const matchDataOne = await dbConnector.fetchDataFromMatchResult({
        fielders_involved: playerName,
      });
      const matchDataTwo = await dbConnector.fetchDataFromMatchResult({
        bowler: playerName,
        kind: "caught and bowled",
      });
      if (!matchDataOne.length && !matchDataTwo.length) return 0;
      for (let d of matchDataOne) {
        if (d.kind === "caught") {
          c += 1;
          s += 8;
        } else if (d.kind === "stumping") {
          s += 12;
        } else if (d.kind === "run out") {
          s += 6;
        }
      }
      c += matchDataTwo.length;
      s +=( matchDataTwo.length * 8);
      if (c >= 3) s += 4;
      return s;
    } catch (error) {
      throw new ServerError(error);
    }
  }
})();
