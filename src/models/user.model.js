const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const userSchema = new mongoose.Schema(
  {
    about: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      required: "Avatar image is required",
      default: "/static/images/profile-image.jpg",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    status: { type: Boolean, required: true, default: true },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const autoPopulateFollowingAndFollowers = function (next) {
  this.populate("following", "_id username avatar");
  this.populate("followers", "_id username avatar");
  next();
};

userSchema.pre("findOne", autoPopulateFollowingAndFollowers);

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
