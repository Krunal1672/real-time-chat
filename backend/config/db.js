import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/chatapp");
  console.log("MongoDB connected");
};

export default connectDB;
