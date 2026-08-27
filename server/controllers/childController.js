const childService = require("../services/childServices");


async function createChild(req, res) {

    try {

        const {
            name,
            dateOfBirth,
            className,
            rollNo
        } = req.body;


        if (
            !name ||
            !dateOfBirth ||
            !className ||
            rollNo === undefined
        ) {

            return res.status(400).json({
                message: "All child fields are required"
            });

        }


        let parentId;


        if (req.user.role === "parent") {

            parentId = req.user.userId;

        } else {

            // Admin must provide parent ID

            parentId = req.body.parent;

            if (!parentId) {

                return res.status(400).json({
                    message: "Parent ID is required for admin"
                });

            }

        }


        const child = await childService.createChild({
            name,
            dateOfBirth,
            className,
            rollNo,
            parentId
        });


        return res.status(201).json({

            message: "Child created successfully",

            child

        });

    } catch (error) {

        console.error(error);

        return res.status(error.statusCode || 500).json({

            message: error.message || "Server error"

        });

    }
}


async function getAllChildren(req, res) {

    try {

        const userId = req.user.userId;

        const role = req.user.role;


        const children =
            await childService.getAllChildren(
                userId,
                role
            );


        return res.status(200).json({

            message: "Children fetched successfully",

            children

        });

    } catch (error) {

        console.error(error);

        return res.status(error.statusCode || 500).json({

            message: error.message || "Server error"

        });

    }
}


async function getChildById(req, res) {

    try {

        const childId = req.params.id;

        const userId = req.user.userId;

        const role = req.user.role;


        const child =
            await childService.getChildById(
                childId,
                userId,
                role
            );


        return res.status(200).json({

            message: "Child fetched successfully",

            child

        });

    } catch (error) {

        console.error(error);

        return res.status(error.statusCode || 500).json({

            message: error.message || "Server error"

        });

    }
}


async function updateChild(req, res) {

    try {

        const childId = req.params.id;

        const userId = req.user.userId;

        const role = req.user.role;


        const child =
            await childService.updateChild(
                childId,
                userId,
                role,
                req.body
            );


        return res.status(200).json({

            message: "Child updated successfully",

            child

        });

    } catch (error) {

        console.error(error);

        return res.status(error.statusCode || 500).json({

            message: error.message || "Server error"

        });

    }
}


async function deleteChild(req, res) {

    try {

        const childId = req.params.id;

        const userId = req.user.userId;

        const role = req.user.role;


        await childService.deleteChild(
            childId,
            userId,
            role
        );


        return res.status(200).json({

            message: "Child deleted successfully"

        });

    } catch (error) {

        console.error(error);

        return res.status(error.statusCode || 500).json({

            message: error.message || "Server error"

        });

    }
}


module.exports = {
    createChild,
    getAllChildren,
    getChildById,
    updateChild,
    deleteChild
};