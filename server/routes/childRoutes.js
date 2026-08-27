const express = require("express");

const router = express.Router();

const {
    createChild,
    getAllChildren,
    getChildById,
    updateChild,
    deleteChild
} = require("../controllers/childController");

const authenticateUser =
    require("../middlewares/authenticateUser");

const authorizeRoles =
    require("../middlewares/authorizeRoles");


// CREATE CHILD

router.post(
    "/",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    createChild
);


// GET ALL CHILDREN

router.get(
    "/",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    getAllChildren
);


// GET ONE CHILD

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    getChildById
);


// UPDATE CHILD

router.patch(
    "/:id",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    updateChild
);


// DELETE CHILD

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("parent", "admin"),
    deleteChild
);


module.exports = router;