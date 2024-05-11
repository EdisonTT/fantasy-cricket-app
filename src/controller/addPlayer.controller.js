const dbConnector = require("../service/dbConnector");
async function addPlayerController(req, res, next) {
  try {
    // store current team to the DB setting score as -1
    req.body['score'] = -1;
    await dbConnector.storeTeamToDB(req.body);
    dbConnector.closeDBConnection();
    res.status(200).send({ msg: "Your team has been saved" });
    return;
  } catch (error) {
    next(error);
  }
}

module.exports = addPlayerController;
