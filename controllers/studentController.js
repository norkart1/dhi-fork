const AcademicYear = require("../models/academicYearModel");
const Student = require("../models/studentModel");
const globalFunctions = require("../utils/globalFuctions");
const mongoose = require("mongoose");
const xlsx = require("xlsx");

exports.getStudent = globalFunctions.getOne(
  Student,
  "branch",
  "class",
  "academicYear"
);

exports.getAllStudents = async (req, res, next) => {
  try {
    let data = await Student.find({
      class: req.query.classId,
      branch: req.query.studyCentre,
    })
      .populate("branch")
      .populate("class");
    res.status(200).json(data);
  } catch (error) {}
};
exports.getAdmissions = globalFunctions.getAll(Student, "branch", "class");
exports.registerStudent = async (req, res, next) => {
  try {
    let academicYear = await AcademicYear.findOne({ currentYear: true })._id;
    let data = await Student.create({ ...req.body, academicYear });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
exports.addStudent = async (req, res, next) => {
  try {
    let academicYear = await AcademicYear.findOne({ currentYear: true });

    let data = await Student.create({
      ...req.body,
      academicYear: academicYear._id,
      verified: true,
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateStudent = globalFunctions.updateOne(Student);

exports.getMyStudents = async (req, res, next) => {
  try {
    let data = await Student.aggregate([
      {
        $match: {
          branch: req.user.branch,
          verified: true,
          deleted: false,
          class: mongoose.Types.ObjectId(req.params.classId),
        },
      },
      {
        $lookup: {
          from: "classes", // Change "classes" to the actual name of your Class collection
          localField: "class",
          foreignField: "_id",
          as: "class",
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
exports.getBranchStudents = async (req, res, next) => {
  try {
    let data = await Student.aggregate([
      {
        $match: {
          branch: mongoose.Types.ObjectId(req.params.studyCentreId),
          class: mongoose.Types.ObjectId(req.params.classId),
          verified: true,
          deleted: false,
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
exports.getMyAdmissions = async (req, res, next) => {
  try {
    let data = await Student.find({ branch: req.user.branch, verified: false })
      .populate("class", "className")
      .populate("academicYear")
      .sort({ createdAt: 1 });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
exports.getAllAdmissionRequests = async (req, res, next) => {
  try {
    let data = await Student.find({ verified: false })
      .populate("branch", "studyCentreName")
      .populate("class", "className")
      .sort({ createdAt: 1 });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getAdmissionRequests = async (req, res, next) => {
  try {
    let data = await Student.aggregate([
      { $match: { verified: false } },
      {
        $group: {
          _id: "$branch",
          numStudents: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "studycentres",
          localField: "_id",
          foreignField: "_id",
          as: "branch",
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
exports.deleteStudent = globalFunctions.deleteOne(Student);
exports.excelUpload = async (req, res) => {
  try {
    let academicYear = await AcademicYear.findOne({ currentYear: true });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    console.log("====================================");
    console.log(jsonData[2]);
    console.log("====================================");
    if (jsonData.length === 0) {
      res.status(400).json({ message: "Please add data" });
    } else {
      await Promise.all(
        jsonData.map(async (data) => {
          const student = new Student({
            ...data,
            class: req.body.class,
            branch: req.user.branch,
            verified: true,
            deleted: false,
            academicYear: academicYear._id,
            dateOfBirth: `${data.dobDate}-${data.dobMonth}-${data.dobYear}`,
          });
          await student.save();
        })
      );

      res.status(200).json({ message: "Excel data uploaded successfully" });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
