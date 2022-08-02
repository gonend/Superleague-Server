var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");
const users_utils = require("./utils/users_utils");
const matches_utils = require("./utils/matches_utils");

router.post("/register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery(
      "SELECT UserName FROM dbo.Users"
    );

    if (users.find((x) => x.UserName === req.body.username))
      throw { status: 409, message: "Username taken" };

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.Users (UserName, FirstName, LastName, Country, UserPassword, Email, ProfilePicture) VALUES
       ('${req.body.username}', '${req.body.first_name}', '${req.body.last_name}', '${req.body.country}', '${hash_password}', '${req.body.email}', '${req.body.profile_picture}')`
    );

    user_id = await DButils.execQuery(
      `select @@identity`
    );

    user_id = user_id[0]['']

    const admins_from_db = await DButils.execQuery(`SELECT UserId FROM Admins where UserId = ${user_id}`)
    isAdmin = admins_from_db.length > 0

    res.status(201).send({
      'userName': req.body.username,
      'firstName': req.body.first_name,
      'lastName': req.body.last_name,
      'country': req.body.country,
      'email': req.body.email,
      'picture': req.body.profile_picture,
      'favoriteMatches': [],
      'isAdmin': isAdmin
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = (
      await DButils.execQuery(
        `SELECT * FROM dbo.Users WHERE UserName = '${req.body.username}'`
      )
    )[0];

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.UserPassword)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.UserId;

    favorite_matches = await users_utils.getFavoriteMatches(user.UserId)
    let match_ids_array = [];
    favorite_matches.map((element) => match_ids_array.push(element.MatchId));
    
    let matches = []
    if (match_ids_array.length > 0) {
      matches = await matches_utils.getMatchesDetails(match_ids_array);
    }

    const admins_from_db = await DButils.execQuery(`SELECT UserId FROM Admins where UserId = ${user.UserId}`)
    isAdmin = admins_from_db.length > 0

    // return user
    res.status(200).send({
      'id': user.UserId,
      'userName': user.userName,
      'firstName': user.FirstName,
      'lastName': user.LastName,
      'country': user.Country,
      'email': user.Email,
      'picture': user.ProfilePicture,
      'favoriteMatches': matches,
      'isAdmin': isAdmin
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
