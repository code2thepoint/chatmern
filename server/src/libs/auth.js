const passportJWT = require('passport-jwt');
const config = require('../config');
const usersController = require('../helpers/users');

let jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
  usersController
    .obtainUser({ id: jwtPayload.id })
    .then(user => {
      if (!user) {
        console.log(
          `JWT token not valid. User with id ${jwtPayload.id} does not exist.`
        );
        next(null, false);
        return;
      }

      console.log(
        `User ${user.username} provided a valid token. Authentication completed.`
      );
      next(null, user);
    })
    .catch(err => {
      console.error('Error occurred while trying to validate a token.', err);
      next(err);
    });
});