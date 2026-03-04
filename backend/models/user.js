import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "citizen",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
