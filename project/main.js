//#region global imports
const DButils = require("./routes/utils/DButils");
const axios = require("axios");
const bcrypt = require("bcryptjs");
require("dotenv").config();
//#endregion
//#region express configures
var express = require("express");
var path = require("path");
const session = require("client-sessions");
var logger = require("morgan");
var cors = require("cors");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: 'abcd', // the encryption key
    duration: 24 * 60 * 60 * 1000, // expired after 20 sec
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration,
    cookie: {
      httpOnly: false,
    },
    //the session will be extended by activeDuration milliseconds
  })
);
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "public"))); //To serve static files such as images, CSS files, and JavaScript files

// middleware to serve all the needed static files under the dist directory - loaded from the index.html file
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("dist"));

app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

const port = process.env.PORT || "3000";

const auth = require("./routes/auth");
const users = require("./routes/users");
const league = require("./routes/league");
const teams = require("./routes/teams");
const round = require("./routes/round");
const matches = require("./routes/matches");
const scores = require("./routes/scores");
const events = require("./routes/events");
const players = require("./routes/players");




//#endregion

// If not loggen in can only login or register
const verifyUser = async function (req, res, next) {

  // TODO: need to validate if there are get methods you must be logged in to use
  if (req.url == '/login' || req.url == '/register' || (!req.url.includes("/users") && req.method == 'GET')) {
    next()
  } else {

    if (req.session && req.session.user_id) {
      // Validate user exists
      const users_from_db = await DButils.execQuery(`SELECT UserId FROM Users where UserId = ${req.session.user_id}`)

      if (users_from_db.length > 0) {
        if (req.method == 'GET' || req.url.includes("users/")) {
          next()
        } else {
          // Validate has admin permissions to create/update
          const admins_from_db = await DButils.execQuery(`SELECT UserId FROM Admins where UserId = ${req.session.user_id}`)
          if (admins_from_db.length > 0) {
            next()
          } else {
            res.status(403).send("User don't have permission")
          }
        }
      } else {
        res.status(403).send("User doesn't exist")
      }
    } else {
      res.status(403).send("User is not logged in")
    }
  }
};

app.use(function (req, res, next) {
  verifyUser(req, res, next)
});

// ----> For cheking that our server is alive
app.get("/alive", (req, res) => res.send("I'm alive"));

// Routings
app.use("/users", users);
app.use("/league", league);
app.use("/teams", teams);
app.use("/round", round);
app.use("/matches", matches);
app.use("/scores", scores);
app.use("/events", events);
app.use("/players", players);

app.use(auth);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).send(err.message);
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

// process.on("SIGINT", function () {
//   if (server) {
//     server.close(() => console.log("server closed"));
//   }
// });
