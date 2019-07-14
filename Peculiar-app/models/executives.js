var mongoose = require('mongoose');


mongoose.connect('mongodb//:localhost/peculiar-app');

var Schema =  mongoose.Schema;
var ESchema = new Schema({


    executive:{
        type:Object,
        required:true
    }
});

 module.exports=mongoose.model('Executive', ESchema);

