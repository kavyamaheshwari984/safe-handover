const pickupRequestService = require("../services/pickupRequestService");


// CREATE PICKUP REQUEST
async function createPickupRequest(req, res) {

    try {

        const { childId } = req.body;

        if (!childId) {
            return res.status(400).json({
                message: "Child ID is required"
            });
        }

        const pickupRequest =
            await pickupRequestService.createPickupRequest(
                req.user.userId,
                req.user.role,
                childId
            );

        return res.status(201).json({
            message: "Pickup request created successfully",
            pickupRequest
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message || "Server error"
        });
    }
}


// GET ALL RELEVANT PICKUP REQUESTS
async function getPickupRequests(req, res) {

    try {

        const requests =
            await pickupRequestService.getPickupRequests(
                req.user.userId,
                req.user.role
            );

        return res.status(200).json({
            message: "Pickup requests fetched successfully",
            requests
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message || "Server error"
        });
    }
}


// GET ONE PICKUP REQUEST
async function getPickupRequestById(req, res) {

    try {

        const { id } = req.params;

        const request =
            await pickupRequestService.getPickupRequestById(
                id,
                req.user.userId,
                req.user.role
            );

        return res.status(200).json({
            message: "Pickup request fetched successfully",
            request
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message || "Server error"
        });
    }
}


// APPROVE / REJECT PICKUP REQUEST
async function updatePickupRequestStatus(req, res) {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        const request =
            await pickupRequestService.updatePickupRequestStatus(
                id,
                req.user.userId,
                req.user.role,
                status
            );

        return res.status(200).json({
            message: `Pickup request ${status.toLowerCase()} successfully`,
            request
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message || "Server error"
        });
    }
}


// CANCEL PICKUP REQUEST
async function cancelPickupRequest(req, res) {

    try {

        const { id } = req.params;

        const request =
            await pickupRequestService.cancelPickupRequest(
                id,
                req.user.userId,
                req.user.role
            );

        return res.status(200).json({
            message: "Pickup request cancelled successfully",
            request
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({
            message: error.message || "Server error"
        });
    }
}


module.exports = {
    createPickupRequest,
    getPickupRequests,
    getPickupRequestById,
    updatePickupRequestStatus,
    cancelPickupRequest
};