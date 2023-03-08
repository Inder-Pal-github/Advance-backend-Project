const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  profile: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=996&t=st=1678280955~exp=1678281555~hmac=db7c03ebfa2e39039d8a455d6c9274ac3a4e6f7f30497ea1574c7dcc0f9ad9e9",
  },
  status: {
    verified: Boolean,
    active: Boolean,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    console.log("Password hashed before saving to db");
    next();
  } catch (error) {}
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    console.log("Validating password using schema methods");
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("user", UserSchema);
module.exports = { User };
