const mongoose = require("mongoose");

// ✅ Use separate connection for AUTHDB
const authConnection = mongoose.createConnection(process.env.AUTH_DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for Google login
  role: {
    type: String,
    enum: ["student", "teacher", "doctor", "patient", "general"],
    required: true,
  },
  googleId: { type: String },
}, { timestamps: true });

// Export using authConnection
module.exports = authConnection.model("all", userSchema);  // 'alll' = your collection
