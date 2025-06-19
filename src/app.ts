import express, { Application } from "express";



const app: Application = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to libarty management app");
});

export default app;
