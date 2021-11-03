const jwt = require("jsonwebtoken");


function generateAuthToken(data) {
  return jwt.sign(
    {
      user_id: data.user_id,
      email: data.email,
      is_admin: data.is_admin,
      is_banned: data.is_banned
    },
    process.env.jwtPrivateKey
  );
}

module.exports = { generateAuthToken };
