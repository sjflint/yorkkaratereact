const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const memberSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    medicalStatus: { type: String, required: true },
    medicalDetails: { type: String },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    addressLine3: { type: String },
    addressLine4: { type: String },
    postCode: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactEmail: { type: String, required: true },
    emergencyContactPhone: { type: Number, required: true },
    ddsuccess: { type: Boolean, required: true, default: false },
    totalPayment: { type: Number, required: true, default: 15 },
    kyuGrade: { type: Number, required: true },
    danGrade: { type: Number, required: true, default: 0 },
    danGradings: {
      type: Object,
      required: true,
      default: { "Started Training": new Date().toLocaleDateString() },
    },
    gradeLevel: { type: String, required: true, default: "Novice" },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isShopAdmin: { type: Boolean, required: true, default: false },
    isAuthor: { type: Boolean, required: true, default: false },
    isInstructor: { type: Boolean, required: true, default: false },
    ddMandate: { type: String },
    subscriptionId: { type: String },
    trainingFees: { type: Number },
    licenseNumber: { type: Number },
    token: { type: String },
    lastClassChange: { type: Date, required: true, default: new Date(2000, 0) },
    attendanceRecord: { type: Number, required: true, default: 1 },
    extraClassAdded: { type: Date, required: true, default: new Date(2000, 0) },
    additionalPayments: { type: Object, required: true, default: {} },
    profileImg: {
      type: String,
      required: true,
      default:
        "https://york-karate-uploads.s3.eu-west-2.amazonaws.com/defaultplaceholder.jpg",
    },
    feedback: { type: String },
    outstandingFees: { type: Number, default: 0 },
    squadMember: { type: Boolean, default: false },
    squadDiscipline: { type: Object },
    weight: { type: Number },
    bio: { type: String, default: "" },
    numberOfSessionsRequired: { type: Number },
    freeClasses: { type: Number, default: 0 },
    trainingFees: { type: Number },
    squadAttScore: { type: Number },
  },
  {
    timestamps: true,
  }
);

memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Member = (module.exports = mongoose.model("Member", memberSchema));
