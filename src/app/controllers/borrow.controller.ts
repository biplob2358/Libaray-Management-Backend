import { Request, Response, NextFunction } from "express";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/book.model";

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Book.findById(bookId);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    if (book.copies < quantity) {
      const error = new Error(
        `Not enough copies available. Only ${book.copies} copies left.`
      );
      (error as any).status = 400;
      (error as any).name = "InsufficientCopiesError";
      return next(error);
    }

    book.copies -= quantity;

    await book.save();

    const borrowRecord = new Borrow({
      book: bookId,
      quantity,
      dueDate,
    });

    const savedBorrow = await borrowRecord.save();

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: {
        _id: savedBorrow._id,
        book: savedBorrow.book,
        quantity: savedBorrow.quantity,
        dueDate: savedBorrow.dueDate,
        createdAt: savedBorrow.createdAt,
        updatedAt: savedBorrow.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBorrowedBooksSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    const formatted = summary.map(({ book, totalQuantity }) => ({
      book,
      totalQuantity,
    }));

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};
