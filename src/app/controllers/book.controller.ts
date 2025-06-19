import { Request, Response, NextFunction } from "express";
import { Book } from "../models/book.model";

export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const book = await Book.create(body);
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "asc",
      limit = 10,
    } = req.query;
    const query: any = {};
    if (filter) {
      query.genre = filter;
    }
    const sortOrder = sort === "asc" ? 1 : -1;
    const books = await Book.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .limit(Number(limit));
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);
    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;
    const body = req.body;

    const book = await Book.findByIdAndUpdate(bookId, body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findByIdAndDelete(bookId);
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
