var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb//:localhost/peculiar-app');


var Schema =  mongoose.Schema;
var AdminSchema = new Schema({

    username: {
        type : String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});
AdminSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password , bcrypt.genSaltSync(5), null)
};
AdminSchema.methods.validatePassword = function(password){
  return  bcrypt.compareSync(password , this.password);
};


module.exports=mongoose.model('Admin', AdminSchema);
