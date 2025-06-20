import express, { Request, Response } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controller";

export const booksRoutes = express.Router();

booksRoutes.post("/", createBook);
booksRoutes.get("/", getAllBooks);
booksRoutes.get("/:bookId", getBookById);
booksRoutes.put("/:bookId", updateBook);
booksRoutes.delete("/:bookId", deleteBook);
