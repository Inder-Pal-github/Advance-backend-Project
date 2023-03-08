const mongoose = require('mongoose');

const airbnbSchema = mongoose.Schema({
    date:{type:Date,default:Date.now()},
    listing_id:{type:String,required:true},
    reviewer_id:{type:String,required:true},
    reviewer_name:{type:String,required:true},
    comments:{type:String,required:true}
})

const Airbnb = mongoose.model('airbnb',airbnbSchema);

module.exports = {Airbnb};