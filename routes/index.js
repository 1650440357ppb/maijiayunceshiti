var express = require('express');
var mysql=require("../comm/mysql");
var router = express.Router();
// var path=require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(rootPath+"/views/index/index.html");
});
router.get('/tpl/:name',function(req,res,next){
  res.sendFile(rootPath+"/public/tpl/"+req.params.name);
});
router.get('/ajaxNews',function(req,res,next){
  mysql.query(`select * from news`,function(error,rows){
    res.send(JSON.stringify(rows));
  })
});
router.get('/ajaxNewsCon',function(rea,res,next){
  var id=req.query.id;
  mysql.query(`select * from news where id=`+id,function(error,rows){
    res.send(JSON.stringify(rows[0]));
  })
});
router.get('/ajaxPhone',function(req,res,next){
  mysql.query(`select * from user`,function(error,rows){
    rows.unshift({name:req.session.name,id:req.session.uid});
    res.send(JSON.stringify(rows));
  })
});
module.exports = router;


















