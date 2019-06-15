var express = require('express');
var fs=require("fs");
var multer=require("multer");
var path=require("path");
var router = express.Router();
router.use(multer({dest:"./public/file/bookimg"}).any())
// 封面上传
router.post('/bookimg', function(req, res) {
    var file=req.files[0];
    console.log(file);
    var oldname=file.filename;
    var newname=oldname+path.parse(file.originalname).ext;
    fs.renameSync('./public/file/bookimg/'+oldname,'./public/file/bookimg/'+newname)
  res.send("/file/bookimg/"+newname);
});
module.exports = router;
