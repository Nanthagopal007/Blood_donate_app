const express = require("express");
const {
    getDonors,
    getDonorById,
    createDonor,
    updateDonor,
    updateDonorStatus, // ✅ Added status update controller
    deleteDonor,
} = require("../controllers/donordetailsController");

const router = express.Router();

// @route   GET /api/donors  → Get all donors
// @route   POST /api/donors  → Create a new donor
router.route("/").get(getDonors).post(createDonor);

// @route   GET /api/donors/:id  → Get a single donor by ID
// @route   PUT /api/donors/:id  → Update a donor
// @route   DELETE /api/donors/:id  → Delete a donor
router.route("/:id").get(getDonorById).put(updateDonor).delete(deleteDonor);

// ✅ New route to toggle donor status (Pending ↔ Completed)
// @route   PUT /api/donors/updateStatus/:id
router.put("/updateStatus/:id", updateDonorStatus);

module.exports = router;
