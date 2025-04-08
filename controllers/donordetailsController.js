const asyncHandler = require("express-async-handler");
const DonorDetail = require("../models/donordetailsModel");

// @desc    Get all donors
// @route   GET /api/donors
// @access  Public
const getDonors = asyncHandler(async (req, res) => {
  const donors = await DonorDetail.find();
  res.status(200).json(donors);
});

// @desc    Get a single donor by ID
// @route   GET /api/donors/:id
// @access  Public
const getDonorById = asyncHandler(async (req, res) => {
  const donor = await DonorDetail.findById(req.params.id);
  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }
  res.status(200).json(donor);
});

// @desc    Create a new donor
// @route   POST /api/donors
// @access  Public
const createDonor = asyncHandler(async (req, res) => {
  console.log("Received Data:", req.body);

  const { firstName, lastName, phone, area, gender, bloodType, status } = req.body; // ✅ Added status in request body

  console.log("Extracted Values:", firstName, lastName, area, phone, bloodType, gender, status);

  if (!firstName || !lastName || !phone || !area || !gender || !bloodType) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const donor = await DonorDetail.create({
    firstName,
    lastName,
    phone,
    area,
    gender,
    bloodType,
    status: status || false, // ✅ Default status is false (Pending)
  });

  res.status(201).json(donor);
});

// @desc    Update a donor by ID
// @route   PUT /api/donors/:id
// @access  Public
const updateDonor = asyncHandler(async (req, res) => {
  const donor = await DonorDetail.findById(req.params.id);

  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }

  const updatedDonor = await DonorDetail.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedDonor);
});

// ✅ New API to Update Status
// @desc    Update donor status (Pending -> Completed, Completed -> Pending)
// @route   PUT /api/donors/updateStatus/:id
// @access  Public
const updateDonorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const donor = await DonorDetail.findById(id);

  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }

  // ✅ Toggle status
  donor.status = !donor.status;

  const updatedDonor = await donor.save();
  res.status(200).json(updatedDonor);
});

// @desc    Delete a donor by ID
// @route   DELETE /api/donors/:id
// @access  Public
const deleteDonor = asyncHandler(async (req, res) => {
  const donor = await DonorDetail.findById(req.params.id);

  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }

  await donor.deleteOne();
  res.status(200).json({ message: "Donor removed successfully" });
});

module.exports = {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  updateDonorStatus, // ✅ Added new status update function
  deleteDonor,
};
