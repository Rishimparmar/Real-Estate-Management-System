import serverless from "serverless-http";
import express from "express";
import cors from "cors";

const app = express();


app.use(express.json());
app.use(cors({
  origin: "*", 
}));


app.get("/", (req, res) => {
  res.json({ message: "Backend is running on Vercel 🚀" });
});


app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API working fine" });
});

app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({
    message: "Data received successfully",
    data: data
  });
});


export default serverless(app);