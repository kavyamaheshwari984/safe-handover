const express = require("express");

const router = express.Router();


const {
    createAuthorization,
    getAuthorizations,
    getAuthorizationById,
    updateAuthorizationStatus,
    deleteAuthorization
} = require("../controllers/guardianAuthorizationController");


const authenticateUser =
    require("../middlewares/authenticateUser");

const authorizeRoles =
    require("../middlewares/authorizeRoles");


// CREATE

router.post(
    "/",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    createAuthorization
);


// GET ALL

router.get(
    "/",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    getAuthorizations
);


// GET ONE

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    getAuthorizationById
);


// UPDATE STATUS

router.patch(
    "/:id/status",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    updateAuthorizationStatus
);


// DELETE

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    deleteAuthorization
);


module.exports = router;