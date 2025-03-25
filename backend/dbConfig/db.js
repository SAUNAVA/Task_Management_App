import mongoose from "mongoose";

const dbConnect = async function connectToMongo() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Mongo DB connected');
    } catch (error) {
      console.error(error);
    }
}
  
export default dbConnect;