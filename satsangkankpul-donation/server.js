require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.get('/', (req, res) => {
  res.send("Hello World - MongoDB is Connected!");
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
