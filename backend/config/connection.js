import mongoose from "mongoose";

const connection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOOSE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`Connected to Database on ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error ${error.message}`);
    process.exit(1);
  }
};
export default connection;
