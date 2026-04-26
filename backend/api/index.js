import express from "express";
import serverless from "serverless-http";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Backend working 🚀" });
});

app.get("/api/test", (req, res) => {
  res.json({ success: true });
});

export default serverless(app);