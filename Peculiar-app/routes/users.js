var express = require('express');
var router = express.Router();
var multer = require('multer');
//setting up storage for upload with multer
var storage= multer.diskStorage({
    destination: function(req ,file, cb){
        cb(null , './public/profile_image/');
    },

    filename: function(req , file , cb ){
        cb(null , file.originalname);
    }

});
//initializing the storage and storing it in the variable
var upload= multer({storage : storage});

var mongoose=require('mongoose');
var socketio= require('socket.io');
mongoose.connect('mongodb//:localhost/peculiar-app');
var passport = require('passport');
var Nexmo = require('nexmo');
var OE = require('../models/old_executives');

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/User');
var Alumni = require('../models/Alumni');
var Executive = require('../models/executives');


/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// router.get('/signup', function(req, res, next) {
//     var success = req.flash('success');
//   res.render('users/signup' , {success :success, isSuccessful :success.length>0,});
// });

//get the route for the page level
router.get('/levels',isLoggedin, function(req, res, next) {
    var message = req.flash('success');
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    //fetching the users from the database
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
//render the page alongside with the datas from the database
        res.render('users/levels' ,{msg : message, isSuccess: message.length>0, note:userchunk });
    });


});
//setting up functions to validate logging
function notLoggedin(req , res , next){
    if(!req.isAuthenticated()){
        console.log('You are not logged in');
        return  next();
    }
    console.log('You are logged in');
     next()
}
//getting the register page
router.get('/Register_member',isLoggedin, function(req, res, next) {
    var message = req.flash('error');

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    //fetch users from the database
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
//render the register page
        res.render('users/Register_member' ,{ message : message , hasError :message.length>0, isSuccess: message.length>0, note:userchunk });
    });



});
//calling the router to clear the database
router.post('/clear',isLoggedin,  (req, res, next)=> {
//validating the password
if(req.body.pass==="peculiar123") {
    //removing the users
    User.remove((err, members) => {
        if (err) {
            return res.redirect('/');
        }
        return members;

    });


//removing the alumni
    Alumni.remove(function (err, user) {
        if (err) {
            return res.redirect('/');
        }
        return user
    });
    //removeing the executives
    Executive.remove((err, user) => {
        if (err) {
            return res.redirect('/');
        }
        return user;

    });
    var da = new Date();
    var dayo = da.getDate();
    var montho = da.getMonth();
    //getting the users
    User.find({"m_b": montho, "d_b": dayo}, function (err, users) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < users.length; i += chunk) {
            userchunk.push(users.slice(i, i + chunk));
        }

        return  res.render('users/update', {message1 : 'Database cleared' , note: userchunk});
    });

}
else {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, users) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < users.length; i += chunk) {
            userchunk.push(users.slice(i, i + chunk));
        }
//render the next page
        return res.render('users/update', {message2: 'Invalid password', note: userchunk});
    });
}
});

//calling the router to display 100level brethren
router.get('/100',isLoggedin, function(req, res, next) {
    //fetching from the database
   User.find({'level' : '100'} , function (err , user) {
       if(err){
           req.flash('error');
       }
       var clothchunk=[];
       var chunknum=3;
       for (var i = 0; i <user.length;  i+=chunknum) {
           clothchunk.push(user.slice(i , i +chunknum));
       }
       var d = new Date();
       var day = d.getDate();
       var month = d.getMonth();

       User.find({"m_b": month, "d_b": day}, function (err, user) {
           var userchunk = [];
           var chunk = 1;
           for (var i = 0; i < user.length; i += chunk) {
               userchunk.push(user.slice(i, i + chunk));
           }
           console.log(user);
           //rendering the next page
           res.render('users/view_members', {   user : clothchunk, note : userchunk });
       });


   });

});
//calling the router to get the 200level brethren
router.get('/200',isLoggedin, function(req, res, next) {
    //fetching from the database
    User.find({'level' : '200'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        //fetching from  the database
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            //rendring the next page
            res.render('users/view_members', {   user : clothchunk, note : userchunk });
        });
    });

});
//getting the router to display the 300lvel brethren
router.get('/300',isLoggedin, function(req, res, next) {
    //fetching from the database
    User.find({'level' : '300'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        //fetching users from the database
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            //rendring the next page
            res.render('users/view_members', {   user : clothchunk, note : userchunk });
        });
    });

});
//calling the router to get the 300level brethren
router.get('/400',isLoggedin, function(req, res, next) {
    //fetching from the database
    User.find({'level' : '400'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        //fetching from the database
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            //rendering the members page
            res.render('users/view_members', {   user : clothchunk, note : userchunk });
        });
    });

});
//calling the router to display 500 level brethren
router.get('/500', isLoggedin,function(req, res, next) {
    //fetching from the database
    User.find({'level' : '500'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        //fetching from the database
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            //rendering the next page
            res.render('users/view_members', {   user : clothchunk, note : userchunk });
        });
    });

});
router.get('/100l',isLoggedin, function(req, res, next) {
    User.find({'level' : '100'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDa
        te();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            res.render('users/attendance', {   user : clothchunk, note : userchunk });
        });
    });

});
router.get('/200l',isLoggedin, function(req, res, next) {
    User.find({'level' : '200'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            res.render('users/attendance', {   user : clothchunk, note : userchunk });
        });
    });

});
router.get('/300l',isLoggedin, function(req, res, next) {
    User.find({'level' : '300'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            res.render('users/attendance', {   user : clothchunk, note : userchunk });
        });
    });

});
router.get('/400l',isLoggedin, function(req, res, next) {
    User.find({'level' : '400'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            res.render('users/attendance', {   user : clothchunk, note : userchunk });
        });
    });

});
router.get('/500l',isLoggedin, function(req, res, next) {
    User.find({'level' : '500'} , function (err , user) {
        if(err){
            req.flash('error');
        }
        var clothchunk=[];
        var chunknum=3;
        for (var i = 0; i <user.length;  i+=chunknum) {
            clothchunk.push(user.slice(i , i +chunknum));
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            console.log(user);
            res.render('users/attendance', {   user : clothchunk, note : userchunk });
        });
    });

});


