const express = require("express");

const router = express.Router();

const authenticateUser =
    require("../middlewares/authenticateUser");

const authorizeRoles =
    require("../middlewares/authorizeRoles");


const {
    
    getHandoverById,
    getHandovers
} = require("../controllers/handoverController");



// ==========================================
// GET ALL HANDOVERS
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
    getHandovers
);


// ==========================================
// GET ONE HANDOVER
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
    getHandoverById
);


module.exports = router;