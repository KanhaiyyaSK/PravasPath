const busScheduleSc = require("../schema/busScheduleSchema");
const agencySc = require("../schema/agencySchema");

exports.createBusSchedule = async (req, res) => {
  try {
    let dataToStore = await busScheduleSc.create(req.body);
    dataToStore = dataToStore.toObject();

    res.status(200).json({
      message: "Bus schedule is created successfully",
      busSchedule: dataToStore,
    });
  } catch (error) {
    console.error("An error occurred during bus schedule creation:", error);

    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

exports.getBusSchedule = async (req, res) => {
  let busScheduleId = req.params.busScheduleId;

  try {
    let data = await busScheduleSc.findOne({ _id: busScheduleId });
    if (data == null) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid busSchedule id",
      });
    }
    res
      .status(200)
      .send({
        message: "Bus ScheduleId details fetch successully",
        busSchedule: data,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

exports.getBusesWithRouteDate = async (req, res) => {
  try {
    let data = await busScheduleSc.find({ routeId: req.body.routeId, operatingDays: req.body.date});
    res
      .status(200)
      .send({
        data
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};


exports.updateBusSchedule = async (req, res) => {
  let busScheduleId = req.params.busScheduleId;
  let updatedData = req.body;

  let options = { new: true };

  try {
    const data = await busScheduleSc.findOneAndUpdate(
      { _id: busScheduleId },
      updatedData,
      options
    );

    if (data) {
      res.status(200).json({
        message: "BusSchedule updated successfully",
        updatedEmployee: data,
      });
    } else {
      res.status(500).json({ message: "BusSchedule not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteBusSchedule = async (req, res) => {
  let busScheduleId = req.params.busScheduleId;

  try {
    const data = await busScheduleSc.findByIdAndDelete(busScheduleId);

    res.json({
      status_code: 204,
      status: `Deleted the busSchedule with id ${data.id} from db`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not found ",
    });
  }
};
