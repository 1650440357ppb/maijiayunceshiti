var express = require('express');
var router = express.Router();
var mysql=require("../comm/mysql.js");
var crypto=require("crypto");
/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log(1);
    res.render("admin/login.html");
});
router.use('/check', function(req, res, next) {
    var username=req.body.username;
    var password=req.body.password;
    var md5 = crypto.createHash('md5');
    md5.update(password);
    password=md5.digest('hex');
    var flag=true;
    mysql.query("select * from admin",function(error,rows){
        var result=rows[0];
        if(result.username==username){
            if(result.password==password){
                flag=false;
                req.session.login="yes";
                req.session.username=username;
                res.redirect("/admin");
            }
        }
        if(flag){
            res.redirect("/login");
        }
    })

});

module.exports = router;