const Handover = require("../models/handover");
const PickupRequest = require("../models/pickupRequest");
const Child = require("../models/child");
const User = require("../models/user");




// ==========================================
// GET ONE HANDOVER
// ==========================================

async function getHandoverById(
    handoverId,
    userId,
    role
) {

    const handover =
        await Handover.findById(handoverId)
            .populate(
                "child",
                "name className rollNo"
            )
            .populate(
                "pickedUpBy",
                "name email phone role"
            )
            .populate(
                "staff",
                "name email phone role"
            )
            .populate(
                "pickupRequest"
            );


    if (!handover) {

        const error = new Error(
            "Handover not found"
        );

        error.statusCode = 404;
        throw error;
    }


    // Parent

    if (role === "parent") {

        const child =
            await Child.findById(handover.child._id);

        if (
            !child ||
            child.parent.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can view only handovers for your own children"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Guardian

    else if (role === "guardian") {

        if (
            handover.pickedUpBy._id.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can view only your own handovers"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Staff

    else if (role === "staff") {

        if (
            handover.staff._id.toString() !==
            userId.toString()
        ) {

            const error = new Error(
                "You can view only handovers performed by you"
            );

            error.statusCode = 403;
            throw error;
        }
    }


    // Admin

    else if (role === "admin") {

        // Admin can view any handover

    }


    else {

        const error = new Error(
            "You are not allowed to view handovers"
        );

        error.statusCode = 403;
        throw error;
    }


    return handover;
}


// ==========================================
// GET ALL HANDOVERS
// ==========================================

async function getHandovers(
    userId,
    role
) {

    let handovers;


    // Parent

    if (role === "parent") {

        const children =
            await Child.find({
                parent: userId
            }).select("_id");


        const childIds =
            children.map(
                child => child._id
            );


        handovers =
            await Handover.find({
                child: {
                    $in: childIds
                }
            })
            .populate(
                "child",
                "name className rollNo"
            )
            .populate(
                "pickedUpBy",
                "name email phone role"
            )
            .populate(
                "staff",
                "name email phone role"
            );
    }


    // Guardian

    else if (role === "guardian") {

        handovers =
            await Handover.find({
                pickedUpBy: userId
            })
            .populate(
                "child",
                "name className rollNo"
            )
            .populate(
                "staff",
                "name email phone role"
            );
    }


    // Staff

    else if (role === "staff") {

        handovers =
            await Handover.find({
                staff: userId
            })
            .populate(
                "child",
                "name className rollNo"
            )
            .populate(
                "pickedUpBy",
                "name email phone role"
            );
    }


    // Admin

    else if (role === "admin") {

        handovers =
            await Handover.find()
            .populate(
                "child",
                "name className rollNo"
            )
            .populate(
                "pickedUpBy",
                "name email phone role"
            )
            .populate(
                "staff",
                "name email phone role"
            );
    }


    else {

        const error = new Error(
            "You are not allowed to view handovers"
        );

        error.statusCode = 403;
        throw error;
    }


    return handovers;
}


module.exports = {
    
    getHandoverById,
    getHandovers
};