import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    mobile: {
      type: String,
      required: [true, 'Please provide a mobile number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
      trim: true,
      unique: true
    },
    profilePicture: {
      type: String,
      default: '/placeholder.svg'
    },

    gender: { type: String, enum: ["male", "female", "other"] },
    dateOfBirth: Date,
    parentName: { type: String, required: true },
    parentContact: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit parent contact']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },

    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    enrolledCourses: [{
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      enrollmentDate: { type: Date, default: Date.now },
      status: { type: String, enum: ["active", "completed", "dropped"], default: "active" }
    }],

    grade: { type: String, required: true },
    schoolName: { type: String, required: true },
    joinDate: { type: Date, default: Date.now },

    attendance: {
      percentage: { type: Number, default: 0, min: 0, max: 100 },
      totalClasses: { type: Number, default: 0 },
      attendedClasses: { type: Number, default: 0 },
      records: [{
        date: Date,
        status: { type: String, enum: ["present", "absent", "leave"] },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" }
      }]
    },

    examHistory: [{
      examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
      examTitle: String,
      score: Number,
      total: Number,
      percentage: Number,
      grade: String,
      date: Date
    }],

    paymentHistory: [{
      amount: Number,
      date: Date,
      method: String,
      note: String
    }],
    resources: [{
      title: String,
      fileUrl: String,
      uploadedAt: Date,
      batch: String
    }],

    status: { type: String, enum: ['pending', 'active', 'suspended', 'inactive'], default: 'pending' },
    role: { type: String, enum: ["student"], default: "student" },
    lastLogin: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,

    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true }
      },
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'light' },
      language: { type: String, default: 'en' }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
studentSchema.index({ status: 1 });
studentSchema.index({ batch: 1 });

// Virtual
studentSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Password hash
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT
studentSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, email: this.email, role: 'student' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Login attempt
studentSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({ $unset: { lockUntil: 1 }, $set: { loginAttempts: 1 } });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  return this.updateOne(updates);
};

studentSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({ $unset: { loginAttempts: 1, lockUntil: 1 } });
};

// Attendance %
studentSchema.methods.updateAttendancePercentage = function () {
  if (this.attendance.totalClasses > 0) {
    this.attendance.percentage = Math.round((this.attendance.attendedClasses / this.attendance.totalClasses) * 100);
  }
  return this.save();
};

export default mongoose.model("Student", studentSchema);
