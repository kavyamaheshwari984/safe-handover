const handoverService =
    require("../services/handoverServices");




// ==========================================
// GET ONE HANDOVER
// ==========================================

async function getHandoverById(req, res) {

    try {

        const { id } = req.params;


        const handover =
            await handoverService.getHandoverById(

                id,

                req.user.userId,

                req.user.role
            );


        return res.status(200).json({

            message:
                "Handover fetched successfully",

            handover
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message ||
                "Server error"
        });
    }
}


// ==========================================
// GET ALL HANDOVERS
// ==========================================

async function getHandovers(req, res) {

    try {

        const handovers =
            await handoverService.getHandovers(

                req.user.userId,

                req.user.role
            );


        return res.status(200).json({

            message:
                "Handovers fetched successfully",

            handovers
        });

    } catch (error) {

        console.error(error);

        return res.status(
            error.statusCode || 500
        ).json({

            message:
                error.message ||
                "Server error"
        });
    }
}


module.exports = {
   
    getHandoverById,
    getHandovers
};