router.get('/view_members',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/view_members', {    note : userchunk });
    });

});
router.get('/view/:id', function(req, res, next) {
    var id = req.params.id;
    User.findById(id , function (err , user) {
        var m="";
        if(err){
            return req.flash('error' , 'error in connection')
        }
        if(user.m_b===0){
            m="January";
        }
        if(user.m_b===1){
            m="February";
        }
        if(user.m_b===2){
            m="March";
        }

        if(user.m_b===3){
            m="April";
        }
        if(user.m_b===4){
            m="May";
        }
        if(user.m_b===5){
            m="June";
        }
        if(user.m_b===6){
            m="July";
        }
        if(user.m_b===7){
            m="August";
        }
        if(user.m_b===8){
            m="September";
        }
        if(user.m_b===9){
            m="October";
        }
        if(user.m_b===10){
            m="November";
        }
        if(user.m_b===11){
            m="December";
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunk.push(users.slice(i, i + chunk));
            }

            res.render('users/view_members_d' , {
                firstname : user.firstname,
                secondname : user.secondname,
                level : user.level,
                unit :user.unit,
                unit2 :user.unit2,
                school: user.school,
                status : user.status,
                phone:user.phone_number,
                profile_image : user.profile_image,
                month : m,
                day : user.d_b,
                year : user.y_b,
                executive : user.executive_role,
                department : user.department,
                address : user.address,
                email : user.email,
                facebook: user.facebook,
                twitter : user.twitter,
                whatsapp : user.whatsapp,
                quote : user.quote,
                id : user._id,
                note: userchunk


            });
        });

    });

});
router.get('/edit/:id',isLoggedin, function(req, res, next) {
    var id = req.params.id;
    User.findById(id , function (err , user) {
        var m="";
        if(err){
            return req.flash('error' , 'error in connection')
        }
        if(user.m_b===0){
            m="January";
        }
        if(user.m_b===1){
            m="February";
        }
        if(user.m_b===2){
            m="March";
        }

        if(user.m_b===3){
            m="April";
        }
        if(user.m_b===4){
            m="May";
        }
        if(user.m_b===5){
            m="June";
        }
        if(user.m_b===6){
            m="July";
        }
        if(user.m_b===7){
            m="August";
        }
        if(user.m_b===8){
            m="September";
        }
        if(user.m_b===9){
            m="October";
        }
        if(user.m_b===10){
            m="November";
        }
        if(user.m_b===11){
            m="December";
        }
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunk.push(users.slice(i, i + chunk));
            }

            res.render('users/member_d' , {
                firstname : user.firstname,
                secondname : user.secondname,
                level : user.level,
                school : user.school,
                unit :user.unit,
                unit2 :user.unit2,
                status : user.status,
                phone:user.phone_number,
                profile_image : user.profile_image,
                month : m,
                day : user.d_b,
                year : user.y_b,
                executive : user.executive_role,
                department : user.department,
                address : user.address,
                email : user.email,
                facebook:user.facebook,
                twitter : user.twitter,
                whatsapp : user.whatsapp,
                quote : user.quote,
                id : user._id,
                note: userchunk


            });
        });


    });

});
router.get('/view_members_d',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/view_members_d', {   note : userchunk });
    });

});
router.post('/submit/:id' , upload.single('profile_image'),
    function (req, res , next){
var newString="";
        if(req.file){
            var string = new String(req.file.path);
            string = string.split('\\');

            console.log(string);
            string = string.slice(1 , string.length);
            console.log(string);
             newString= ('/' + string.join('/'));

            console.log(newString);
        }

        // console.log(req.file);
    var firstname = req.body.firstname;
    var unit2= req.body.unit2;
    var secondname = req.body.secondname;
    var level = req.body.level;
    var unit = req.body.unit;
    var status = req.body.status;
    var month = req.body.m_b;
    var day = req.body.d_b;

        var year = req.body.y_b;
    var email= req.body.email;
    var school = req.body.school;
    var whatsapp = req.body.whatsapp;
    var facebook = req.body.facebook;
    var twitter = req.body.twitter;
    var quote = req.body.quote;
    var phone = `234${req.body.phone_number}`;
    var department = req.body.department;
    var role = req.body.executive_role;
    var address = req.body.address;
    var P_A = req.body.P_A;
    var id = req.params.id;

    User.findById(id , function(err , user){




        var m=0;
        if(err){
            return req.flash('error' , 'error in connection')
        }
        if(month==="January"){
            m=0;
        }
        if(month==="February"){
            m=1;
        }
        if(month==="March"){
            m=2;
        }
        if(month==="April"){
            m=3;
        }
        if(month==="May"){
            m=4;
        }
        if(month==="June"){
            m=5;
        }
        if(month==="July"){
            m=6;
        }
        if(month==="August"){
            m=7;
        }
        if(month==="September"){
            m=8;
        }
        if(month==="October"){
            m=9;
        }
        if(month==="November"){
            m=10;
        }
        if(month==="December"){
            m=11;
        }
        if(role==="President") {
            User.find({
                'executive_role':
                    'President'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }



        if(role==='Vice President') {
            User.find({
                'executive_role':
                    'Vice President'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if(role==='General Secretary') {

            User.find({
                'executive_role':

                    'General Secretary'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if(role==='Assistant General Secretary') {

            User.find({
                'executive_role':

                    'Assistant General Secretary'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if(role=== 'Brothers Coordinator') {
            User.find({
                'executive_role':

                    'Brothers Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if(role==='Evangelism Coordinator') {
            User.find({
                'executive_role':

                    'Evangelism Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if(role==='Assistant Evangelism Coordinator'){
            User.find({'executive_role' :

                    'Assistant Evangelism Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}

        if(role==='Choir Coordinator'){
            User.find({'executive_role' :

                    'Choir Coordinator'

            },function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}
        if(role===  'Assistant Choir Coordinator'){
            User.find({'executive_role' :

                    'Assistant Choir Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });
        }

        if(role===  'Welfare Coordinator'){
            User.find({'executive_role' :

                    'Welfare Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}

        if(role=== 'Assistant Welfare Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Welfare Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if(role==='Assistant Welfare Coordinator'){
            User.find({'executive_role' :

                    'Assistant Welfare Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}
        if(role==='Publicity Coordinator'){
            User.find({'executive_role' :

                    'Publicity Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}

        if (role==='Assistant Publicity Coordinator'){
            User.find({'executive_role' :

                    'Assistant Publicity Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}
        if (role==='Academic Coordinator') {
            User.find({
                'executive_role':

                    'Academic Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role=== 'Assistant Academic Coordinator') {
            User.find({'executive_role' :

                    'Assistant Academic Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}
        if (role==='Drama Unit Coordinator') {
            User.find({
                'executive_role':

                    'Drama Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role=== 'Assistant Drama Unit Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Drama Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role==='Ushering Unit Coordinator'){
            User.find({'executive_role' :

                    'Ushering Unit Coordinator'},function (err , result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach( function(res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}} , function (err , user) {
                        return user;
                    });
                });
            });}
        if(role=== 'Assistance Ushering Unit Coordinator') {
            User.find({
                'executive_role':

                    'Assistance Ushering Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role==='Sisters Coordinator') {
            User.find({
                'executive_role':

                    'Sisters Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role==='Assistant Sisters Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Sisters Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role==='Ex-Officio1') {
            User.find({
                'executive_role':

                    'Ex-Officio1'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role==='Ex-Officio2') {
            User.find({
                'executive_role':

                    'Ex-Officio2'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] ,executive: 'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }








     User.update(user , {$set: {
             firstname : (firstname ? firstname : user.firstname),
             secondname : (secondname ? secondname :user.secondname),
             level : (level ? level :user.level),
             unit : (unit ? unit :user.unit),
             status : (status ? status :user.status),
             m_b : (m ? m :user.m_b),
             unit2: (unit2 ? unit2 :user.unit2 ),
             d_b: (day ? day :user.d_b),

             y_b : (year ? year :user.y_b),
             email : (email ? email :user.email),
             whatsapp : ( whatsapp  ?  whatsapp  :user.whatsapp ),
             facebook: (facebook  ? facebook  :user.facebook ),
             twitter: (twitter ? twitter  :user.twitter),
             quote: (quote ?quote :user.quote),
             phone_number: (phone ?phone:user.phone_number),
             department : (department  ?department :user.department ),
             P_A : (P_A  ?P_A :user.P_A ),
             executive_role : (role  ? role :'' ),
             executive: (role  ? 'YES' :'NO' ),
             profile_image :(req.file ? newString : user.profile_image),
             address : (address  ?address :user.address ),
             school : (school  ?school :user.school )

         }} , function (err , user) {
         if(err){
             return res.redirect('/')
         }
         return user
     } );
        var d = new Date();
        var _day = d.getDate();
        var _month = d.getMonth();
        User.find({"m_b": _month, "d_b": _day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }
            res.render('users/levels' , {message: `Profile updated` , note : userchunk});
        });


    });

});











router.get('/edit',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/sidebar', {note: userchunk})
    });

});
router.get('/update',isLoggedin, function(req, res, next) {
    var _d = new Date();
    var _day = _d.getDate();
    var _month = _d.getMonth();
    User.find({"m_b": _month, "d_b": _day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/update', {note: userchunk})
    });

});

router.post('/update',isLoggedin, function(req, res, next) {
    if(req.body.set_name===""){
        var message = `Please enter the graduating set's name `;
        var d = new Date();
        var _day = d.getDate();
        var _month = d.getMonth();
        User.find({"m_b": _month, "d_b": _day}, function (err, user) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunk.push(user.slice(i, i + chunk));
            }

             res.render('users/update', {message : message , note : userchunk})
        });


    }
    else if(req.body.graduation_year===""){
        var errorMsg = 'Please enter the graduation year ';
        var dl = new Date();
        var dayl = dl.getDate();
        var monthl = dl.getMonth();
        User.find({"m_b": monthl, "d_b": dayl}, function (err, users) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunk.push(users.slice(i, i + chunk));
            }

            res.render('users/update', {messag: errorMsg , note : userchunk})

        });

    }
    else if(req.body.password!=="peculiar123"){
        var msg1 = 'Please enter correct password ';
        var day = new Date();
        var day_ = day.getDate();
        var month_ = day.getMonth();
        User.find({"m_b": month_, "d_b": day_}, function (err, users) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunk.push(users.slice(i, i + chunk));
            }

            res.render('users/update', {msg1: msg1 , note : userchunk})

        });

    }

 else {


        User.find({'level' : '500'}, function (err, users) {


                var alumni = new Alumni();
                alumni.user =  users;
                alumni.set_name = req.body.set_name;
                alumni.year = req.body.graduation_year;
                alumni.save();



        }).then(function(){
            User.find({'level': '400' , 'school' : 'SHHT'}, function (err, user) {

                var alumni = new Alumni();
                alumni.user = user;
                alumni.set_name =`${req.body.set_name} ${req.body.graduation_year} From SHHT`  ;
                alumni.year = req.body.graduation_year;
                alumni.save();

            });
        });




        User.remove({'level': '500'}, (err, user) => {
            console.log(user);
            if (err) {
                return res.redirect('/');
            }
            return user;

        });

        User.remove({'level': '400' , 'school' : 'SHHT'}, (err, user) => {
            console.log(user);
            if (err) {
                return res.redirect('/');
            }
            return user;

        });



        User.find(function (err, user) {

            user.forEach(function (user) {

                User.update(user, {$set: {level: user.level + 100}}, function (err, result) {

                    return result;

                });
            });


        });
        var date = new Date();
        var da = date.getDate();
        var mon = date.getMonth();
        User.find({"m_b": mon, "d_b": da}, function (err, users) {
            var userchunk = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunk.push(users.slice(i, i + chunk));
            }

            return res.render('users/update', {Successmessage: 'Successfully Updated database please do not try again' , note : userchunk});

        });


    }


});

router.get('/select',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/select', {note: userchunk})
    });

});



router.get('/attendance',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 4;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/attendance', {note: userchunk})
    });


});

router.get('/present/:id',isLoggedin, function(req, res , next){
    var   id = req.params.id;
    var date = new Date();
    var dayofweek= date.getDay();
    var minute= date.getMinutes();


    if(dayofweek===3){

        User.findById(id , function( err , user){

            User.update(user , {$set :{wed : ('present')}} , function(err, result ){
                if(err){
                    req.flash('error')
                }
                return result;
            });
            User.find({'level' : user.level} , function (err , userss) {
                if(err){
                    req.flash('error');
                }
                var chunksize=[];
                var chunknum=3;
                for (var i = 0; i <userss.length;  i+=chunknum) {
                    chunksize.push(userss.slice(i , i +chunknum));
                }
                var d = new Date();
                var day = d.getDate();
                var month = d.getMonth();
                User.find({"m_b": month, "d_b": day}, function (err, users_b) {
                    var userchunk = [];
                    var chunk = 1;
                    for (var i = 0; i < users_b.length; i += chunk) {
                        userchunk.push(users_b.slice(i, i + chunk));
                    }

                    res.render('users/attendance', {   user :chunksize , note: userchunk });

                });

            });

        });
    }

if(dayofweek===0){

        User.findById(id , function( err , user){

            User.update(user , {$set :{sun : 'present'}} , function(err, result ){
                if(err){
                    req.flash('error')
                }
                return result;
            });
            User.find({'level' : user.level} , function (err , userss) {
                if(err){
                    req.flash('error');
                }
                var chunksize=[];
                var chunknum=3;
                for (var i = 0; i <userss.length;  i+=chunknum) {
                    chunksize.push(userss.slice(i , i +chunknum));
                }
                var d = new Date();
                var day = d.getDate();
                var month = d.getMonth();
                User.find({"m_b": month, "d_b": day}, function (err, users_b) {
                    var userchunk = [];
                    var chunk = 1;
                    for (var i = 0; i < users_b.length; i += chunk) {
                        userchunk.push(users_b.slice(i, i + chunk));
                    }

                    res.render('users/attendance', {   user :chunksize , note: userchunk });

                });

            });

        });
    }
if(dayofweek===5){

        User.findById(id , function( err , user){

            User.update(user , {$set :{fri : 'present'}} , function(err, result ){
                if(err){
                    req.flash('error')
                }
                return result;
            });
            User.find({'level' : user.level} , function (err , userss) {
                if(err){
                    req.flash('error');
                }
                var chunksize=[];
                var chunknum=3;
                for (var i = 0; i <userss.length;  i+=chunknum) {
                    chunksize.push(userss.slice(i , i +chunknum));
                }
                var d = new Date();
                var day = d.getDate();
                var month = d.getMonth();
                User.find({"m_b": month, "d_b": day}, function (err, users_b) {
                    var userchunk = [];
                    var chunk = 1;
                    for (var i = 0; i < users_b.length; i += chunk) {
                        userchunk.push(users_b.slice(i, i + chunk));
                    }

                    res.render('users/attendance', {   user :chunksize , note: userchunk });

                });

            });

        });
    }
else if(dayofweek===1|| dayofweek===2|| dayofweek===4|| dayofweek===6) {
    User.findById(id, function (err, user) {

        User.find({'level': user.level}, function (err, userss) {
            if (err) {
                req.flash('error');
            }
            var chunksize = [];
            var chunknum = 3;
            for (var i = 0; i < userss.length; i += chunknum) {
                chunksize.push(userss.slice(i, i + chunknum));
            }
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth();
            User.find({"m_b": month, "d_b": day}, function (err, users_b) {
                var userchunk = [];
                var chunk = 1;
                for (var i = 0; i < users_b.length; i += chunk) {
                    userchunk.push(users_b.slice(i, i + chunk));
                }

                res.render('users/attendance', {
                    message: 'Sorry today is not a service day!!!',
                    user: chunksize,
                    note: userchunk
                });

            });

        });


    });

}
});

router.get('/church_anthem',isLoggedin, function(req, res, next) {

        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/church_anthem' , {user: users , note : userchunks});
        });


});





router.get('/attendance_result',isLoggedin, function(req, res, next) {

    User.find({'level' : '100', 'sun' : 'present'} , function (err , user_present1) {

        User.find( {'level':'100','sun' : 'absent'} , function (err , user_absent1) {
            User.find({'level' : '200', 'sun' : 'present'} , function (err , user_present2) {

                User.find( {'level':'200','sun' : 'absent'} , function (err , user_absent2) {
                    User.find({'level' : '300', 'sun' : 'present'} , function (err , user_present3) {

                        User.find( {'level':'300','sun' : 'absent'} , function (err , user_absent3) {
                            User.find({'level' : '400', 'sun' : 'present'} , function (err , user_present4) {

                                User.find( {'level':'400','sun' : 'absent'} , function (err , user_absent4) {
                                    User.find({'level' : '500', 'sun' : 'present'} , function (err , user_present5) {

                                        User.find( {'level':'500','sun' : 'absent'} , function (err , user_absent5) {
                                            var d = new Date();
                                            var day = d.getDate();
                                            var month = d.getMonth();
                                            User.find({"m_b": month, "d_b": day}, function (err, user) {
                                                var userchunk = [];
                                                var chunk = 1;
                                                for (var i = 0; i < user.length; i += chunk) {
                                                    userchunk.push(user.slice(i, i + chunk));
                                                }

                                                res.render('users/attendance_result' ,{
                                                    user_present1 : user_present1 ,
                                                    user_absent1:user_absent1 ,
                                                    user_present2 : user_present2 ,
                                                    user_absent2: user_absent2 ,
                                                    user_present3: user_present3,
                                                    user_absent3: user_absent3,
                                                    user_present4 : user_present4,
                                                    user_absent4: user_absent4,
                                                    user_present5 : user_present5,
                                                    user_absent5: user_absent5,
                                                    note:userchunk
                                                });
                                            });



                                        });

                                    });
                                });

                            });
                        });

                    });
                });

            });
        });

    });

});



router.get('/attendance_result_wednesday',isLoggedin, function(req, res, next) {

    User.find({'level' : '100', 'wed' : 'present'} , function (err , user_present1) {

        User.find( {'level':'100','wed' : 'absent'} , function (err , user_absent1) {
            User.find({'level' : '200', 'wed' : 'present'} , function (err , user_present2) {

                User.find( {'level':'200','wed' : 'absent'} , function (err , user_absent2) {
                    User.find({'level' : '300', 'wed' : 'present'} , function (err , user_present3) {

                        User.find( {'level':'300','wed' : 'absent'} , function (err , user_absent3) {
                            User.find({'level' : '400', 'wed' : 'present'} , function (err , user_present4) {

                                User.find( {'level':'400','wed' : 'absent'} , function (err , user_absent4) {
                                    User.find({'level' : '500', 'wed' : 'present'} , function (err , user_present5) {

                                        User.find( {'level':'500','wed' : 'absent'} , function (err , user_absent5) {
                                            var d = new Date();
                                            var day = d.getDate();
                                            var month = d.getMonth();
                                            User.find({"m_b": month, "d_b": day}, function (err, user) {
                                                var userchunk = [];
                                                var chunk = 1;
                                                for (var i = 0; i < user.length; i += chunk) {
                                                    userchunk.push(user.slice(i, i + chunk));
                                                }

                                                res.render('users/attendance_result_wednesday' ,{
                                                    user_present1 : user_present1 ,
                                                    user_absent1:user_absent1 ,
                                                    user_present2 : user_present2 ,
                                                    user_absent2: user_absent2 ,
                                                    user_present3: user_present3,
                                                    user_absent3: user_absent3,
                                                    user_present4 : user_present4,
                                                    user_absent4: user_absent4,
                                                    user_present5 : user_present5,
                                                    user_absent5: user_absent5,
                                                    note:userchunk
                                                });
                                            });



                                        });

                                    });
                                });

                            });
                        });

                    });
                });

            });
        });

    });

});



router.get('/attendance_result_friday',isLoggedin, function(req, res, next) {

    User.find({'level' : '100', 'fri' : 'present'} , function (err , user_present1) {

        User.find( {'level':'100','fri' : 'absent'} , function (err , user_absent1) {
            User.find({'level' : '200', 'fri' : 'present'} , function (err , user_present2) {

                User.find( {'level':'200','fri' : 'absent'} , function (err , user_absent2) {
                    User.find({'level' : '300', 'fri' : 'present'} , function (err , user_present3) {

                        User.find( {'level':'300','fri' : 'absent'} , function (err , user_absent3) {
                            User.find({'level' : '400', 'fri' : 'present'} , function (err , user_present4) {

                                User.find( {'level':'400','fri' : 'absent'} , function (err , user_absent4) {
                                    User.find({'level' : '500', 'fri' : 'present'} , function (err , user_present5) {

                                        User.find( {'level':'500','fri' : 'absent'} , function (err , user_absent5) {
                                            var d = new Date();
                                            var day = d.getDate();
                                            var month = d.getMonth();
                                            User.find({"m_b": month, "d_b": day}, function (err, user) {
                                                var userchunk = [];
                                                var chunk = 1;
                                                for (var i = 0; i < user.length; i += chunk) {
                                                    userchunk.push(user.slice(i, i + chunk));
                                                }

                                                res.render('users/attendance_result_friday' ,{
                                                    user_present1 : user_present1 ,
                                                    user_absent1:user_absent1 ,
                                                    user_present2 : user_present2 ,
                                                    user_absent2: user_absent2 ,
                                                    user_present3: user_present3,
                                                    user_absent3: user_absent3,
                                                    user_present4 : user_present4,
                                                    user_absent4: user_absent4,
                                                    user_present5 : user_present5,
                                                    user_absent5: user_absent5,
                                                    note:userchunk
                                                });
                                            });



                                        });

                                    });
                                });

                            });
                        });

                    });
                });

            });
        });

    });

});


router.get('/attendance_result_3days',isLoggedin, function(req, res, next) {

    User.find({'level' : '100', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_present1) {

        User.find( {'level':'100', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_absent1) {
            User.find({'level' : '200', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_present2) {

                User.find( {'level':'200', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_absent2) {
                    User.find({'level' : '300', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_present3) {

                        User.find( {'level':'300', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_absent3) {
                            User.find({'level' : '400', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_present4) {

                                User.find( {'level':'400', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_absent4) {
                                    User.find({'level' : '500', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_present5) {

                                        User.find( {'level':'500', 'fri' : 'absent', 'wed' : 'absent' , 'sun' : 'absent'} , function (err , user_absent5) {
                                            var d = new Date();
                                            var day = d.getDate();
                                            var month = d.getMonth();
                                            User.find({"m_b": month, "d_b": day}, function (err, user) {
                                                var userchunk = [];
                                                var chunk = 1;
                                                for (var i = 0; i < user.length; i += chunk) {
                                                    userchunk.push(user.slice(i, i + chunk));
                                                }

                                                res.render('users/attendance_result_3days' ,{
                                                    user_present1 : user_present1 ,
                                                    user_absent1:user_absent1 ,
                                                    user_present2 : user_present2 ,
                                                    user_absent2: user_absent2 ,
                                                    user_present3: user_present3,
                                                    user_absent3: user_absent3,
                                                    user_present4 : user_present4,
                                                    user_absent4: user_absent4,
                                                    user_present5 : user_present5,
                                                    user_absent5: user_absent5,
                                                    note:userchunk
                                                });
                                            });



                                        });

                                    });
                                });

                            });
                        });

                    });
                });

            });
        });

    });

});

router.get('/message',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }
        console.log(user);
        res.render('users/message', {note: userchunk})
    });

});
router.get('/birthday_message',isLoggedin, function(req, res, next) {
    return   res.render('users/birthday_message' , {message2 : 'Please enter some texts!!! '})
});

router.post('/birthday_message',isLoggedin, function(req, res, next) {
    console.log('how are you doing i love programming');
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();

    User.find({"m_b": month, "d_b": day}, function (err, user) {
        const getmessage = req.body.message;
        var message = `From CCCSP FUTA. ${getmessage}`;
        var userchunk = [];
        var chunk = 1;
        for (var k = 0; k < user.length; k += chunk) {
            userchunk.push(user.slice(k, k + chunk));
        }


        if (getmessage === "") {

            return res.render('users/message', {message2: 'Please enter some texts!!! '})
        }

        Alumni.find({'user.m_b': month, 'user.d_b': day}, function (err, alumni) {

             alumni.forEach(function (alum) {
               var num =(alum.user[0].phone_number);
                 nexmo.message.sendSms("12034848525", num, message, {type: 'unicode'}, function (err, result) {
                     if (err) {
                         console.log(err);
                     }
                     return result
                 });
             });

        });

            for (var i = 0; i < user.length; i++) {

                nexmo.message.sendSms("12034848525", user[i].phone_number, message, {type: 'unicode'}, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    return result
                });
            }
            res.render('users/birthday_message' ,{message : 'Message sent to birthday celebrants'})


    });
});

router.get('/birthday',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day= d.getDate();
    var month = d.getMonth();

   User.find({"m_b" : month , "d_b" : day}, function (err , user) {
       var userchunk = [];
       var chunk = 1;
       for(var i=0; i<user.length; i+=chunk){
           userchunk.push(user.slice(i , i+chunk));
       }
       var d = new Date();
       var day = d.getDate();
       var month = d.getMonth();

       User.find({"m_b": month, "d_b": day}, function (err, user) {
           var userchunks = [];
           var chunk = 1;
           for (var i = 0; i < user.length; i += chunk) {
               userchunks.push(user.slice(i, i + chunk));
           }

           Alumni.find({'user.m_b' : month , 'user.d_b': day}, function (err, alumni) {

               res.render('users/birthday', {note: userchunks, celebrant: userchunk, alumni_b: alumni});
           });

       });




   });


});

router.get('/executive',isLoggedin, function (req, res , next) {




User.find({'executive':'YES'} , function (err , exe) {
    var userchunk = [];
    var chunk = 3;
    for (var i = 0; i < exe.length; i += chunk) {
        userchunk.push(exe.slice(i, i + chunk));
    }

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunkjj = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunkjj.push(user.slice(i, i + chunk));
        }

        res.render('users/executive', {
            note: userchunkjj,
            executive: userchunk
        });
    });
});


});
router.get('/unit',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunks = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunks.push(user.slice(i, i + chunk));
        }

        res.render('users/unit', {note: userchunks})
    });





});

router.get('/alumni',isLoggedin, function(req, res, next) {

    Alumni.find(function (err, alumnis) {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunks.push(user.slice(i, i + chunk));
            }

            res.render('users/alumni' , {list:alumnis , note : userchunks});
        });



    });

});
router.get('/alumni_d/:id',isLoggedin, function(req, res, next) {
var id = req.params.id;

    Alumni.findById( id ,function (err, alumnis) {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, user) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < user.length; i += chunk) {
                userchunks.push(user.slice(i, i + chunk));
            }
            console.log(user);
            res.render('users/alumni_d' , {note: userchunks, id :alumnis._id, list:alumnis.user , setname : alumnis.set_name});
        });


    });

});
router.get('/choir',isLoggedin, function(req, res, next) {
    User.find({'unit' : 'Choir unit'}, function (err , user) {
        const unit= user[0].unit;
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/unit_d' , {unit:unit,user: user , note: userchunks});
        });

    });



});
router.get('/drama',isLoggedin, function(req, res, next) {
    User.find({'unit' : 'Drama unit'}, function (err , user) {

        const unit= user[0].unit;

        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/unit_d' , {unit :unit,user: user , note : userchunks});
        });

    });

});
router.get('/welfare',isLoggedin, function(req, res, next) {
    User.find({'unit' : 'Welfare unit'}, function (err , user) {
        const unit= user[0].unit;
        console.log(user);
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/unit_d' , {unit:unit,user: user , note : userchunks});
        });
    });

});
router.get('/evangelism',isLoggedin, function(req, res, next) {
    User.find({'unit' : 'Evangelism unit'}, function (err , user) {
        const unit= user[0].unit;
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/unit_d' , {unit:unit,user: user , note : userchunks});
        });
    });

});
router.get('/publicity',isLoggedin, function(req, res, next) {
    User.find({'unit' : 'Publicity unit'}, function (err , user) {
        const unit= user[0].unit;
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/unit_d' , {unit:unit,user: user , note : userchunks});
        });
    });

});
router.get('/academic',isLoggedin, function(req, res, next) {
    User.find({'unit' : 'Academic unit'}, function (err , user) {
        const unit= user[0].unit;
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, users) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < users.length; i += chunk) {
                userchunks.push(users.slice(i, i + chunk));
            }

            res.render('users/unit_d' , {unit:unit,user: user , note : userchunks});
        });
    });

});
router.get('/unit_d',isLoggedin, function(req, res, next) {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, users) {
        var userchunks = [];
        var chunk = 1;
        for (var i = 0; i < users.length; i += chunk) {
            userchunks.push(users.slice(i, i + chunk));
        }

        res.render('users/unit_d' , {note : userchunks});

    });

});





