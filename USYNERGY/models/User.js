var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb//:localhost/FutaChat');


var Schema =  mongoose.Schema;
var UserSchema = new Schema({
    username :{
        type: String,
        required: true

    },
    password: {
        type: String,
        require: true
    },
    message_recieved :{
        type: String,
        required: false
    },

    message_sent :{
        type: String,
        required: false

    },
    friends :{
        type: Array,
        required: false
    },
    friend_requests :{
        type: Array,
        required: false
    }


});

UserSchema.methods.encryptPassword= function(password){
    return bcrypt.hashSync(password , bcrypt.genSaltSync(5) , null);
};

UserSchema.methods.validatePassword= function (password) {
    return bcrypt.compareSync(password , this.password);

};

module.exports=mongoose.model('User', UserSchema);

