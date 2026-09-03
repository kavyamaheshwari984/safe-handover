const auditLogService =
    require("../services/auditLogService");


// ==========================================
// GET ALL AUDIT LOGS
// ==========================================

async function getAuditLogs(req, res) {

    try {

        const logs =
            await auditLogService.getAuditLogs(
                req.user.userId,
                req.user.role
            );

        return res.status(200).json({

            message:
                "Audit logs fetched successfully",

            logs
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
// GET ONE AUDIT LOG
// ==========================================

async function getAuditLogById(req, res) {

    try {

        const { id } = req.params;

        const log =
            await auditLogService.getAuditLogById(
                id,
                req.user.userId,
                req.user.role
            );

        return res.status(200).json({

            message:
                "Audit log fetched successfully",

            log
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
    getAuditLogs,
    getAuditLogById
};