var nexmo = new Nexmo({
    apiKey:'93b1d261',
    apiSecret:'mqHGsR7cTnmGm0Hs'
}, {debug: true});
router.post('/message',isLoggedin, function(req, res, next) {

const  getmessage= req.body.message;
    if(getmessage === ""){

        return   res.render('users/message' , {message2 : 'Please enter some texts!!! '})
    }



        var message = `From CCCSP FUTA. ${getmessage}`;
        User.find({'wed': 'absent', 'fri': 'absent', 'sun': 'absent'}, function (err, user) {
console.log(user);
            for (var i = 0; i < user.length; i++) {
                console.log(user[i].phone_number);
                nexmo.message.sendSms("12034848525", user[i].phone_number, message, {type: 'unicode'} , function (err ,result) {
                    if(err){
                        console.log(err);
                    }
                    return result
                });
            }
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth();
            User.find({"m_b": month, "d_b": day}, function (err, users) {
                var userchunks = [];
                var chunk = 1;
                for (var i = 0; i < users.length; i += chunk) {
                    userchunks.push(users.slice(i, i + chunk));
                }
                User.find({'wed': 'present'}, function (err, present) {
                    present.forEach(function (update_att) {
                        User.update(update_att , {$set:{'wed': 'absent'}} , function (done) {
                            return done
                        })
                    });

                });
                User.find({'fri': 'present'}, function (err, present) {
                    present.forEach(function (update_att) {
                        User.update(update_att , {$set:{'fri': 'absent'}} , function (done) {
                            return done
                        })
                    });

                });
                User.find({'sun': 'present'}, function (err, present) {
                    present.forEach(function (update_att) {
                        User.update(update_att , {$set:{'sun': 'absent'}} , function (done) {
                            return done
                        })
                    });
                    res.render('users/message', {message: 'Message sent to missing members ', note : userchunks })
                });



            });

        });

// other way of performing sendind the sms
        //     user.forEach(function (err , users) {
        //         console.log(user[users].phone_number);
        //         nexmo.message.sendSms("12034848525", user[users].phone_number, message, {type: 'unicode'}, function (err, result) {
        //
        //                     if (err) {
        //                         console.log(err);
        //                      // return   res.redirect('/users/mesage');
        //                     }
        //                     console.log(result);
        //
        //                      // return res.redirect('/users/message')
        //                 });
        //     })
        // });

});




