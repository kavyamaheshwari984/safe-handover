const dns = require("dns");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRouter=require("./routes/authRoutes");
const childRouter = require("./routes/childRoutes");
const guardianAuthorizationRouter=require("./routes/guardianAuthorizationRoutes");
const pickupRequestRoutes =require("./routes/pickupRequestRoutes");
const handoverRoutes =require("./routes/handoverRoutes");
const otpRoutes =require("./routes/otpRoutes");
const auditLogRoutes =require("./routes/auditLogRoutes");
const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Safe Handover API is running");
});
app.use("/api/auth", authRouter);
app.use("/api/children",childRouter);
app.use("/api/guardian-authorizations",guardianAuthorizationRouter);
app.use("/api/pickup-requests",pickupRequestRoutes);
app.use("/api/handovers",handoverRoutes);
app.use("/api/otp",otpRoutes);
app.use("/api/audit-logs",auditLogRoutes);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});