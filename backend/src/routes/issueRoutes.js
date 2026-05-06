// Issue routes
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Issue routes working" });
});

module.exports = router;