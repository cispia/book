var express = require('express');
var router = express.Router();
var pool = require("./pool");
// 注册
router.post('/up', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "select user from login where user=?",
        arr: [json.user],
        success(data) {
            if (data.length) {
                res.send("账号已存在");
            } else {
                pool.conn({
                    sql: "insert into login(name,user,pass,img) values(?,?,?,?)",
                    arr: [json.name, json.user, json.pass, json.userimg],
                    success(data) {
                        res.send("注册成功");
                    },
                    error(err) {
                        res.send(err);
                    }
                })
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 登录
router.post('/in', function (req, res) {
    var json = req.body;
    console.log(json);
    pool.conn({
        sql: "select * from login where user=? and pass=?",
        arr: [json.user, json.pass],
        success(data) {
            if (data.length) {
                var result = data[0];
                result.tip="登录成功";
                result.pwd = "";
                res.send(result);
            } else {
                res.send(data);
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
module.exports = router;