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
    const { filter, sort = "asc", limit = "10" } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const parsedLimit = Math.min(parseInt(limit as string) || 10, 100);
    const sortOrder = sort === "desc" ? -1 : 1;

    const books = await Book.find(query)
      .sort({ createdAt: sortOrder })
      .limit(parsedLimit)
      .select("-__v");

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
): Promise<void> => {
  try {
    const bookId = req.params.bookId;

    const book = await Book.findById(bookId);
    if (!book) {
      const error = new Error(`Book with id ${bookId} not found`);
      (error as any).status = 404;
      (error as any).name = "NotFoundError";
      return next(error);
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
