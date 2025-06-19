import express, { Application, Request, Response } from "express";
import errorHandler from "./app/middleware/errorHandler";
import { booksRoutes } from "./app/routes/book.route";

const app: Application = express();
app.use(express.json());

app.use("/api/books", booksRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to libarty management server");
});

app.use(errorHandler);
export default app;
