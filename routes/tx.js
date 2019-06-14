var express = require('express');
var fs=require("fs");
var multer=require("multer");
var path=require("path");
var router = express.Router();
var routersong=express.Router();
router.use(multer({dest:"./public/file/tx"}).any())
// 头像上传
router.post('/tx', function(req, res) {
    var file=req.files[0];
    var oldname=file.filename;
    var newname=oldname+path.parse(file.originalname).ext;
    fs.renameSync('./public/file/tx/'+oldname,'./public/file/tx/'+newname)
  res.send("/file/tx/"+newname);
});
module.exports = router;
