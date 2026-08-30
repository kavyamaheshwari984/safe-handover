const PickupRequest = require("../models/pickupRequest");
const Child = require("../models/child");
const GuardianAuthorization = require("../models/guardianAuthorization");


async function createPickupRequest(userId, role, childId) {

    const child = await Child.findById(childId);

    if (!child) {
        const error = new Error("Child not found");
        error.statusCode = 404;
        throw error;
    }

    // Parent pickup
    if (role === "parent") {

        if (child.parent.toString() !== userId.toString()) {

            const error = new Error(
                "You can request pickup only for your own child"
            );

            error.statusCode = 403;
            throw error;
        }
    }

    // Guardian pickup
    if (role === "guardian") {

        const authorization =
            await GuardianAuthorization.findOne({
                guardian: userId,
                child: childId,
                status: "approved",
                validUntil: {
                    $gte: new Date()
                }
            });

        if (!authorization) {

            const error = new Error(
                "You are not authorized to pick up this child"
            );

            error.statusCode = 403;
            throw error;
        }
    }

    const requestedAt = new Date();

    const requestExpiresAt =
        new Date(
            requestedAt.getTime() +
            30 * 60 * 1000
        );

    const pickupRequest =
        await PickupRequest.create({

            child: childId,

            requestedBy: userId,

            requestedAt,

            requestExpiresAt,

            status: "PENDING"
        });

    return pickupRequest;
}


async function getPickupRequests(userId, role) {

    let requests;

    if (role === "parent") {

        // Parent sees requests for their own children

        const children = await Child.find({
            parent: userId
        }).select("_id");

        const childIds = children.map(
            child => child._id
        );

        requests = await PickupRequest.find({
            child: {
                $in: childIds
            }
        })
        .populate(
            "child",
            "name className rollNo"
        )
        .populate(
            "requestedBy",
            "name email phone role"
        );

    } else if (role === "guardian") {

        // Guardian sees only requests created by themselves

        requests = await PickupRequest.find({
            requestedBy: userId
        })
        .populate(
            "child",
            "name className rollNo"
        )
        .populate(
            "requestedBy",
            "name email phone role"
        );

    } else if (role === "admin") {

        // Admin can see all pickup requests

        requests = await PickupRequest.find()
            .populate(
                "child",
                "name className rollNo"
            )
            .populate(
                "requestedBy",
                "name email phone role"
            );

    } else {

        const error = new Error(
            "You are not allowed to view pickup requests"
        );

        error.statusCode = 403;

        throw error;
    }

    return requests;
}


async function getPickupRequestById(
    requestId,
    userId,
    role
) {

    const request =
        await PickupRequest.findById(requestId);

    if (!request) {

        const error = new Error(
            "Pickup request not found"
        );

        error.statusCode = 404;
        throw error;
    }

    const child =
        await Child.findById(request.child);

    if (!child) {

        const error = new Error(
            "Child not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Parent
    if (role === "parent") {

        if (
            child.parent.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can see pickup requests only for your own child"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Guardian
    else if (role === "guardian") {

        if (
            request.requestedBy.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can see only your own pickup requests"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Admin
    else if (role === "admin") {

        // Admin can view any request

    }


    else {

        const error = new Error(
            "You are not allowed to view pickup requests"
        );

        error.statusCode = 403;
        throw error;
    }


    await request.populate(
        "child",
        "name className rollNo"
    );

    await request.populate(
        "requestedBy",
        "name email phone role"
    );


    return request;
}

async function updatePickupRequestStatus(
    requestId,
    userId,
    role,
    status
) {

    // Find the pickup request
    const request =
        await PickupRequest.findById(requestId);

    if (!request) {
        const error = new Error(
            "Pickup request not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Only PENDING requests can be approved/rejected
    if (request.status !== "PENDING") {
        const error = new Error(
            "Only pending requests can be approved or rejected"
        );

        error.statusCode = 400;
        throw error;
    }


    // Check whether the 30-minute request has expired
    if (new Date() > request.requestExpiresAt) {

        request.status = "EXPIRED";

        await request.save();

        const error = new Error(
            "Pickup request has expired"
        );

        error.statusCode = 400;
        throw error;
    }


    // Only APPROVED or REJECTED are allowed
    if (
        status !== "APPROVED" &&
        status !== "REJECTED"
    ) {
        const error = new Error(
            "Invalid status"
        );

        error.statusCode = 400;
        throw error;
    }


    // Get the child
    const child =
        await Child.findById(request.child);

    if (!child) {
        const error = new Error(
            "Child not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Parent can approve/reject only
    // requests for their own child
    if (role === "parent") {

        if (
            child.parent.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can only approve or reject requests for your own child"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Guardian cannot approve/reject
    else if (role === "guardian") {

        const error = new Error(
            "Guardians cannot approve or reject pickup requests"
        );

        error.statusCode = 403;
        throw error;
    }


    // Admin can approve/reject any request
    else if (role === "admin") {

        // No ownership check required

    }


    else {

        const error = new Error(
            "You are not allowed to update pickup requests"
        );

        error.statusCode = 403;
        throw error;
    }


    // APPROVED
    if (status === "APPROVED") {

        const approvedAt = new Date();

        const pickupExpiresAt =
            new Date(
                approvedAt.getTime() +
                60 * 60 * 1000
            );

        request.status = "APPROVED";

        request.approvedAt = approvedAt;

        request.pickupExpiresAt =
            pickupExpiresAt;
    }


    // REJECTED
    else if (status === "REJECTED") {

        request.status = "REJECTED";

        request.rejectedAt = new Date();
    }


    await request.save();

    return request;
}


async function cancelPickupRequest(
    requestId,
    userId,
    role
) {

    const request =
        await PickupRequest.findById(requestId);

    if (!request) {
        const error = new Error(
            "Pickup request not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Completed requests cannot be cancelled
    if (request.status === "COMPLETED" || request.status === "REJECTED" ||request.status === "EXPIRED") {

        const error = new Error(
            "pickup request cannot be cancelled"
        );

        error.statusCode = 400;
        throw error;
    }



    // Parent / Guardian
    if (
        role === "parent" ||
        role === "guardian"
    ) {

        // Only the person who created
        // the request can cancel it

        if (
            request.requestedBy.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can cancel only your own pickup request"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Admin
    else if (role === "admin") {

        // Admin can cancel any request

    }


    else {

        const error = new Error(
            "You are not allowed to cancel pickup requests"
        );

        error.statusCode = 403;
        throw error;
    }


    request.status = "CANCELLED";

    await request.save();

    return request;
}
module.exports = {
    createPickupRequest,
    getPickupRequests,
    getPickupRequestById,
    updatePickupRequestStatus,
    cancelPickupRequest
};