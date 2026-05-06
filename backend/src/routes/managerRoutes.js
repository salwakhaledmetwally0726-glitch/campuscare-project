// Manager routes
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Manager routes working" });
});

module.exports = router;