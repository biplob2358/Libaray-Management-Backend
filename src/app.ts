import express, { Application, Request, Response } from "express";
import errorHandler from "./app/middleware/errorHandler";
import { booksRoutes } from "./app/routes/book.route";
import { borrowRoutes } from "./app/routes/borrow.route";
import notFoundHandler from "./app/middleware/notFoundHandler";
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://read-stack-roan.vercel.app"],
    credentials: true,
  })
);

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to libarty management server");
});

app.use(notFoundHandler);
app.use(errorHandler);
export default app;