router.get('/oexecutives' ,isLoggedin, function(req,res,next){
   OE.find(function (err, user) {
       // var chunkSize = [];
       // var chunkno = 3;
       // for (var i=0;i<user.length; i+=chunkno){
       //     chunkSize.push(user.forEach(user.oexecutive).slice(i , i+chunkno));
       // }
       var d = new Date();
       var day = d.getDate();
       var month = d.getMonth();
       User.find({"m_b": month, "d_b": day}, function (err, users) {
           var userchunks = [];
           var chunk = 1;
           for (var i = 0; i < users.length; i += chunk) {
               userchunks.push(users.slice(i, i + chunk));
           }

           res.render('users/oexecutives' , {user:user , note : userchunks});

       });

   });

});
router.get('/clearOE' ,isLoggedin, function(req,res,next){

OE.remove((err , result)=>{
    if (err){
        res.flash('error')
    }
    return result
});
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, users) {
        var userchunks = [];
        var chunk = 1;
        for (var i = 0; i < users.length; i += chunk) {
            userchunks.push(users.slice(i, i + chunk));
        }

        res.render('users/oexecutives' , {message :'Successfully cleared records for the church executives' , note : userchunks});

    });




});


router.post('/search' ,isLoggedin, function(req,res,next){
const name = req.body.name;
const  str = new String(name);
var newname = str.split(" ",1 );
var Str= new String(newname);
    var n_a= Str.charAt(0);
    var New = n_a.toUpperCase();
    var destname = Str.replace(n_a,New );
    User.find({'firstname':destname}, function (err, user) {
        if(err){
            req.flash('error' , 'there is an error')
        }
        var userchunkf = [];
        var chunk = 4;
        for(var i=0; i<user.length; i+=chunk){
            userchunkf.push(user.slice(i , i+chunk));
        }
Alumni.find({'user.firstname' : destname}, function (err , users) {

    if(err){
        req.flash('error' , 'there is an error')
    }

    var userchunk = [];
    var chunk = 4;
    for(var i=0; i<users.length; i+=chunk){
        userchunk.push(users.slice(i , i+chunk));
    }

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, userss) {
        var userchunks = [];
        var chunk = 1;
        for (var i = 0; i < userss.length; i += chunk) {
            userchunks.push(userss.slice(i, i + chunk));
        }

        res.render('users/search' , {user:userchunkf , firstname : req.body.name , user1: userchunk , note : userchunks });

    });


});


    });

});
router.get('/remove/:id' ,isLoggedin, function (req , res, next) {
    var id = req.params.id;

    User.remove({'_id' : id} , function (err , results) {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth();
        User.find({"m_b": month, "d_b": day}, function (err, userss) {
            var userchunks = [];
            var chunk = 1;
            for (var i = 0; i < userss.length; i += chunk) {
                userchunks.push(userss.slice(i, i + chunk));
            }

            res.render('users/levels', {message: `Successfully removed` , note : userchunks })

        });


    });


});
router.get('/signup' ,isLoggedin, function (req , res , next) {
    var message = req.flash('error');
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    User.find({"m_b": month, "d_b": day}, function (err, userss) {
        var userchunks = [];
        var chunk = 1;
        for (var i = 0; i < userss.length; i += chunk) {
            userchunks.push(userss.slice(i, i + chunk));
        }

        res.render('users/signup' ,{hasError : message.length>0, message : message  , note : userchunks} )

    });

});

