const joi = require("joi");
const { BadRequestError } = require("../error/error");

async function validateTheRequest(req, res, next) {
  console.log("hello");
  const teamSchema = joi.object({
    teamName: joi.string().required(),
    captain: joi.string().required(),
    viceCaptain: joi.string().required(),
    players: joi
      .array()
      .required()
      .length(11)
      .items(joi.string())
      .messages({
        unique: "Players should be unique",
      })
      .custom((players, helpers) => {
        const uniqueValues = new Set(players);
        if (uniqueValues.size !== players.length) {
          return helpers.error("unique");
        }
        return true;
      }),
  });

  const result = await teamSchema.validate(req.body);
  if (!result.error) {
    next();
    return;
  }
  next(new BadRequestError(result.error?.details));
}

module.exports = validateTheRequest;
