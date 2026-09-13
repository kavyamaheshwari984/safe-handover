const guardianAuthorizationService =
    require("../services/guardianAuthorizationServices");


// CREATE

async function createAuthorization(req, res) {

    try {

        const {
            guardianId,
            childId,
            relationship,
            validUntil
        } = req.body;


        if (
            !guardianId ||
            !childId ||
            !relationship ||
            !validUntil
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        const authorization =
            await guardianAuthorizationService
                .createAuthorization({

                    guardianId,

                    childId,

                    relationship,

                    validUntil,

                    parentId: req.user.userId,

                    role: req.user.role

                });


        return res.status(201).json({

            message:
                "Guardian authorization created successfully",

            authorization

        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message || "Server error"

        });
    }
}



// GET ALL

async function getAuthorizations(req, res) {

    try {

        const authorizations =
            await guardianAuthorizationService
                .getAuthorizations(
                    req.user.userId,
                    req.user.role
                );


        return res.status(200).json({

            message:
                "Authorizations fetched successfully",

            authorizations

        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message || "Server error"

        });
    }
}



// GET ONE

async function getAuthorizationById(req, res) {

    try {

        const authorization =
            await guardianAuthorizationService
                .getAuthorizationById(

                    req.params.id,

                    req.user.userId,

                    req.user.role

                );


        return res.status(200).json({

            message:
                "Authorization fetched successfully",

            authorization

        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message || "Server error"

        });
    }
}



// UPDATE STATUS

async function updateAuthorizationStatus(
    req,
    res
) {

    try {

        const { status } = req.body;


        const allowedStatuses = [
            "pending",
            "approved",
            "rejected",
            "expired"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message:
                    "Invalid authorization status"

            });

        }


        const authorization =
            await guardianAuthorizationService
                .updateAuthorizationStatus(

                    req.params.id,

                    status,

                    req.user.userId,

                    req.user.role

                );


        return res.status(200).json({

            message:
                "Authorization status updated successfully",

            authorization

        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message || "Server error"

        });
    }
}



// DELETE

async function deleteAuthorization(req, res) {

    try {

        await guardianAuthorizationService
            .deleteAuthorization(

                req.params.id,

                req.user.userId,

                req.user.role

            );


        return res.status(200).json({

            message:
                "Guardian authorization deleted successfully"

        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message || "Server error"

        });
    }
}


module.exports = {

    createAuthorization,

    getAuthorizations,

    getAuthorizationById,

    updateAuthorizationStatus,

    deleteAuthorization

};