const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./route");

const app = express();

app.use(bodyParser.json());
//MW to log the req
app.use((req, res, next) => {
  console.log("A request has been received");
  res.on("finish", () => {
    console.log("Response sent successfully");
  });
  next();
});

app.use(routes);
// MW to handle Error
app.use((err, req, res, next) => {
  if (err?.status) {
    res
      .status(err.status)
      .send({
        mes:
          err.error instanceof Array
            ? err.error?.map((e) => e.message)
            : err.error,
      });
    return;
  }
  res.status(500).send({ msg: "Some error occurred" });
});

app.listen(3000, () => {
  console.log("Application is running on port 3000");
});
