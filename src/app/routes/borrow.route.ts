import express, { Request, Response } from "express";
import {
  borrowBook,
  getBorrowedBooksSummary,
} from "../controllers/borrow.controller";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", borrowBook);
borrowRoutes.get("/", getBorrowedBooksSummary);
