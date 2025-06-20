import mongoose, { model, Schema, Model } from "mongoose";
import { IBooks } from "./../interfaces/book.interface";

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

bookSchema.pre<IBooks>("save", function (next) {
  this.available = this.copies > 0;
  next();
});

bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) {
    return next();
  }

  if (typeof update === "object" && !Array.isArray(update)) {
    const updateObj = update as mongoose.UpdateQuery<IBooks>;

    if (updateObj.copies !== undefined) {
      updateObj.available = updateObj.copies > 0;
      this.setUpdate(updateObj);
    }
  }

  next();
});

bookSchema.post("save", function (doc, next) {
  console.log(
    `Book titled "${doc.title}" was saved with ${doc.copies} copies.`
  );
  next();
});

bookSchema.post("findOneAndUpdate", function (doc, next) {
  if (doc) {
    console.log(`Book with ID ${doc._id} was updated.`);
  }
  next();
});

bookSchema.methods.updateAvailabilityStatus = function () {
  this.available = this.copies > 0;
  return this.save();
};

interface IBookMethods {
  updateAvailabilityStatus(): Promise<IBooks>;
}

export const Book = model<IBooks, Model<IBooks, {}, IBookMethods>>(
  "Book",
  bookSchema
);
