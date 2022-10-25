const{Schema, model}=require("mongoose");

const schema= new Schema({
    tags:{type: String,required: true},
    title:{type: String,required: true,unique: true},
    customer:{type: String,required: true},
    address:{type: String,required: true},
    typeObject:{type: String,required: true},
    sum:{type: String,required: true},
    date:{type: String,required: true},
    srcImg:{type: String,required: true},
    description:{type: String,required: true},
});

module.exports = model("News",schema)
