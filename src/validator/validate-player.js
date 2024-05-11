const { BOWLER, WK, AR, BATTER } = require("../const/playerType");
const { BadRequestError } = require("../error/error");
const dbConnector = require("../service/dbConnector");

async function ValidatePlayer(req, res, next) {
  const { teamName, captain, viceCaptain, players } = req.body;
  try {
    await dbConnector.connectToDB();

    // check team name exist
    await dbConnector.isTeamAlreadyExist(teamName);
    
    // check captain exist in players list
    if (!players.includes(captain)) {
      next(new BadRequestError("Captain not found in players List"));
      return;
    }
    // check vice-captain exist in players list
    if (!players.includes(viceCaptain)) {
      next(new BadRequestError("Vice-captain not found in players List"));
      return;
    }
    // captain and vice-captain can't be the same person
    if (captain === viceCaptain) {
      next(
        new BadRequestError(`Captain and Vice-captain can't be the same player`)
      );
      return;
    }
    // check players exist in the DB
    const playerCount = {
      [BOWLER]: 0,
      [WK]: 0,
      [AR]: 0,
      [BATTER]: 0,
    };
    for (let p of players) {
      const pl = await dbConnector.findPlayer(p);
      switch (pl.Role) {
        case BOWLER:
          ++playerCount[BOWLER];
          break;
        case WK:
          ++playerCount[WK];
          break;
        case AR:
          ++playerCount[AR];
          break;
        case BATTER:
          ++playerCount[BATTER];
          break;
      }
    }
    for (let type of Reflect.ownKeys(playerCount)) {
      isMinCheckPassed(type, playerCount[type]);
      isMaxCheckPassed(type, playerCount[type]);
    }
    next();
  } catch (error) {
    dbConnector.closeDBConnection();
    next(error);
  }
  
}

function isMinCheckPassed(type, count) {
  if (count < 1) throw new BadRequestError(`Should have at least one ${type}`);
  return true;
}
function isMaxCheckPassed(type, count) {
  if (count > 8)
    throw new BadRequestError(`Number of ${type} can't be greater than 8`);
  return true;
}
module.exports = ValidatePlayer;
