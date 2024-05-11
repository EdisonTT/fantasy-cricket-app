const dbConnector = require("../service/dbConnector");
const calculateTeamScoreService = require("../service/calculateScore.service");
async function processResultController(req, res, next) {
  try {
    // connect to DB
    await dbConnector.connectToDB();
    // read the teams from the DB
    const teamsToCalculateScore =
      await dbConnector.getTeamsScoreNotCalculated();
    if (!teamsToCalculateScore.length) {
      res.status(200).send({
        msg: "Teams score processed",
      });
      return;
    }
    const teamScore = {};
    for (let t of teamsToCalculateScore) {
      // calculate the score of each team
      // store team score to the DB
      const score = await calculateTeamScoreService.calculateTeamScore(
        t.players,
        t.captain,
        t.viceCaptain
      );
      await dbConnector.updateTeamScore(t.teamName, score);
      teamScore[t.teamName] = score;
    }

    console.log("Processed team score", teamScore);
    dbConnector.closeDBConnection();
    res.status(200).send({
      msg: "Teams score processed",
    });
  } catch (error) {
    dbConnector.closeDBConnection();
    next(error);
  }
}

module.exports = processResultController;
