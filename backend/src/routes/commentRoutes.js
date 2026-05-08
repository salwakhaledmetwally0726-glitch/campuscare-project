const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addComment,
  getIssueComments,
} = require("../controllers/commentController");

router.post("/", authMiddleware, addComment);
router.get("/:issueId", authMiddleware, getIssueComments);

module.exports = router;