import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n Mongodb connected !! DB Host: ${connection.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connnection error !!!!", error);
    process.exit(1);
  }
};

export default connectDB;
