const Child = require("../models/child");


async function createChild({
    name,
    dateOfBirth,
    className,
    rollNo,
    parentId
}) {

    const child = await Child.create({
        name,
        dateOfBirth,
        className,
        rollNo,
        parent: parentId
    });

    return child;
}


async function getAllChildren(userId, role) {

    let children;

    if (role === "admin") {

        children = await Child.find()
            .populate("parent", "name email phone");

    } else {

        children = await Child.find({
            parent: userId
        });

    }

    return children;
}


async function getChildById(childId, userId, role) {

    let child;

    if (role === "admin") {

        child = await Child.findById(childId)
            .populate("parent", "name email phone");

    } else {

        child = await Child.findOne({
            _id: childId,
            parent: userId
        });

    }

    if (!child) {

        const error = new Error("Child not found");

        error.statusCode = 404;

        throw error;
    }

    return child;
}


async function updateChild(
    childId,
    userId,
    role,
    updates
) {

    let child;

    if (role === "admin") {

        child = await Child.findByIdAndUpdate(
            childId,
            updates,
            {
                new: true,
                runValidators: true
            }
        );

    } else {

        child = await Child.findOneAndUpdate(
            {
                _id: childId,
                parent: userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

    }

    if (!child) {

        const error = new Error("Child not found");

        error.statusCode = 404;

        throw error;
    }

    return child;
}


async function deleteChild(childId, userId, role) {

    let child;

    if (role === "admin") {

        child = await Child.findByIdAndDelete(childId);

    } else {

        child = await Child.findOneAndDelete({
            _id: childId,
            parent: userId
        });

    }

    if (!child) {

        const error = new Error("Child not found");

        error.statusCode = 404;

        throw error;
    }

    return child;
}


module.exports = {
    createChild,
    getAllChildren,
    getChildById,
    updateChild,
    deleteChild
};