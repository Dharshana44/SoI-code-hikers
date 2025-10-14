const express = require("express");
const mongoose = require("mongoose");
const app = express();
const taskSchema = require("./models/taskmodel");

const MONGO_URI = "mongodb+srv://dharshanaarumugam24:<db_password>@cluster0.srt7hhq.mongodb.net/";

app.get("/",(req,res)=> res.json("Hello World"))
app.post("/tasks", async (req, res) => {
    const taskRes = await taskSchema.create(req.body).then((data) => {
        res.json(data);
    });
});
mongoose.connect(MONGO_URI).then(() =>{
    console.log("Connected to MongoDB");
});
app.listen(4000, () => {
    console.log("Listening to port 4000");
});