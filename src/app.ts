import express, { Request, Response, Router } from "express";
import cors from "cors";
import { router } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(errorHandling);
export { app };
