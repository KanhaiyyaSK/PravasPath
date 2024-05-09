const routeSc = require("../schema/routeSchema");
const agencySc = require("../schema/agencySchema");

const PORT = process.env.PORT;

// exports.addRoute = async (req, res) => {
//   console.log("AddRoute");
//   try {
//     console.log("AddRoute");
//     try {
//       let dataToStore = await routeSc.create(req.body);
//       dataToStore = dataToStore.toObject();

//       const agencyId = req.body.agencyId;
//       const dataToUpdate = { $addToSet: { routeList: dataToStore._id } };

//       try {
//         const updatedAgency = await agencySc.findByIdAndUpdate(
//           agencyId,
//           dataToUpdate,
//           { new: true }
//         );

//         if (updatedAgency) {
//           console.log("Agency update response:", updatedAgency);
//         } else {
//           console.error("Agency update failed: No matching agency found.");
//         }
//       } catch (error) {
//         console.error("An error occurred during the agency update:", error);
//       }

//       res.status(200).json({
//         message: "Route successfully added",
//         routeData: dataToStore,
//       });
//     } catch (error) {
//       res.status(400).json({
//         statusCode: 400,
//         message: error.message,
//       });
//     }
//   } catch (error) {
//     res.status(500).send({
//       statusCode: 500,
//       message: "Internal server error",
//     });
//   }
// };

exports.addRoute = async (req, res) => {
  try {
    console.log("AddRoute");
    const agencyId = req.body.agencyId;
      
       
      if (!agencyId) {
        return res.status(400).json({ message: "Agency ID is required" });
      }
      
    try {
      
      let dataToStore = await routeSc.create(req.body);
      dataToStore = dataToStore.toObject();

      // Convert sourceList and destinationList from arrays to objects
      const sourceList = Object.assign({}, ...dataToStore.sourceList);
      const destinationList = Object.assign({}, ...dataToStore.destinationList);
      
      
      const dataToUpdate = { $addToSet: { routeList: dataToStore._id } };

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
        message: "Route successfully added",
        data: {
          routeName: dataToStore.routeName,
          sourceList,
          destinationList,
          agencyId: dataToStore.agencyId,
          _id: dataToStore._id,
          __v: dataToStore.__v
        },
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        message: error.message,
      });
    }
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};




exports.getRoute = async (req, res) => {
  let routeId = req.params.routeId;

  try {
    let data = await routeSc.findOne({ _id: routeId });
    if (data == null) {
      return res.status(400).send({
        statusCode: 400,
        message: "Invalid Route ID",
      });
    }
    res.status(200).send({ routeData: data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};

// exports.getAllRoutes = async (req, res) => {
//   try {
//     let data = await routeSc.find({
//       sourceList: req.body.from,
//       destinationList: req.body.to,
//     });
//     console.log("req.body", req.body);
//     console.log("sourceList", req.body.from);
//     console.log("destinationList", req.body.to);
//     if (!data) {
//       res.status(400).send({ message: "No Route found..." });
//     }
//     res.status(200).send(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Something went wrong..." });
//   }
// };

// chaning the getAllRoutes
// Controller:

exports.getAllRoutes = async (req, res) => {
  try {
    // Constructing the routeName based on from and to parameters
    const routeName = `${req.query.from}-${req.query.to}`;

    // Querying routes with the constructed routeName
    let data = await routeSc.find({ routeName: routeName });
    console.log("req.query", req.query);
    console.log("routeName", routeName);
    if (data.length === 0) { // Checking if data is an empty array
      res.status(400).send({ message: "No Route found..." });
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Something went wrong..." });
  }
};


exports.updateRoute = async (req, res) => {
  // Update API using PATCH
  let routeId = req.params.routeId;
  let updatedData = req.body;

  let options = { new: true };

  try {
    const data = await routeSc.findOneAndUpdate(
      { _id: routeId },
      updatedData,
      options
    );

    if (data) {
      res
        .status(200)
        .json({ message: "Route updated successfully", updatedRoute: data });
    } else {
      res.status(500).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getAllRoutesByAgencyId = async (req, res) => {
  const agencyId = req.params.agencyId;

  try {
    const routes = await routeSc.find({ agencyId: agencyId });

    if (routes.length === 0) {
      return res
        .status(404)
        .json({ message: "No routes found for this agency" });
    }

    res.status(200).json({ routes: routes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
