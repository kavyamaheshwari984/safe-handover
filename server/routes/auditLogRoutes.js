const express = require("express");

const router = express.Router();

const authenticateUser =
    require("../middlewares/authenticateUser");

const authorizeRoles =
    require("../middlewares/authorizeRoles");

const {
    getAuditLogs,
    getAuditLogById
} = require("../controllers/auditLogController");


// ==========================================
// GET ALL AUDIT LOGS
// ==========================================

router.get(
    "/",
    authenticateUser,
    authorizeRoles(
        "parent",
        "guardian",
        "staff",
        "admin"
    ),
    getAuditLogs
);


// ==========================================
// GET ONE AUDIT LOG
// ==========================================

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles(
        "parent",
        "guardian",
        "staff",
        "admin"
    ),
    getAuditLogById
);


module.exports = router;