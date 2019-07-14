var mongoose = require('mongoose');


mongoose.connect('mongodb//:localhost/peculiar-app');

var Schema =  mongoose.Schema;
var PicsSchema = new Schema({
    pictures:{
        type:[],
        required:false,

    }
});

module.exports=mongoose.model('Pic', PicsSchema);