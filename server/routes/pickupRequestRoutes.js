const express = require("express");

const router = express.Router();

const authenticateUser =
    require("../middlewares/authenticateUser");

const authorizeRoles =
    require("../middlewares/authorizeRoles");

const {
    createPickupRequest,
    getPickupRequests,
    getPickupRequestById,
    updatePickupRequestStatus,
    cancelPickupRequest
} = require("../controllers/pickupRequestController");


// CREATE PICKUP REQUEST
// Parent → own child
// Guardian → authorized child
router.post(
    "/",
    authenticateUser,
    authorizeRoles("parent", "guardian"),
    createPickupRequest
);


// GET ALL RELEVANT PICKUP REQUESTS
// Parent → own children's requests
// Guardian → own requests
// Admin → all requests
router.get(
    "/",
    authenticateUser,
    authorizeRoles("parent", "guardian", "admin"),
    getPickupRequests
);


// GET ONE PICKUP REQUEST
router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("parent", "guardian", "admin"),
    getPickupRequestById
);


// APPROVE / REJECT
// Parent → own child's request
// Admin → any request
router.patch(
    "/:id/status",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    updatePickupRequestStatus
);


// CANCEL
// Parent → own request
// Guardian → own request
// Admin → any request
router.patch(
    "/:id/cancel",
    authenticateUser,
    authorizeRoles("parent", "guardian", "admin"),
    cancelPickupRequest
);


module.exports = router;