const mongoose = require('mongoose');
const PollSchema= new mongoose.Schema({
title:{
    type: String,
    required: true
},

options:[{
    option: String,
    count: {type: Number, default: 0}
}],

startTime:{
    type: Date,
    required: true
},

endTime:{
    type: Date,
    required: true  
},

createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'}

})

module.exports= mongoose.model('Poll',PollSchema);c