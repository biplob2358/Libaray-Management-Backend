import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";

let server: Server;
async function main() {
  try {
    server = app.listen(3000, async () => {
      await mongoose.connect(
        "mongodb+srv://admin:admin@cluster0.zkydyph.mongodb.net/note-app?retryWrites=true&w=majority&appName=Cluster0"
      );
      console.log("🚀 Connected to MongoDB");
      console.log("🚀 Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log("🚀 ~ main ~ error:", error);
  }
}
main();
