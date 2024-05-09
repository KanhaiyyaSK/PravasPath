const userSc = require("../schema/userSchema");
const Jwt = require("jsonwebtoken");
const { generateOTP, fast2sms } = require("../utils/otp.utils");
require("dotenv").config();

const jwtKey = process.env.JWTSecret;
const expiresInDays = process.env.TOKENEXPIRY;
const otpExpireTimeInSeconds = process.env.OTPEXPIRETIME;

const otpExpiresInMilliseconds = 1 * 60 * 1000;
var otpSentTimeInMillisecond;

exports.verifyOtp = async (req, res) => {
  try {
    const otp = req.query.otp;
    const userId = req.query.userId;
    const user = await userSc.findById(userId);

    if (!user) {
      res.status(200).json({ status: 400, message: "User not Found." });
      return;
    }

    const date = new Date();
    const currentTime = date.getTime();
    const expireTime = user.otpExpireTime;

    if (
      user.phoneOtp !== otp ||
      currentTime - expireTime > otpExpiresInMilliseconds
    ) {
      // delete this user
      if (user.isValidated == false) {
        const data = await userSc.findByIdAndDelete(userId);
        console.log(`Deleted the user ${userId} because creation failed.`);
      } else {
        user.phoneOtp = "";
        user.otpExpireTime = null;

        await userSc.findByIdAndUpdate(userId, user);
      }
      res.status(200).json({ status: 400, message: "Invalid OTP." });
      return;
    }

    user.phoneOtp = "";
    user.otpExpireTime = null;

    user.isValidated = true;
    await userSc.findByIdAndUpdate(userId, user);

    const expiresInSeconds = expiresInDays * 24 * 60 * 60;

    Jwt.sign(
      { user },
      jwtKey,
      { expiresIn: expiresInSeconds },
      (err, token) => {
        res.status(201).json({
          type: "success",
          message: "OTP verified successfully",
          data: {
            token,
            user: user,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error });
  }
};

exports.signUp = async (req, res) => {
  let userId;
  try {
    try {
      // send OTP
      const otp = generateOTP(6);
      req.body.phoneOtp = otp;
      const date = new Date();
      req.body.otpExpireTime = date.getTime();

      const data = await userSc.findOne({ mobile: req.body.mobile });
      let user;
      if (data == null) {
        user = await userSc.create(req.body);
        user = user.toObject();
        userId = user._id;
      } else {
        user = data;
        user = user.toObject();
        user.phoneOtp = otp;
        user.otpExpireTime = date.getTime();

        userId = user._id;
        await userSc.findByIdAndUpdate(user._id, user);
      }

      console.log(`User Id : ${user._id}`);
      console.log(`Otp sent : ${otp}`);

      res.status(201).json({
        type: "success",
        message: "OTP sended to your registered phone number",
        data: {
          userId: user._id,
        },
      });

      await fast2sms({
        message: `Your OTP is ${otp}`,
        contactNumber: user.mobile,
      });
    } catch (error) {
      const data = await userSc.findByIdAndDelete(userId);
      console.log(`Deleted the user ${userId} because creation failed.`);
      res.status(400).json({
        statusCode: 400,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: `Internal server error : ${error}`,
    });
  }
};

exports.getUser = async (req, res) => {
  let mobile = req.params.mobile;

  try {
    let data = await userSc.findOne({ mobile: mobile });
    console.log(data);
    if (data == null) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid mobile number",
      });
    }
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

exports.updateUser = async (req, res) => {
  // update api using patch
  //
  let id = req.params.id;
  let updatedData = req.body;

  // User can update only following fields
  const validKeys = ["name", "email", "dob", "gender"];

  for (let key in req.body) {
    if (!validKeys.includes(key)) {
      res.status(400).json({
        message: `Invalid request. Please ensure you only update the following fields: ${validKeys.join(', ')}`,
      });
      return;
    }
  }
  

  let options = { new: true };

  try {
    const data = await userSc.findByIdAndUpdate(id, updatedData, options);

    res.status(201).send(data);
  } catch (error) {
    res.status().send(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  let id = req.params.id;
  try {
    const data = await userSc.findByIdAndDelete(id);
    res.json({
      status_code: 204,
      status: `Deleted the user ${data.username} with id ${data.id} from db`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not found ",
    });
  }
};

exports.addCopassenger = async (req, res) => {
  const id = req.params.id;
  const { name, age, gender } = req.body;

  try {
    // Find the user by ID
    let user = await userSc.findById(id);

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new copassenger object
    const newCopassenger = { name, age, gender };

    // Add copassenger to user's copassenger array
    user.copassenger.push(newCopassenger);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Copassenger added successfully" });
  } catch (error) {
    console.error("Error adding copassenger:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// add trips controller 

// Define the addTrip endpoint handler
exports.addTrip = async (req, res) => {
  const userId = req.body.userId;
  const tripData = req.body;

  try {
    const user = await userSc.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new trip object
    const newTrip = {
      busName: tripData.busName,
      boardingLocation: tripData.boardingLocation,
      boardingTime: tripData.boardingTime,
      droppingLocation: tripData.droppingLocation,
      copassengers: tripData.copassengers,
      seatNumbers: tripData.seatNumbers
    };

    // Push the trip object into the myTrips array
    user.myTrips.push(newTrip);

    await user.save();

    res.status(200).json({ message: "Trip added successfully" });
  } catch (error) {
    console.error("Error adding trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


