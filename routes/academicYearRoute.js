const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../controllers/authController");
const AcademicYear = require("../models/academicYearModel");

// POST Route
router.post("/", protect, restrictTo("superAdmin"), async (req, res, next) => {
  try {
    if (!req.body.year) {
      return res.status(400).json({ message: "Please enter academic year" });
    }
    let response = await AcademicYear.create(req.body);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// GET Route
router.get("/", protect, restrictTo("superAdmin"), async (req, res, next) => {
  try {
    let response = await AcademicYear.find().sort({ createdAt: -1 });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH Route
router.patch(
  "/:id",
  protect,
  restrictTo("superAdmin"),
  async (req, res, next) => {
    try {
      let response = await AcademicYear.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!response) {
        return res.status(404).json({ message: "Academic year not found" });
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE Route
router.delete(
  "/:id",
  protect,
  restrictTo("superAdmin"),
  async (req, res, next) => {
    try {
      let response = await AcademicYear.findByIdAndDelete(req.params.id);
      if (!response) {
        return res.status(404).json({ message: "Academic year not found" });
      }
      res.status(200).json({ message: "Academic year deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
