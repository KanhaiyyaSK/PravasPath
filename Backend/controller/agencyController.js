const { default: axios } = require("axios");
const agencySchema = require("../schema/agencySchema");

const PORT = process.env.PORT;


exports.addAgency = async (req, res) => {
  try {
    const agencyData = req.body;

    let dataToStore = await agencySchema.create(agencyData);
    dataToStore = dataToStore.toObject();

    const currentUserId = req.body.userId;

    const targetApi = `http://localhost:${PORT}/user/update/${currentUserId}`;
    const dataToUpdate = {
      agencyId: dataToStore._id, // Include only the field(s) to update
    };

    await axios
      .patch(targetApi, dataToUpdate)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    res.status(200).json({
      message: "Agency added successfully",
      agency: dataToStore,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        statusCode: 400,
        message: "Agency name already exists. Please choose a different name.",
      });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ statusCode: 500, message: "Internal server error" });
    }
  }
};

exports.getAgencyInfo = async (req, res) => {
  const agencyId = req.params.agencyId;

  try {
    let data = await agencySchema.findOne({ _id: agencyId });
    if (data == null) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid agency id",
      });
    }
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

exports.updateAgency = async (req, res) => {
  let mobile = req.params.mobile;

  try {
    let data = await agencySchema.findOne({ mobile: mobile });
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

exports.getBusHistory = async (req, res) => {
  const agencyId = req.params.id;
  try {
    const agency = await agencySchema.findOne({ agencyId }, { busHistory: 1 });
    if (agency) {
      res.status(200).send(agency);
    } else {
      res.status(404).send({ message: "Agency not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Something went wrong..." });
  }
};
