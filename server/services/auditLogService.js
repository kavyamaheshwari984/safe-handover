const AuditLog = require("../models/auditLog");
const Child = require("../models/child");
const pickupRequest = require("../models/pickupRequest");

async function createAuditLog(
    action,
    performedBy,
    child,
    pickupRequest,
    handover,
    details
) {
    const log = await AuditLog.create({
        action: action,
        performedBy: performedBy,
        child: child,
        pickupRequest: pickupRequest,
        handover: handover,
        details: details
    });

    return log;
}


async function getAuditLogs(
    userId,
    role
) {

    if (role === "parent") {

        const children = await Child.find({
            parent: userId
        }).select("_id");

        const childIds = children.map(
            child => child._id
        );

        return await AuditLog.find({
            child: {
                $in: childIds
            }
        })
        .populate(
            "performedBy",
            "name email phone role"
        )
        .populate(
            "child",
            "name className rollNo"
        );
    }


    else if (role === "guardian") {

        const requests = await PickupRequest.find({
            requestedBy: userId
        }).select("_id");

        const requestIds = requests.map(
            request => request._id
        );

        return await AuditLog.find({
            pickupRequest: {
                $in: requestIds
            }
        })
        .populate(
            "performedBy",
            "name email phone role"
        )
        .populate(
            "child",
            "name className rollNo"
        );
    }


    else if (role === "staff") {

        return await AuditLog.find({
            performedBy: userId
        })
        .populate(
            "performedBy",
            "name email phone role"
        )
        .populate(
            "child",
            "name className rollNo"
        );
    }


    else if (role === "admin") {

        return await AuditLog.find()
            .populate(
                "performedBy",
                "name email phone role"
            )
            .populate(
                "child",
                "name className rollNo"
            );
    }


    else {

        const error = new Error(
            "You are not allowed to view audit logs"
        );

        error.statusCode = 403;

        throw error;
    }
}


async function getAuditLogById(
    auditLogId,
    userId,
    role
) {

    // 1. Find audit log
    const log = await AuditLog.findById(auditLogId);

    if (!log) {
        const error = new Error(
            "Audit log not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // 2. Parent
    // Parent can see logs related to their own children

    if (role === "parent") {

        const child = await Child.findById(
            log.child
        );

        if (
            !child ||
            child.parent.toString() !==
            userId.toString()
        ) {
            const error = new Error(
                "You are not allowed to view this audit log"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // 3. Guardian
    // Guardian can see logs related to
    // pickup requests created by them

    else if (role === "guardian") {

        const request =
            await PickupRequest.findById(
                log.pickupRequest
            );

        if (
            !request ||
            request.requestedBy.toString() !==
            userId.toString()
        ) {
            const error = new Error(
                "You are not allowed to view this audit log"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // 4. Staff
    // Staff can see logs of actions
    // performed by themselves

    else if (role === "staff") {

        if (
            log.performedBy.toString() !==
            userId.toString()
        ) {
            const error = new Error(
                "You are not allowed to view this audit log"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // 5. Admin
    // Admin can view everything

    else if (role === "admin") {

        // Admin is allowed
    }


    // 6. Other roles

    else {

        const error = new Error(
            "You are not allowed to view audit logs"
        );

        error.statusCode = 403;
        throw error;
    }


    // 7. Populate useful information

    await log.populate(
        "performedBy",
        "name email phone role"
    );

    await log.populate(
        "child",
        "name className rollNo"
    );

    await log.populate(
        "pickupRequest"
    );

    await log.populate(
        "handover"
    );


    // 8. Return log

    return log;
}

module.exports={
    createAuditLog,
     getAuditLogs,
    getAuditLogById
    
   
}