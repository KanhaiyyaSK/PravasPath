const agencySc = require("../schema/agencySchema");
const busSc = require("../schema/busSchema");

const PORT = process.env.PORT;

exports.addBus = async (req, res) => {
  console.log("AddBus");
  // console.log("Request Body:", req.body);
  try {
    try {
      let dataToStore = await busSc.create(req.body);
      dataToStore = dataToStore.toObject();

      const agencyId = req.body.agencyId;
      const dataToUpdate = { $addToSet: { allBusList: dataToStore.busId } };
      console.log("Agency ID:", agencyId);
      console.log("Data to Update:", dataToUpdate);

      try {
        const updatedAgency = await agencySc.findByIdAndUpdate(
          agencyId,
          dataToUpdate,
          { new: true }
        );

        if (updatedAgency) {
          console.log("Agency update response:", updatedAgency);
        } else {
          console.error("Agency update failed: No matching agency found.");
        }
      } catch (error) {
        console.error("An error occurred during the agency update:", error);
      }

      res.status(200).json({
        message: "Bus added in the Agency successfully",
        busData: dataToStore,
      });
    } catch (error) {
      if (error.code === 11000) {
        res.status(401).json({
          statusCode: 401,
          message: "Bus with this Number Plate already exists",
        });
      } else {
        res.status(400).json({
          statusCode: 400,
          message: error.message,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

exports.getBus = async (req, res) => {
  let busId = req.params.busId;

  try {
    let data = await busSc.findOne({ busId: busId });
    if (data == null) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Bus number",
      });
    }
    res.status(200).send({ busData: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

exports.updateBus = async (req, res) => {
  // Update API using PATCH
  let busId = req.params.busId;
  let updatedData = req.body;

  let options = { new: true };

  try {
    const data = await busSc.findOneAndUpdate(
      { busId: busId },
      updatedData,
      options
    );

    if (data) {
      res
        .status(200)
        .json({ message: "Bus updated successfully", updatedBus: data });
    } else {
      res.status(500).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getBusesByAgencyId = async (req, res) => {
  const agencyId = req.params.agencyId;

  try {
    const buses = await busSc.find({ agencyId: agencyId });

    if (buses.length === 0) {
      return res.status(404).json({
        message: "No buses found for the specified agencyId",
      });
    }

    res.status(200).json({
      message: "Buses found for the specified agencyId",
      buses: buses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
