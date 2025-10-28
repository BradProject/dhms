// // import Hub from '../models/Hub.js'
// // import Funding from '../models/Funding.js'

// // export async function kpis(req,res){
// //   const [totalHubs, operationalHubs, fundingAgg] = await Promise.all([
// //     Hub.countDocuments(),
// //     Hub.countDocuments({ status: 'operational' }),
// //     Funding.aggregate([ { $group: { _id:null, total: { $sum: '$amount' } } } ])
// //   ])
// //   res.json({
// //     totalHubs,
// //     operationalHubs,
// //     totalFunding: (fundingAgg[0]?.total || 0)
// //   })
// // }

// import Hub from '../models/Hub.js'
// import Funding from '../models/Funding.js'

// export async function kpis(req, res) {
//   try {
//     const [totalHubs, operationalHubs, planningHubs, developmentHubs, fundingAgg] = await Promise.all([
//       Hub.countDocuments(),
//       Hub.countDocuments({ status: 'operational' }),
//       Hub.countDocuments({ status: 'planning' }),
//       Hub.countDocuments({ status: 'development' }),
//       Funding.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
//     ]);

//     res.json({
//       totalHubs,
//       operationalHubs,
//       planningHubs,
//       developmentHubs,
//       totalFunding: fundingAgg[0]?.total || 0
//     });
//   } catch (err) {
//     console.error("Error fetching KPIs:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// }

// import Hub from '../models/Hub.js'
// import Funding from '../models/Funding.js'

// export async function kpis(req, res) {
//   try {
//     // Run queries in parallel for efficiency
//     const [
//       totalHubs,
//       operationalHubs,
//       planningHubs,
//       developmentHubs,
//       fundingAgg,
//       populationAgg
//     ] = await Promise.all([
//       Hub.countDocuments(),
//       Hub.countDocuments({ status: 'operational' }),
//       Hub.countDocuments({ status: 'planning' }),
//       Hub.countDocuments({ status: 'development' }),
//       Funding.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
//       Hub.aggregate([{ $group: { _id: null, totalPopulation: { $sum: '$populationEnrolled' } } }])
//     ]);

//     res.json({
//       totalHubs,
//       operationalHubs,
//       planningHubs,
//       developmentHubs,
//       totalFunding: fundingAgg[0]?.total || 0,
//       totalPopulation: populationAgg[0]?.totalPopulation || 0
//     });
//   } catch (err) {
//     console.error("Error fetching KPIs:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// }

// controllers/reportController.js
import Hub from "../models/Hub.js";

export const kpis = async (req, res) => {
  try {
    const { county } = req.query;

    const query = county && county !== "all" ? { county } : {};

    // ✅ 1. Basic totals
    const totalHubs = await Hub.countDocuments(query);
    const totalFunding = await Hub.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$resources.bandwidth" } } }, // Example: replace bandwidth with real funding metric if available
    ]);
    const totalPopulation = await Hub.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$populationEnrolled" } } },
    ]);

    // ✅ 2. Hubs by status (for PieChart)
    const statusStats = await Hub.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // ✅ 3. People trained by county (for BarChart)
    const peopleByCounty = await Hub.aggregate([
      { $group: { _id: "$county", trained: { $sum: "$populationEnrolled" } } },
      { $sort: { trained: -1 } },
    ]);

    // ✅ 4. Top 10 counties by hubs
    const topHubs = await Hub.aggregate([
      { $group: { _id: "$county", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // ✅ 5. Services distribution (based on programs)
    const services = await Hub.aggregate([
      { $match: query },
      { $unwind: "$programs" },
      { $group: { _id: "$programs", count: { $sum: 1 } } },
    ]);

    // ✅ 6. Hub growth (by creation month)
    const growth = await Hub.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      totalHubs,
      totalFunding: totalFunding[0]?.total || 0,
      totalPopulation: totalPopulation[0]?.total || 0,
      hubsByStatus: statusStats.map((s) => ({
        name: s._id,
        value: s.count,
      })),
      topHubs: topHubs.map((h) => ({
        name: h._id,
        value: h.count,
      })),
      servicesDistribution: services.map((s) => ({
        name: s._id,
        value: s.count,
      })),
      hubGrowth: growth.map((g) => ({
        month: new Date(2025, g._id - 1).toLocaleString("default", {
          month: "short",
        }),
        count: g.count,
      })),
      peopleByCounty: peopleByCounty.map((p) => ({
        county: p._id,
        trained: p.trained,
      })),
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
