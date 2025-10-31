
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
