const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  createIssue,
  getAllIssues,
  getMyIssues,
  updateIssueStatus,
} = require("../controllers/issueController");

router.post("/", authenticateUser, createIssue);

router.get("/", authenticateUser, getAllIssues);

router.get("/my", authenticateUser, getMyIssues);

router.put("/:id/status", authenticateUser, updateIssueStatus);

module.exports = router;