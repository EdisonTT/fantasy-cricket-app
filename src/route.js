const express = require("express");
const validateTheRequest = require("./validator/add-team-payload.validator");
const ValidatePlayer = require("./validator/validate-player");
const addPlayerController = require("./controller/addPlayer.controller");
const processResultController = require("./controller/processResult.controller");
const teamResultController = require("./controller/teamResult.controller");

const routes = express.Router();

routes.post(
  "/add-team",
  validateTheRequest,
  ValidatePlayer,
  addPlayerController
);

routes.get("/process-result", processResultController);

routes.get("/team-result", teamResultController);

module.exports = routes;
