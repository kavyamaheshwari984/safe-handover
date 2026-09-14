const express = require("express");

const router = express.Router();

const { registerUser,
    loginUser,
    getGuardians
} = require("../controllers/authController");
const authenticateUser = require("../middlewares/authenticateUser");
const authorizeRoles = require("../middlewares/authorizeRoles");

router.post("/register", registerUser);
router.post("/login",loginUser);
router.get("/guardians", authenticateUser, authorizeRoles("parent", "admin"), getGuardians);

module.exports = router;