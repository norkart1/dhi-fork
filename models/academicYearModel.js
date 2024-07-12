const mongoose = require("mongoose");

const academicYearSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    currentYear: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);
module.exports = AcademicYear;
