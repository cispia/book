var express = require('express');
var router = express.Router();
var pool = require("./pool");
// 热搜
router.post('/resou', function (req, res) {
    pool.conn({
        sql: 'select * from creatbook limit 0,6',
        success(data) {
            if (data.length) {
                var result = data;
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
// 评论内容
router.post('/pllist', function (req, res) {
    var json = req.body;
    console.log(json);
    pool.conn({
        sql: 'select * from pl where bookid=?',
        arr: [json.uid],
        success(data) {
            if (data.length) {
                var result = data;
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
//评论
router.post('/insert', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: 'insert into pl(user,img,text_pl,bookid) values(?,?,?,?)',
        arr: [json.user, json.img, json.pltext, json.bookid],
        success(data) {
            if (data.length) {
                    pool.conn({
                        sql: 'select * from pl where bookid=?',
                        arr: [json.bookid],
                        success(data) {
                            if (data.length) {
                                console.log(data);
                            var result=data;
                            res.send(result);
                            } else {
                                res.send(data);
                            }
                        },
                        error(err) {
                            res.send(err+"123");
                        }
                    })
            } else {
                res.send(data);
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 内容
router.get('/read', function (req, res) {
    var json = req.query;
    // console.log(json);
    // res.send("ok");
    pool.conn({
        sql: 'select * from content where chapid=?',
        arr: [json.uid],
        success(data) {
            if (data.length) {
                var result = data;
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
// 章节详情
router.post('/chap', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: 'select * from chap where bookid=?',
        arr: [json.uid],
        success(data) {
            if (data.length) {
                var result = data;
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
// 搜索小说
router.post('/seatch', function (req, res) {
    var json = req.body.hotkey;
    pool.conn({
        sql: 'select * from creatbook where name like "%' + json + '%"',
        success(data) {
            if (data.length) {
                var result = data;
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
// 创建小说列表
router.post('/list', function (req, res) {
    var json = req.body;
    console.log(json);
    // res.send("ok");
    pool.conn({
        sql: "select * from creatbook where loginid=?",
        arr: [json.userid],
        success(data) {
            if (data.length) {
                var result = data;
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
//创建章节
router.post('/chapup', function (req, res) {
    var json = req.body;
    // console.log(json);
    pool.conn({
        sql: "insert into chap(name,bookid) values(?,?)",
        arr: [json.name, json.bookid],
        success(data) {
            pool.conn({
                sql: "select * from chap where name=? and bookid=?",
                arr: [json.name, json.bookid],
                success(data) {
                    res.send(data[0]);
                    // 创建内容
                    router.post('/content', function (req, res) {
                        var json = req.body;
                        console.log(json);
                        pool.conn({
                            sql: "insert into content(chapid,text) values(?,?)",
                            arr: [json.chap, json.text],
                            success(data) {
                                res.send("发布成功");
                            },
                            error(err) {
                                res.send(err);
                            }
                        })
                    });
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
// 创建书名
router.post('/bookup', function (req, res) {
    var json = req.body;
    // console.log(json);
    pool.conn({
        sql: "insert into creatbook(name,author,briefing,bookimg,loginid) values(?,?,?,?,?)",
        arr: [json.bookname, json.author, json.briefing, json.bookimgurl, json.useruid],
        success(data) {
            pool.conn({
                sql: "select * from creatbook where name=? and author=? and loginid=?",
                arr: [json.bookname, json.author, json.useruid],
                success(data) {
                    // var result=JSON.stringify(data);
                    res.send(data[0]);
                },
                error(err) {
                    res.send(err);
                }
            })
        },
        error(err) {
            res.send(err);
        }
    })
});
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
                result.tip = "登录成功";
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