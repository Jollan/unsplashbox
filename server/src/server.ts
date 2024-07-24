import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: "./config.env" });

import app from "./app";

mongoose.connect(process.env.HOST_CONN_STR!).then((conn) => {
  console.log(`Connected successfully...`);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running...`);
});
