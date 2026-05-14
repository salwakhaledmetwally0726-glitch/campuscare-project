const express = require("express");
const multer = require("multer");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/authMiddleware");

const {
  createIssue,
  getAllIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getAssignedIssues,
  addComment,
  uploadCompletionPhoto,
  closeIssue,
  deleteIssue,
  getWorkers,
} = require("../controllers/issueController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/",
  authenticateUser,
  authorizeRoles("Community Member", "community", "Community", "Student"),
  upload.any(),
  createIssue
);

router.get(
  "/",
  authenticateUser,
  authorizeRoles("Facility Manager", "Manager", "manager", "Admin"),
  getAllIssues
);

router.get(
  "/workers",
  authenticateUser,
  authorizeRoles("Facility Manager", "Manager", "manager", "Admin"),
  getWorkers
);

router.get(
  "/my",
  authenticateUser,
  authorizeRoles("Community Member", "community", "Community", "Student"),
  getMyIssues
);

router.get(
  "/assigned",
  authenticateUser,
  authorizeRoles("Worker", "worker"),
  getAssignedIssues
);

router.get("/:id", authenticateUser, getIssueById);

router.put(
  "/:id/status",
  authenticateUser,
  authorizeRoles("Facility Manager", "Manager", "manager", "Worker", "worker"),
  updateIssueStatus
);

router.put(
  "/:id/assign",
  authenticateUser,
  authorizeRoles("Facility Manager", "Manager", "manager", "Admin"),
  assignIssue
);

router.put(
  "/:id/close",
  authenticateUser,
  authorizeRoles("Facility Manager", "Manager", "manager", "Admin"),
  closeIssue
);

router.post(
  "/:id/comments",
  authenticateUser,
  authorizeRoles("Worker", "worker"),
  addComment
);

router.post(
  "/:id/photo",
  authenticateUser,
  authorizeRoles("Worker", "worker"),
  upload.any(),
  uploadCompletionPhoto
);

router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles("Facility Manager", "Manager", "manager", "Admin"),
  deleteIssue
);

module.exports = router;