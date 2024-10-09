import mongoose, { mongo } from "mongoose";

const mongoDBConnect = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB - Connected");
  } catch (error) {
    console.log("MongoDB connection error " + error);
  }
};
export default mongoDBConnect;
