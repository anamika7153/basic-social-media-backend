const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const dummyUsers = require("../dummydata/dummyUsers");
const { json } = require("body-parser");
JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post("/api/authenticate", (req, res) => {
  const { email, password } = req.body;
  const user = dummyUsers.find(
    (u) => u.email === email && u.password === password
  );
  try {
    if (!email || !password) {
      res.status(422).json({ error: "Please Enter both Email and Password" });
    }
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