router.get('/home',isLoggedin, function (req , res , next) {
    var success = req.flash('success');

    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();

    User.find({"m_b": month, "d_b": day}, function (err, user) {
        var userchunk = [];
        var chunk = 1;
        for (var i = 0; i < user.length; i += chunk) {
            userchunk.push(user.slice(i, i + chunk));
        }

        res.render('users/home' ,{success :success, isSuccessful :success.length>0 ,admin : req.user.username , note:userchunk });
    });

});

router.get('/chat', function(req, res , next){
     res.render('users/chat')
});

router.get('/chats', function(req, res , next){
    res.render('users/chats')
});


router.post('/signup' ,isLoggedin,passport.authenticate('locals.signup', {
    successRedirect:'/land_page',
    failureRedirect: '/users/signup',
    failureFlash: true,
    successFlash: true
}));


router.post('/Register_member',upload.single('profile_image'), isLoggedin,function (req , res, next ) {

console.log(req.file);

    var firstname = req.body.firstname;
    var phone_number = req.body.phone_number;
    var secondname = req.body.secondname;
    var level = req.body.level;
    var unit = req.body.unit;
    var status = req.body.status;
    var month = req.body.m_b;
    var day = req.body.d_b;
    var year = req.body.y_b;
    var email = req.body.email;
    var whatsapp = req.body.whatsapp;
    var facebook = req.body.facebook;
    var twitter = req.body.twitter;
    var set_name = '';
    var school = req.body.school;
    var quote = req.body.quote;
    var phone = req.body.phone_number;
    var department = req.body.department;
    var role = req.body.executive_role;
    var address = req.body.address;
    var P_A = 'absent';

    var str = new String(phone_number);
    var index = str.indexOf('0');
    var country_number = str.replace(index, '234');
    req.checkBody('profile_image', 'please upload profile image').notEmpty();
    req.checkBody('firstname', 'please enter members first name').notEmpty();
    req.checkBody('secondname', 'please enter members second name').notEmpty();
    req.checkBody('level', 'please enter members level').notEmpty();
    req.checkBody('m_b', 'please enter birth month').notEmpty();
    req.checkBody('d_b', 'please enter  birth day').notEmpty();
    req.checkBody('address', 'please enter members address').notEmpty();
    req.checkBody('department', 'please enter members department').notEmpty();
    req.checkBody('phone_number', 'please enter members phone number').notEmpty();
    req.checkBody('phone_number', 'Phone number too short or too long!!').isLength({max: 11, min: 11});
    req.checkBody('school', 'Please enter school').notEmpty();
    // req.checkBody('profile_image' , 'Please choose a profile picture').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        var message = [];
        errors.forEach(function (error) {
            message.push(error.msg);
        });
        return res.render('users/Register_member' , {message: message , hasError: message.length>0})
        // return done(null, false, req.flash('error', message));
    }
    User.findOne({'firstname': firstname}, function (err, user) {

        if (err) {
            // return done(err)
            return res.redirect('/');
        }
        // if (user) {
        //     // return done(null, false, {message: 'Member already exist'})
        //     return res.render('users/Register_member' , {message: message})
        // }


        var newUser = new User();
        var sttr = new String(firstname);
        var getname = sttr.charAt(0);
        const newname = getname.toLocaleUpperCase();
        var Firstname = sttr.replace(getname, newname);


        newUser.firstname = Firstname;
        newUser.secondname = secondname;
        newUser.level = level;
        newUser.unit = unit;

        newUser.phone_number = country_number;
        newUser.status = status;
        if (month === "January") {
            newUser.m_b = 0;
        }
        if (month === "February") {
            newUser.m_b = 1;
        }
        if (month === "March") {
            newUser.m_b = 2;
        }
        if (month === "April") {
            newUser.m_b = 3;
        }
        if (month === "May") {
            newUser.m_b = 4;
        }
        if (month === "June") {
            newUser.m_b = 5;
        }
        if (month === "July") {
            newUser.m_b = 6;
        }
        if (month === "August") {
            newUser.m_b = 7;
        }
        if (month === "September") {
            newUser.m_b = 8;
        }
        if (month === "October") {
            newUser.m_b = 9;
        }
        if (month === "November") {
            newUser.m_b = 10;
        }
        if (month === "December") {
            newUser.m_b = 11;
        }
        newUser.d_b = day;
        newUser.y_b = year;
        var string = new String(req.file.path);
        console.log(req.file);
   string = string.split('\\');
   console.log(string);
   string = string.slice(1 , string.length);
        console.log(string);
        const newString= ('/' + string.join('/'));


newUser.profile_image=newString;

        newUser.email = email;
        newUser.whatsapp = whatsapp;
        newUser.twitter = twitter;
        newUser.quote = quote;
        newUser.department = department;
        if (role === "President") {
            User.find({
                'executive_role':
                    'President'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }


        if (role === 'Vice President') {
            User.find({
                'executive_role':
                    'Vice President'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': []  , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'General Secretary') {

            User.find({
                'executive_role':

                    'General Secretary'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant General Secretary') {

            User.find({
                'executive_role':

                    'Assistant General Secretary'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Brothers Coordinator') {
            User.find({
                'executive_role':

                    'Brothers Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Evangelism Coordinator') {
            User.find({
                'executive_role':

                    'Evangelism Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant Evangelism Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Evangelism Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }

        if (role === 'Choir Coordinator') {
            User.find({
                'executive_role':

                    'Choir Coordinator'

            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant Choir Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Choir Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }

        if (role === 'Welfare Coordinator') {
            User.find({
                'executive_role':

                    'Welfare Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }

        if (role === 'Assistant Welfare Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Welfare Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant Welfare Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Welfare Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Publicity Coordinator') {
            User.find({
                'executive_role':

                    'Publicity Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }

        if (role === 'Assistant Publicity Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Publicity Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Academic Coordinator') {
            User.find({
                'executive_role':

                    'Academic Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant Academic Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Academic Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Drama Unit Coordinator') {
            User.find({
                'executive_role':

                    'Drama Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant Drama Unit Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Drama Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Ushering Unit Coordinator') {
            User.find({
                'executive_role':

                    'Ushering Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistance Ushering Unit Coordinator') {
            User.find({
                'executive_role':

                    'Assistance Ushering Unit Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Sisters Coordinator') {
            User.find({
                'executive_role':

                    'Sisters Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Assistant Sisters Coordinator') {
            User.find({
                'executive_role':

                    'Assistant Sisters Coordinator'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Ex-Officio1') {
            User.find({
                'executive_role':

                    'Ex-Officio1'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }
        if (role === 'Ex-Officio2') {
            User.find({
                'executive_role':

                    'Ex-Officio2'
            }, function (err, result) {
                var oe = new OE();
                oe.oexecutive = result;
                oe.save();


                result.forEach(function (res) {
                    User.update(res, {$set: {'executive_role': [] , 'executive':'NO'}}, function (err, user) {
                        return user;
                    });
                });
            });
        }


        if (role === "None") {
            newUser.executive_role = '';
            newUser.executive='NO'

        }
        else {
            newUser.executive_role = role;
            newUser.executive='YES'
        }

        newUser.school = school;

        newUser.set_name = set_name;
        newUser.facebook = facebook;
        newUser.address = address;
        newUser.P_A = P_A;
        newUser.wed= "absent";
        newUser.fri= "absent";
        newUser.sun= "absent";



        newUser.save(function (err, user) {
            if (err) {

                return res.redirect('/');

            }
            // return done(null, user, {message: `Sussessfully added ${Firstname} ${secondname} to the ${level} brethren `})
            var d = new Date();
            var day = d.getDate();
            var month = d.getMonth();

            User.find({"m_b": month, "d_b": day}, function (err, user) {
                var userchunk = [];
                var chunk = 1;
                for (var i = 0; i < user.length; i += chunk) {
                    userchunk.push(user.slice(i, i + chunk));
                }

                return res.render('users/levels' , {note :userchunk, message: `Sussessfully added ${Firstname} ${secondname} to the ${level} level brethren `});
            });



        });

    });
});





router.get('/logout' , function (req , res , next) {
    req.logout();
    res.redirect('/')
});

router.get('/history' , function (req , res , next) {
   res.render('users/history')
});




function isLoggedin(req , res , next){
    if(req.isAuthenticated()){
        console.log('you are connected ');
       return next()
    }
    else {
        console.log('you are not connected ');
        return res.redirect('/');
    }
}


module.exports = router;
