const dbConnector = require("../service/dbConnector");
const resultAnalyzer = require("../service/resultAnalyzer.service");
module.exports = async function teamResultController(req, res, next) {
  try {
    await dbConnector.connectToDB();
    const individualSCore = await dbConnector.fetchTeamAndScore();
    const winners = resultAnalyzer.findHighestScore(individualSCore);
    dbConnector.closeDBConnection();
    res.status(200).send({ winners, individualSCore });
  } catch (error) {
    dbConnector.closeDBConnection();
    next(error);
  }
};
