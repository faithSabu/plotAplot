import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

// mongoose.connect("mongodb+srv://faithsabu:Faith@plot-a-plot.nyd8drq.mongodb.net/?retryWrites=true&w=majority")
mongoose.connect(process.env.MONGO).then(()=> {
  console.log("Connected to MongoDB");
}).catch((err)=> {
  console.log(err);
})

const app = express();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
