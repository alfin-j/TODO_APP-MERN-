const express = require('express');
const mongoose =require('mongoose');
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => { // Corrected the argument order
    res.send("Hello alfin");
});

//connecting to mongodb and creating databse todoapp(mongodb part 2)
mongoose.connect("mongodb://127.0.0.1:27017/todoapp",)
.then(() => {
    console.log("DataBase Connected")
})
.catch((error)=>{
    console.log(error)
})


//SCHEMA for your data (mongodb part 2)
const todoSchema = new mongoose.Schema({
    title:String,
    description:String
});
//TODO MODEL (mongodb part 2) here everything in mongodb comes collections
const collection = mongoose.model("todo",todoSchema)


//create item
let todos =[]
let savedDocument;
app.post('/todo',async(req,res)=>{
    try{
    const {title,description} = req.body
    // const newTodo ={
    //     id:todos.length+1,//changing the value
    //     title,
    //     description
    // }
    // todos.push(newTodo);
    // console.log(newTodo);
    // res.status(201).json(newTodo); // Correctly set the status and return the created item
    const document = new collection({title,description})
    const saved = await document.save();
    savedDocument = saved

    res.status(201).json(savedDocument);
    }
    catch(error){
        console.log(error)
    }
});
//getting items
app.get('/todo',async(req,res)=>{
    try{
        const doc =await collection.find()
        res.status(200).send(doc);
        //res.json(todos)
    }
    catch(error){
        console.log(error)
    }
    //res.json(savedDocument)
})

//deleting from database
app.delete('/todo/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        await collection.findByIdAndDelete(id)
        res.status(200).send({message:"item deleted"})
    }
    catch(error){
        console.log(error)
    }
})

//deleting everything from database
app.delete('/todo',async(req,res)=>{
    try{
        await collection.deleteMany({})
        res.status(200).send({message:"Everything Erased from collection"});
    }
    catch(error){
        console.log(error)
    }
})

//for editing the databse
app.put('/todo/:id',async (req ,res) => {
    try{
        const{title,description} = req.body
        const id = req.params.id
        const updatedDocument = await collection.findByIdAndUpdate(id,{$set:{title:title,description:description}})
        res.send(updatedDocument)
    }
    catch(error){
        res.status(200).send({message:"Error"})
    }
    })
const port = 5002;
app.listen(port, () => {
    console.log("Server connected to port " + port);
});