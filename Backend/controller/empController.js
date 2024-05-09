const empSc = require("../schema/empSchema");
const agencySc = require("../schema/agencySchema");
exports.createEmp = async (req, res) => {
  try {
    let dataToStore = await empSc.create(req.body);
    dataToStore = dataToStore.toObject();

    const agencyId = req.body.agencyId;
    console.log("Hello");
    console.log(agencyId);
    console.log(dataToStore._id);
    const dataToUpdate = { $addToSet: { operatorList: dataToStore._id } };

    try {
      const updatedAgency = await agencySc.findByIdAndUpdate(
        agencyId,
        dataToUpdate,
        { new: true }
      );

      if (updatedAgency) {
        console.log("Agency update response:", updatedAgency);

        // Send the response after both operations are completed
        res.status(200).send({
          empData: dataToStore,
          message: "New employee created successfully",
        });
      } else {
        console.error("Agency update failed: No matching agency found.");

        // Handle the case where the agency update fails
        res.status(500).send({
          statusCode: 500,
          message: "Internal server error",
        });
      }
    } catch (error) {
      console.error("An error occurred during the agency update:", error);

      // Handle the case where the agency update throws an error
      res.status(500).send({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  } catch (error) {
    console.error("An error occurred during employee creation:", error);

    // Handle the case where employee creation throws an error
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

exports.getEmp = async (req, res) => {
  let empId = req.params.empId;

  try {
    let data = await empSc.findOne({ _id: empId });
    if (data == null) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid employee id",
      });
    }
    res
      .status(200)
      .send({ message: "Employee details fetch successully", busData: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

exports.updateEmp = async (req, res) => {
  let empId = req.params.empId;
  let updatedData = req.body;

  let options = { new: true };

  try {
    const data = await empSc.findOneAndUpdate(
      { _id: empId },
      updatedData,
      options
    );

    if (data) {
      res.status(200).json({
        message: "Employee updated successfully",
        updatedEmployee: data,
      });
    } else {
      res.status(500).json({ message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteEmp = async (req, res) => {
  let empId = req.params.empId;

  try {
    const data = await empSc.findByIdAndDelete(empId);

    res.json({
      status_code: 204,
      status: `Deleted the employee ${data.name} with id ${data.id} from db`,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "Not found ",
    });
  }
};
exports.getEmpByAgencyId = async (req, res) => {
  let agencyId = req.params.agencyId;

  try {
    let data = await empSc.find({ agencyId: agencyId });
    if (data.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No employees found for the provided agencyId",
      });
    }
    res.status(200).send({ message: "Employees fetched successfully", empData: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};
