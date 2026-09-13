const GuardianAuthorization = require("../models/guardianAuthorization");
const Child = require("../models/child");
const User = require("../models/user");


// CREATE AUTHORIZATION

async function createAuthorization({
    guardianId,
    childId,
    relationship,
    validUntil,
    parentId,
    role
}) {

    // Find the child
    const child = await Child.findById(childId);

    if (!child) {
        const error = new Error("Child not found");
        error.statusCode = 404;
        throw error;
    }


    // Parent can authorize only their own child
    if (
        role === "parent" &&
        child.parent.toString() !== parentId.toString()
    ) {
        const error = new Error(
            "You can authorize a guardian only for your own child"
        );

        error.statusCode = 403;

        throw error;
    }


    // Check guardian exists
    const guardian = await User.findById(guardianId);

    if (!guardian) {
        const error = new Error("Guardian not found");
        error.statusCode = 404;
        throw error;
    }


    // Guardian must actually have guardian role
    if (guardian.role !== "guardian") {
        const error = new Error(
            "Selected user is not a guardian"
        );

        error.statusCode = 400;

        throw error;
    }


    // Create authorization
    const authorization =
        await GuardianAuthorization.create({

            guardian: guardianId,

            child: childId,

            relationship,

            status: "approved",

            validUntil

        });


    return authorization;
}



// GET AUTHORIZATIONS

async function getAuthorizations(userId, role) {

    let authorizations;


    if (role === "admin") {

        authorizations =
            await GuardianAuthorization
                .find()
                .populate(
                    "guardian",
                    "name email phone"
                )
                .populate(
                    "child",
                    "name className rollNo"
                );

    } else {

        // Parent sees authorizations
        // for their own children

        const children =
            await Child.find({
                parent: userId
            }).select("_id");

            //************************************* */
        const childIds =
            children.map(child => child._id);


        authorizations =
            await GuardianAuthorization
                .find({
                    child: {
                        $in: childIds
                    }
                })
                .populate(
                    "guardian",
                    "name email phone"
                )
                .populate(
                    "child",
                    "name className rollNo"
                );
    }


    return authorizations;
}



// GET ONE AUTHORIZATION

async function getAuthorizationById(
    authorizationId,
    userId,
    role
) {

    const authorization =
        await GuardianAuthorization
            .findById(authorizationId)
            .populate(
                "guardian",
                "name email phone"
            )
            .populate(
                "child",
                "name className rollNo"
            );


    if (!authorization) {

        const error =
            new Error("Authorization not found");

        error.statusCode = 404;

        throw error;
    }


    // Admin can access anything
    if (role === "admin") {
        return authorization;
    }


    // Parent can access only their own child
    if (
        authorization.child.parent.toString() !==
        userId.toString()
    ) {

        const error =
            new Error("Access denied");

        error.statusCode = 403;

        throw error;
    }


    return authorization;
}



// UPDATE STATUS

async function updateAuthorizationStatus(
    authorizationId,
    status,
    userId,
    role
) {

    const authorization =
        await GuardianAuthorization
            .findById(authorizationId)
            .populate("child");


    if (!authorization) {

        const error =
            new Error("Authorization not found");

        error.statusCode = 404;

        throw error;
    }


    // Admin can update anything
    if (role !== "admin") {

        // Parent can update only their child's authorization

        if (
            authorization.child.parent.toString() !==
            userId.toString()
        ) {

            const error =
                new Error("Access denied");

            error.statusCode = 403;

            throw error;
        }
    }

    //**************************************** */
    authorization.status = status;

    await authorization.save();


    return authorization;
}



// DELETE AUTHORIZATION

async function deleteAuthorization(
    authorizationId,
    userId,
    role
) {

    const authorization =
        await GuardianAuthorization
            .findById(authorizationId)
            .populate("child");


    if (!authorization) {

        const error =
            new Error("Authorization not found");

        error.statusCode = 404;

        throw error;
    }


    // Admin can delete anything
    if (role !== "admin") {

        if (
            authorization.child.parent.toString() !==
            userId.toString()
        ) {

            const error =
                new Error("Access denied");

            error.statusCode = 403;

            throw error;
        }
    }


    await GuardianAuthorization.findByIdAndDelete(
        authorizationId
    );


    return authorization;
}


module.exports = {
    createAuthorization,
    getAuthorizations,
    getAuthorizationById,
    updateAuthorizationStatus,
    deleteAuthorization
};