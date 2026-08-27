const dns = require("dns");

dns.setServers(["8.8.8.8"]);

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRouter=require("./routes/authRoutes");
const childRouter = require("./routes/childRoutes");
const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Safe Handover API is running");
});
app.use("/api/auth", authRouter);
app.use("/api/children",childRouter);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});