// const agencySc = require("../schema/agencySchema");
// const busSc = require("../schema/busSchema");
// const { default: axios } = require("axios");

// const PORT = process.env.PORT;

// exports.searchBuses = async (req, res) => {
//   try {
//     let routes;
//     try{
//       const options = {
//         method: 'GET',
//         url: `http://localhost:${PORT}/route/getAllRoutes`,
//         data: {from :req.body.from, to :req.body.to},
//         headers: {
//           'Authorization': req.headers.authorization,
//         },
//       }
//       routes = await axios.request(options);
//     }catch(error) {
//       console.log(error);
//     }
//     routes = routes.data;

//     let allBuses = [];
//     for(let idx = 0; idx < routes.length; idx++) {
//       let route = routes[idx]._id;
      
//       let buses;
//       try{
//         const options = {
//           method: 'GET',
//           url: `http://localhost:${PORT}/busSchedule/getBusesWithRouteDate`,
//           data: {routeId :route, date :req.body.date},
//           headers: {
//             'Authorization': req.headers.authorization,
//           },
//         }

//         buses = await axios.request(options);
//       }catch(error) {
//         console.log(error);
//       }
//       buses = buses.data.data;
      
//       for(let i = 0; i < buses.length; i++) {
//         allBuses.push(buses[i]);
//       }
//     }
//     res.status(200).send(allBuses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: error.message });
//   }
// };


const agencySc = require("../schema/agencySchema");
const busSc = require("../schema/busSchema");
const { default: axios } = require("axios");

const PORT = process.env.PORT;

exports.searchBuses = async (req, res) => {
  try {
    let routes;
    try {
      const options = {
        method: 'GET',
        url: `http://localhost:${PORT}/route/getAllRoutes`,
        params: { from: req.body.from, to: req.body.to },
        headers: {
          'Authorization': req.headers.authorization,
        },
      }
      const routesResponse = await axios.request(options);
      routes = routesResponse.data;
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Failed to fetch routes." });
    }

    let allBuses = [];
    for (let route of routes) {
      let buses;
      try {
        const options = {
          method: 'GET',
          url: `http://localhost:${PORT}/busSchedule/getBusesWithRouteDate`,
          params: { routeId: route._id, date: req.body.date },
          headers: {
            'Authorization': req.headers.authorization,
          },
        }
        const busesResponse = await axios.request(options);
        buses = busesResponse.data.data;
      } catch (error) {
        console.error(error);
        continue; // Skip to the next route if fetching buses fails
      }

      allBuses.push(...buses);
    }

    res.status(200).send(allBuses);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error." });
  }
};
