const mongoose = require("mongoose");
const configurationSchema = new mongoose.Schema(
  {
    academicYear: {
      type: mongoose.Types.ObjectId,
      ref: "AcademicYear",
    },
    halfYearExamSubmissionOn: {
      type: Boolean,
      default: false,
    },
    hallTicketDownload: {
      type: Boolean,
      default: false,
    },
    newAdmission: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model("Configuration", configurationSchema);
module.exports = Configuration;
