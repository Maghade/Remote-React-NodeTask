import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api", studentRoutes);

export default app;