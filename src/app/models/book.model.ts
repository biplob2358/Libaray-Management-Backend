import { IBooks } from "./../interfaces/book.interface";
import { model, Schema } from "mongoose";

const bookSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    genre: {
      type: String,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message:
          "Genre must be one of: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY",
      },
      required: [true, "Genre is required"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    copies: {
      type: Number,
      required: [true, "Copies are required"],
      min: [0, "Copies must be a positive number"],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Book = model("Book", bookSchema);
