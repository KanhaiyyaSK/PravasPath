const Jwt = require("jsonwebtoken");

require("dotenv").config();

const jwtKey = process.env.JWTSecret;

exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (token) {
      token = token.split(" ")[1];

      Jwt.verify(token, jwtKey, (err, valid) => {
        if (err) {
          res.status(401).json({
            message: "Please provide valid token",
          });

          return;
        } else {
          next();
        }
      });
    } else {
      res.status(403).json({
        message: "Unauthorized User",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};
