const mongoose = require ('mongoose')

const Userdata = mongoose.Schema({
        UserName : {
             type : String,
             required:true },
        Number:{
            type:Number,
            required:true
        }

})

module.exports = mongoose.model('UserName',Userdata)