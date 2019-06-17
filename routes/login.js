var express = require('express');
var router = express.Router();
var pool = require("./pool");
// 删除书
router.get('/del', function (req, res) {
    var json = req.query;
    pool.conn({
        sql: "select * from createbook where uid=?",
        arr: [json.uid],
        success(data) {
            pool.conn({
                sql: "delete from createbook where uid=" + json.uid,
                success(data) {
                    pool.conn({
                        sql: "delete from chap where uid=" + json.uid,
                        success(data) {
                            pool.conn({
                                sql: "delete from content where uid=" + json.uid,
                                success(data) {
                                    res.send("删除成功");
                                },
                                error(err) {
                                    res.send(err);
                                }
                            })
                        },
                        error(err) {
                            res.send(err);
                        }
                    });
                },
                error(err) {
                    return;
                }
            });
        },
        error(err) {
            res.send(err);
        }
    })
});
// 修改个人信息
router.post('/updat', function (req, res) {
    var json = req.body;
    // if(json==null) return;
    pool.conn({
        sql: "update login set name=?,img=? where uid=?",
        arr: [json.nicheng, json.img, json.uid],
        success(data) {
            res.send("修改成功");
        },
        error(err) {
            res.send(err);
        }
    })
});
// 热搜
router.post('/resou', function (req, res) {
    pool.conn({
        sql: 'select * from createbook',
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
    // if(json==null) return;
    pool.conn({
        sql: 'select * from pl where bookid=? order by uid desc',
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
    // if(json==null) return;
    pool.conn({
        sql: 'insert into pl(user,img,text_pl,bookid) values(?,?,?,?)',
        arr: [json.user, json.img, json.pltext, json.bookid],
        success(data) {
            if (data.length) {
                pool.conn({
                    // select * from text_cc where songuid=? order by uid desc
                    sql: 'select * from pl where bookid=? order by uid desc',
                    arr: [json.bookid],
                    success(data) {
                        if (data.length) {
                            console.log(data);
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
            } else {
                res.send(data);
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
// 已创建的小说
router.get('/loguid', function (req, res) {
    var json = req.query;
    
    pool.conn({
        sql: 'select * from createbook where loginid=?',
        arr: [json.logid],
        success(data) {
            if (data.length) {
                var result = data;
                res.send(result);
            } else {
                res.send("没有数据了");
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
        sql: 'select * from createbook where name like "%' + json + '%"',
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
    pool.conn({
        sql: "select * from createbook where loginid=?",
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
//更新小说的rs次数
router.get("/uprsid",(req,res)=>{
    var json=req.query;
    pool.conn({
        sql: "update createbook set rsid=? where uid=?",
        arr: [json.rsid, json.uid],
        success(data) {
            res.send("点击率以增加");
        },
        error(err) {
            res.send(err);
        }
    })
})
// 创建书名
router.post('/bookup', function (req, res) {
    var json = req.body;
    pool.conn({
        sql: "insert into createbook(name,author,briefing,bookimg,loginid,rsid) values(?,?,?,?,?,1)",
        arr: [json.bookname, json.author, json.briefing, json.bookimgurl, json.useruid],
        success(data) {
            pool.conn({
                sql: "select * from createbook where name=? and author=? and loginid=?",
                arr: [json.bookname, json.author, json.useruid],
                success(data) {
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
                return;
            }
        },
        error(err) {
            res.send(err);
        }
    })
});
module.exports = router;