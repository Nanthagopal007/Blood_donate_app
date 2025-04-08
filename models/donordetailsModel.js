const mongoose = require("mongoose"); // Import Mongoose

const donorSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add the donor's first name"],
      trim: true,
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(), 
    },
    lastName: {
      type: String,
      required: [true, "Please add the donor's last name"],
      trim: true,
      set: (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(), 
    },
    phone: {
      type: String,
      required: [true, "Please add the donor's phone number"],
      match: [/^\d{10}$/, "Phone number must be a valid 10-digit number"],
    },
    area: {
      type: String,
      required: [true, "Please add the donor's area address"],
      minlength: [5, "Area name must be at least 5 characters long"],
    },
    gender: {
      type: String,
      required: [true, "Please specify the donor's gender"],
      enum: ["Male", "Female", "Other"],
    },
    bloodType: {
      type: String,
      required: [true, "Please specify the donor's blood type"],
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],

    },
    status: {
      type: Boolean,
      default: false, // Default is false (Pending), true means Completed
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DonorDetails", donorSchema);
