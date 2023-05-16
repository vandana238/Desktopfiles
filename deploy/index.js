const express = require('express')
const app = express()
const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://vandana:vandana23@cluster0.sbgc1y5.mongodb.net/mydata?retryWrites=true&w=majority')
.then( ()=> console.log('db connected..')).catch(err => console.log(err))
app.listen(3091, () => console.log('server running...'))

const imp=  require('./model')


app.get('/',async(req,res)=>{
    try{
const allData=await imp.find()
return res.json(allData)
    }
    catch(err)
    {
        console.log(err.message)
    }
})
 app.post('/post',async(req,res)=>{
  
        const UserName=req.body;
        const newData= new Userdata(UserName)
        newData.save((err,data)=>{
            if(err){
                 res.send(err)
            }
            else{
                 res.send(data)
             }
        })

    
 })

app.listen(8080, () => {
console.log("server running")
})