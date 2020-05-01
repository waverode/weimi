/*******************************************/
/************创建数据库连接池****************/
/*******************************************/
//导入第三方提供的数据库驱动包
let mysql = require('mysql')

//使用mysql包提供的函数和对象，创建数据库连接池
let pool = mysql.createPool({
    host:       '127.0.0.1',
    port:       '3306',
    user:       'root',
    password:   '',
    database:   'wm',
    connectionLimit: 10     //连接池大小限制   
})

/*******************************************/
/*************创建Web服务器******************/
/*******************************************/
//导入第三方模块：express，创建基于Node.js的Web服务器
let  express = require('express')

//调用第三方模块提供的功能
let server = express()


//运行Web服务器监听特定的端口
let port = 5050
server.listen(port, function(){
    console.log('服务器启动成功，正在监听端口：', port)
})

/*******************************************/
/***************后台API*********************/
/*******************************************/

//使用Express提供的中间件：处理POST请求中的主体数据，保存在req.body属性中
//处理application/x-www-form-urlencoded类型的请求数据
server.use(express.urlencoded({
    extended: false     //是否使用扩展工具解析请求主体
}))


//自定义中间件：允许指定客户端的跨域访问
server.use(function(req, res, next){
    res.set('Access-Control-Allow-Origin',  '*') //当前服务器允许来自任何客户端的跨域访问
      next() //放行，让后续的请求处理方法继续处理
})



/**
 * 商品模块
 */

/**
 * 1.1 单类商品列表
 */
server.get("/product/list",function(req,res){
    // 获取请求的数据
    let pno = req.query.pno
    let pageSize = req.query.pageSize
    let category = 'phone'
    if(req.query.category)
        category = req.query.category
    let sortflag = 1
    if(req.query.sortflag){
        sortflag=req.query.sortflag
    }
    
    let output = {recordCount:0,
                  pageSize:pageSize,
                  pno:2,
                  data:[{}],
                  picList:[{}]
                  }
    
    // //通过数据库查询
    let recordCountLoaded =false
    let infoLoaded = false
    let picLoaded = false
    //计算总共有多少商品记录
    let sql1 = "SELECT COUNT(pid) as recordCount FROM wm_product WHERE category = ?"
    pool.query(sql1,[category],function(err,result){
        if(err)throw err
        if(result.length>0){
        output.recordCount = result[0].recordCount
        recordCountLoaded=true
        if(infoLoaded&&picLoaded)
            res.json(output)
        }else{
            recordCountLoaded=true //商品表中没有记录
            if(infoLoaded&&picLoaded)
                res.json(output)
        }
    })
    let sql2 = "SELECT pid,name,price,is_onsale FROM wm_product WHERE category = ? ORDER BY "
    if(sortflag==1){
        sql2 +=` pid`
    }else if(sortflag==2){
        sql2 +=` price`
    }else{
        sql2 +=` shelf_time`
    } 
    // 按顺序查询所有商品信息
    pool.query(sql2,[category,sortflag],function(err,result){
        if(err) throw err
        if(result.length>0){
            for(let i=0;i<result.length;i++){
                output.data[i]=result[i]                
            } 
            infoLoaded=true       //全部商品信息查找成功                                         
            if(recordCountLoaded&&picLoaded){  
                res.json(output)  
            }
        }else{
            infoLoaded=true       //没有商品记录
            if(recordCountLoaded&&picLoaded)  
            res.json(output)  
            
        }      
    })
    let sql3 = "SELECT distinct pid,md FROM wm_product_pic as A,wm_product as B WHERE A.product_id = B.pid AND B.category=? ORDER BY"
    if(sortflag==1){
        sql3 +=` pid`
    }else if(sortflag==2){
        sql3 +=` price`
    }else{
        sql3 +=` shelf_time`
    } 
    //查询商品图片
    pool.query(sql3,[category,sortflag],function(err,result1){
        if(err) throw err
        if(result1.length>0){
            output.picList=result1
                          
            picLoaded=true
            if(recordCountLoaded&&infoLoaded){  
                
                res.json(output)
            }  
        }else{
            if(recordCountLoaded&&infoLoaded)  
                res.json(output) 
        }
    })
    
})
/**
 * 1.2 商品详情
 */
server.get('/product/details',function(request,response){
    //读取客户端请求消息传来的请求数据 pid
    let pid = request.query.pid
    if(!pid){
        response.json( {} ) 
        return
    }
    //向数据库查询
    let output = {details:{},family:{}}
    let detailsLoaded = false //商品详情加载完成了吗
    let familyLoaded = false //商品型号信息加载完成了吗
    //查询1：根据商品编号查询到对应的型号编号，据此查询出型号信息
    let sql = 'SELECT fid,name FROM wm_product_family WHERE fid=(SELECT family_id FROM wm_product WHERE pid=?)'
    pool.query(sql, [pid],function(err,result){
        if(err) throw err
        if(result.length>0){   //根据商品编号查询到了对应型号对象
            output.family = result[0]
            //根据型号编号，查询属于该型号的商品编号和规格
            let sql = 'SELECT pid,spec,color FROM wm_product WHERE family_id=?'
            pool.query(sql,[output.family.fid],function(err,result){
                if(err) throw err
                output.family.productList = result //根据型号编号查询到了该型号的所有商品       
                //向客户端输出响应消息--只有笔记本信息已经获得到才输出
                familyLoaded = true //商品型号，以及型号下的商品加载完成
                if(detailsLoaded){  //如果商品详情也加载完成，则执行输出
                    response.json(output)            
                }
            })
        }else{
            familyLoaded =true //型号加载完成--没有找到
            if(detailsLoaded){
                response.json(output)
            }
        }
        
    }) 

    //查询2：根据编号查询对应的详细信息
    let sql2 = 'SELECT * FROM wm_product WHERE pid=?'
    pool.query(sql2,[pid],function(err,result){
      if(err) throw err
      if(result.length>0){   //根据编号查询到了对应详细信息对象
          output.details = result[0]
          let sql2 = 'SELECT * FROM wm_product_pic WHERE product_id = ?'
          pool.query(sql2,[pid],function(err,result){
              if(err) throw err
              output.details.picList = result
              //向客户端输出响应信息---只有型号信息已经获得到才输出
              detailsLoaded = true //若型号信息加载完成，则执行输出
              if(familyLoaded){
                  response.json(output)
                }
          })
      }else{
        detailsLoaded = true  //笔记本信息加载完成--没有找到
        if(familyLoaded){
            response.json(output)
        }
    }
   })
})
/** 
 * 1.3 删除商品
 */
server.get('/product/delete',function(request,response){
    //读取客户端请求传来的数据
    let pid = request.query.pid
    //执行数据库操作--DELETE
    let sql = 'DELETE FROM wm_product WHERE pid = ?'
    pool.query(sql,[pid],function(err,result){
        let output = {code:501,msg:'delete fail'}
        if(err) throw err
        if(result.length>0){
            if(result[0].affectedRows==1){
                output.code = 200
                output.msg = 'delete succ'
            }
            else if(result[0].affectedRows==0){
                output.code = 401
                output.msg = 'pid is not found'
            }
        }
        //向客户端发送响应信息
        response.json(output)
    })
})
/**
 * 1.4 添加商品
 */
server.post('/product/add',function(request,response){
    //读取客户端请求传送的数据
    let output = {code:200,msg:'add succ'}
    let family_id = request.body.family_id  
    if(!family_id){
        output.code=401
        output.msg='family_id is null'
    }
    let title = request.body.title
    if(!title){
        output.code=402
        output.msg='title is null'
    }
    let subtitle = request.body.subtitle
    if(!subtitle){
        output.code=403
        output.msg='subtitle is null'
    }
    let price = request.body.price
    if(!price){
        output.code=404
        output.msg='price is null'
    }
    let spec = request.body.spec
    if(!spec){
        output.code=405
        output.msg='spec is null'
    }
    let name = request.body.name
    if(!lname){
        output.code=406
        output.msg='anme is null'
    }
    let os = request.body.os
    if(!os){
        output.code=407
        output.msg='os is null'
    }
    let memory = request.body.memory
    if(!memory){
        output.code=408
        output.msg='memory is null'
    }
    let resollution = request.body.resollution
    if(!resollution){
        output.code=409
        output.msg='resollution is null'
    }
    let cpu = request.body.cpu
    if(!cpu){
        output.code=410
        output.msg='cpu is null'
    }
    let category = request.body.category
    if(!category){
        output.code=411
        output.msg='category is null'
    }
    let details = request.body.details
    if(!details){
        output.code=412
        output.msg='details is null'
    }
    let shelf_time = request.body.shelf_time
    if(!shelf_time){
        output.code=413
        output.msg='shelf_time is null'
    }
    let sold_count = request.body.sold_count
    if(!sold_count){
        output.code=414
        output.msg='sold_count is null'
    }
    let is_onsale = request.body.is_onsale
    if(!is_onsale){
        output.code=415
        output.msg='is_onsale is null'
    }
    let color = request.body.color
    if(!is_onsale){
        output.code=416
        output.msg='color is null'
    }
    
    //如果传入的值有空值则立即返回信息，不在操作数据库
    if(output.code!=200){
        response.json(output)
        return
    }

    //执行数据库操作
    let sql = 'INSERT INTO wm_product(family_id,title,subtitle,price,spec,color,name,os,memory,cpu,category,details,shelf_time,sold_count,is_onsale)  VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    pool.query(sql,[family_id,title,subtitle,price,spec,color,name,os,memory,cpu,category,details,shelf_time,sold_count,is_onsale],function(err,result){
    //向客户端发送响应信息
    if(err) throw err
    if(result.length>0){
        response.json(output)
    }
    })

})
/** 
 * 1.5 商品搜索
 */
server.get('/search',function(req,res){
    //获取客户端想查询的商品
    let w = req.query.keyword  
    if(!w){
        res.json( {code:405,msg:'keyword required'} )
        return
    }
    
    //执行模糊查询
    //查商品
    let sql = "SELECT pid,name,price FROM wm_product WHERE name LIKE '%"+w+"%' "
    let output  = {
        pid:[],
        name:[],
        price:[],
        md:[],
    }
    
    pool.query(sql,w,function(err,result){
        if(err) throw err
        if(result.length>0){
            let len = result.length   //搜索出的商品数量
            let loaded = 0   //加载图片数量
            for(let i in result){
                 output.pid[i] = result[i].pid
                 output.name[i] = result[i].name
                 output.price[i] = result[i].price
            }
            //  console.log(result) 
            //查询商品的md图片
            let sql1 = "SELECT md FROM wm_product_pic WHERE product_id = ?"
            for(let i in result){
                let id = result[i].pid    
                pool.query(sql1,id,function(err,result1){
                    if(err) throw err
                    if(result1.length>0){
                        console.log(result1[0])
                         output.md[i] = result1[0].md
                         loaded++
                         if(loaded==len){   //当loaded == len 图片加载完成
                            //   console.log(output)
                             res.json({code:399,msg:'search succ',output:output})
                             return
                         }
                         return
                      }
                })
            }
        }
        else{
            res.json({code:406,msg:'product no exsist'})
            return
        } 
    })

})
/**
 * 1.6 首页商品轮播内容
 */
server.get('/index/carousel',function(req,res){
    //无请求数据

    let output

    let sql='select * from wm_index_carousel'
    pool.query(sql,function(err,result){
        if(err)throw err
        output=result
        res.json(output)
    })
})

/**
 * 1.7 首页商品内容
 */
server.get('/index/product',function(req,res){
    //无请求数据

    let output={
        tv:[],
        computer:[],
        phone:[]
    }
    let loadedCount=0;

    //tv栏信息
    let sql1='select * from wm_index_product where sort="tv" order by recommended limit 8'
    pool.query(sql1,function(err,result){
        if(err)throw err
        output.tv=result
        loadedCount++
        if(loadedCount==3){
            res.json(output);
        }
    })

     //computer栏信息
     let sql2='select * from wm_index_product where sort="computer" order by recommended limit 8'
     pool.query(sql2,function(err,result){
         if(err)throw err
         output.computer=result
         loadedCount++
         if(loadedCount==3){
             res.json(output);
         }
     })

      //phone栏信息
    let sql3='select * from wm_index_product where sort="phone" order by recommended limit 8'
    pool.query(sql3,function(err,result){
        if(err)throw err
        output.phone=result
        loadedCount++
        if(loadedCount==3){
            res.json(output);
        }
    })

})



/***
 * 用户模块
 */

/*
*  2.1 用户中心数据
*/
server.get('/user', function (req, res) {
    //读取客户端请求消息传来的请求数据 uid
    let uid = req.query.uid
    if (!uid) {//处理客户端未提交uid的情形
        //把JS数据转换为JSON格式字符串，并发送给客户端
        res.json({})
        return
    }
    //向数据库查询指定uid的用户记录
    let sql = 'SELECT uid,uname,email,phone,avatar,user_name,gender FROM wm_user WHERE uid=?'
    pool.query(sql, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户记录
            res.json(result[0])
        } else {      //根据uid没有查询到用户记录
            res.json({})
        }

    })

})

/**
 * 2.2 修改用户信息
 */
server.post('/user/update', function (req, res) {
    //读取客户端提交的请求数据
    console.log('BODY:', req.body)
    let uid = req.body.uid
    let un = req.body.uname
    let u_n = req.body.user_name
    // let up = req.body.upwd
    let e = req.body.email
    let p = req.body.phone
    let g = req.body.gender

    if (!uid) {
        res.json({ code: 401, msg: 'uid required' })
        return
    }
    if (!un) {
        res.json({ code: 402, msg: 'uname required' })
        return
    }
    if (!u_n) {
        res.json({ code: 403, msg: 'user_name required' })
        return
    }
    if (!e) {
        res.json({ code: 404, msg: 'email required' })
        return
    }
    if (!p) {
        res.json({ code: 405, msg: 'phone required' })
        return
    }
    if (!g) {
        res.json({ code: 406, msg: 'gender required' })
        return
    }

    //执行数据库操作——UPDATE
    let sql = 'UPDATE wm_user SET uname=?, user_name=?, email=?, phone=?, gender=? WHERE uid=?'
    pool.query(sql, [un, u_n, e, p, g, uid], function (err, result) {
        if (err) throw err
        //向客户端输出相应消息——返回数据中附加了更新的用户编号
        res.json({ code: 200, msg: "update succ", uid: result })
    })
})

/**
 * 2.3 修改用户密码
 */
server.post('/user/changePwd', function (req, res) {
    //读取客户端提交的请求数据
    console.log('BODY:', req.body)
    let uid = req.body.uid
    let up = req.body.upwd
    let newPwd = req.body.newPwd

    if (!uid) {
        res.json({ code: 401, msg: 'uid required' })
        return
    }
    if (!up) {
        res.json({ code: 402, msg: 'upwd required' })
        return
    }
    if (!newPwd) {
        res.json({ code: 402, msg: 'newPwd required' })
        return
    }

    //执行数据库操作检查原密码是否正确——SELECT
    let sql1 = 'SELECT upwd FROM wm_user WHERE uid=?'
    pool.query(sql1, [uid], function (err, result) {
        if (err) throw err;
        if (result[0].upwd != up) {
            res.json({ code: 500, msg: "pwd mistake", pwd: result })
            return
        } else {
            //执行数据库操作更新密码——UPDATE
            let sql2 = 'UPDATE wm_user SET upwd=? WHERE uid=?'
            pool.query(sql2, [newPwd, uid], function (err, result) {
                if (err) throw err;
                //向客户端输出相应消息——返回数据中附加了更新的用户编号
                res.json({ code: 200, msg: "update succ", uid: result })
            })
        }
    })

})

/*
*  2.4 用户消息通知数据
*/
server.get('/news', function (req, res) {
    //读取客户端请求消息传来的请求数据 uid
    let uid = req.query.uid
    if (!uid) {//处理客户端未提交uid的情形
        //把JS数据转换为JSON格式字符串，并发送给客户端
        res.json({})
        return
    }

    let output = {
        newsItems: [],
        newsLogisticsItems: [],
        newsPreferentialItems: []
    }
    let findCount = 0

    //向数据库查询指定uid的用户消息记录
    let sql1 = 'SELECT newId,uid,newTitle,newImg,newDescription,newTime,newSource,newType FROM wm_news WHERE uid=?'
    pool.query(sql1, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户消息记录
            output.newsItems = result
        } else {      //根据uid没有查询到用户消息记录
            output.newsItems = {}
        }
        findCount++
        if (findCount === 3) {
            res.json(output)
        }
    })
    //向数据库查询指定uid的用户物流消息记录
    let sql2 = 'SELECT newId,uid,newTitle,newImg,newDescription,newTime,newSource,newType FROM wm_news WHERE uid=? and newType!=1'
    pool.query(sql2, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户消息记录
            output.newsLogisticsItems = result
        } else {      //根据uid没有查询到用户消息记录
            output.newsLogisticsItems = {}
        }
        findCount++
        if (findCount === 3) {
            res.json(output)
        }
    })
    //向数据库查询指定uid的用户优惠消息记录
    let sql3 = 'SELECT newId,uid,newTitle,newImg,newDescription,newTime,newSource,newType FROM wm_news WHERE uid=? and newType=1'
    pool.query(sql3, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户消息记录
            output.newsPreferentialItems = result
        } else {      //根据uid没有查询到用户消息记录
            output.newsPreferentialItems = {}
        }
        findCount++
        if (findCount === 3) {
            res.json(output)
        }
    })

})

/*
*  2.5 统计用户订单情况
*/
server.get('/userOrderCount', function (req, res) {
    //读取客户端请求消息传来的请求数据 uid
    let uid = req.query.uid
    if (!uid) {//处理客户端未提交uid的情形
        //把JS数据转换为JSON格式字符串，并发送给客户端
        res.json({})
        return
    }

    let output = {
        unpaidCount: 0,
        undeliveredCount: 0,
        unevaluatedCount: 0
    }
    let Count = 0
    //向数据库查询指定uid的用户订单未支付记录
    let sql1 = 'SELECT COUNT(oid) AS COUNT1 FROM wm_order WHERE user_id=?and status=1'
    pool.query(sql1, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户消息记录
            output.unpaidCount = result
        } else {      //根据uid没有查询到用户消息记录
            output.unpaidCount = {}
        }
        Count++
        if (Count === 3) {
            res.json(output)
        }
    })
    //向数据库查询指定uid的用户订单待收货记录
    let sql2 = 'SELECT COUNT(oid) AS COUNT2 FROM wm_order WHERE user_id=?and status=2'
    pool.query(sql2, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户消息记录
            output.undeliveredCount = result
        } else {      //根据uid没有查询到用户消息记录
            output.undeliveredCount = {}
        }
        Count++
        if (Count === 3) {
            res.json(output)
        }
    })
    //向数据库查询指定uid的用户订单已收货记录
    let sql3 = 'SELECT COUNT(oid) AS COUNT3 FROM wm_order WHERE user_id=?and status=3'
    pool.query(sql3, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户消息记录
            output.unevaluatedCount = result
        } else {      //根据uid没有查询到用户消息记录
            output.unevaluatedCount = {}
        }
        Count++
        if (Count === 3) {
            res.json(output)
        }
    })

})

/*
*  2.6 查询用户收货地址
*/
server.get('/user/showAddress', function (req, res) {
    //读取客户端请求消息传来的请求数据 uid
    let uid = req.query.uid
    if (!uid) {//处理客户端未提交uid的情形
        //把JS数据转换为JSON格式字符串，并发送给客户端
        res.json({})
        return
    }

    //向数据库查询指定uid的用户地址记录
    let sql = 'SELECT addressid,receiver,phone,area,address,address_default FROM wm_useraddress WHERE uid=?'
    pool.query(sql, [uid], function (err, result) {
        if (err) throw err;
        //查询到的数据发送给客户端
        if (result.length > 0) {    //根据uid查询到了用户记录
            res.json(result)
        } else {      //根据uid没有查询到用户记录
            res.json({})
        }
    })

})

/*
*  2.7 添加用户收货地址
*/
server.post('/user/addAddress', function (req, res) {
    //读取客户端提交的请求数据
    console.log('BODY:', req.body)
    let uid = req.body.uid
    let receiver = req.body.receiver
    let phone = req.body.phone
    let area = req.body.area
    let address = req.body.address
    let address_default = req.body.address_default

    if (!uid) {
        res.json({ code: 401, msg: 'uid required' })
        return
    }
    if (!receiver) {
        res.json({ code: 402, msg: 'receiver required' })
        return
    }
    if (!phone) {
        res.json({ code: 403, msg: 'phone required' })
        return
    }
    if (!area) {
        res.json({ code: 404, msg: 'area required' })
        return
    }
    if (!address) {
        res.json({ code: 404, msg: 'address required' })
        return
    }
    if (!address_default) {
        res.json({ code: 404, msg: 'address_default required' })
        return
    }


    if (address_default == 1) {
        //清空该用户的默认地址
        let sql1 = 'UPDATE wm_userAddress SET address_default=0 WHERE uid=?'
        pool.query(sql1, [uid, receiver, phone, area, address, address_default], function (err, result) {
            if (err) throw err
            //执行数据库操作——INSERT
            let sql2 = 'INSERT INTO wm_userAddress(addressid, uid, receiver, phone, area, address,address_default) VALUES(NULL, ?, ?, ?, ?, ?, ?)'
            pool.query(sql2, [uid, receiver, phone, area, address, address_default], function (err, result) {
                if (err) throw err
                //向客户端输出相应消息——返回数据中附加了新增的用户自增编号
                res.json({ code: 200, msg: "addAddress succ", uid: result.insertId })
            })
        })
    } else {
        //执行数据库操作——INSERT
        let sql2 = 'INSERT INTO wm_userAddress(addressid, uid, receiver, phone, area, address,address_default) VALUES(NULL, ?, ?, ?, ?, ?, ?)'
        pool.query(sql2, [uid, receiver, phone, area, address, address_default], function (err, result) {
            if (err) throw err
            //向客户端输出相应消息——返回数据中附加了新增的用户自增编号
            res.json({ code: 200, msg: "addAddress succ", uid: result.insertId })
        })
    }
})

/*
*  2.8 删除用户收货地址
*/
server.post('/user/deleteAddress', function (req, res) {
    //读取客户端提交的请求数据
    console.log('BODY:', req.body)
    let addressid = req.body.addressid
    if (!addressid) {
        res.json({ code: 401, msg: 'addressid required' })
        return
    }
    let sql = 'DELETE FROM wm_userAddress WHERE addressid=?'
    pool.query(sql, [addressid], function (err, result) {
        if (err) throw err
        //向客户端输出相应消息——返回数据中附加了删除的用户地址自增编号
        res.json({ code: 200, msg: "deleteAddress succ", uid: result.deleteId })
    })

})
/** 
 * 2.9 用户登录
 */
server.post('/user/login',function(req,res){
    
    //读取客户端提交的请求数据
    let n = req.body.uname
    let w = req.body.upwd
    if(!n){
        res.json( {code:401,msg:'用户名不能为空'} )
        return
    }
    if(!w){
        res.json( {code:402,msg:'密码不能为空'} )
        return
    }
    //向数据库查询该uname和upwd是否配对
    let sql = 'SELECT uid FROM wm_user WHERE uname=? AND upwd=?'
    pool.query(sql,[n,w],function(err,result){
        if(err) throw err
        if(result.length>0){
            let id = result[0].uid
            //  res.setHeader("uname", [req.session.uname]);
            res.json({uid:id,code:200,msg:'login succ'})
            // res.send(req.session.uname)
            return
        }else{
            res.json({code:403,msg:'用户名或密码不存在'})
            console.log('登录失败')
            return
        }
    })
})

/** 
 * 2.10 查找用户名
 */
server.get('/user/uname',function(req,res){
    let id=req.query.uid
    if(!id){
        res.json({code:350,msg:'uid required'})
        return
    }
    let sql = 'SELECT uname FROM wm_user WHERE uid=?'
    pool.query(sql,id,function(err,result){
        if(err) throw err
        if(result.length>0){
            let uname = result[0].uname
            res.json({code:351,msg:'uname founded',uname:uname})
            return
        }else{
            res.json({code:352,msg:'uname unfounded'})
            return
        }
    })
})

/** 
 * 2.11 用户注册
 */
server.post('/user/register',function(req,res){
    //读取客户端提交的请求数据
    let n = req.body.uname
    let w = req.body.upwd
    let rw= req.body.rupwd
    let m = req.body.email
    let p = req.body.phone

    if(!n){
        res.json( {code:401,msg:'用户名不能为空'} )
        return
    }
    if(!w){
        res.json( {code:402,msg:'密码不能为空'} )
        return
    }
    if(!rw){
        res.json( {code:403,msg:'重复输入密码不能为空'} )
        return
    }
    if(!m){
        res.json( {code:404,msg:'邮箱不能为空'} )
        return
    }
    if(!p){
        res.json( {code:405,msg:'手机号码不能为空'} )
        return
    }

    if(w!=rw){
        res.json( {code:406,msg:'两次输入的密码不一致'} )
        return
    }

    if(n.length<3 && n.length>12){
        res.json({code:407,msg:'用户名长度应为3-12位！'})
    }
    if(w.length<6 && w.length>15 && rw.length<6 && rw.length>15){
        res.json({code:408,msg:'密码长度应为6-15位！'})
    }
  
    //执行数据库操作——SELECT
    let sql1 = 'SELECT uid FROM wm_user WHERE uname=? OR email=? OR phone=?'
    pool.query(sql1,[n,m,p],function(err,result){
        if(err) throw err
        //向客户端输出响应消息——返回数据中附加了新增的用户自增编号
        if(result.length>0){
            res.json({code:500,msg:'用户名|手机号|邮箱已存在'})
            return
        }
        //执行数据库操作——INSERT
        let sql2 = 'INSERT INTO wm_user(uname,upwd,email,phone) VALUES(?,?,?,?)'
         pool.query(sql2,[n,w,m,p],function(err,result){
            if(err) throw err
            //向客户端输出响应消息——返回数据中附加了新增的用户自增编号
            res.json({code:200,msg:'register succ',uid:result.insertId})
        })
    })
    

})     



/**
 * 购物车模块
 */

/**
 * 3.1 添加购物车购买项
 */
server.get('/cart/item/add', function (req, res) {
    //获取登录用户信息
    let uid = req.query.uid
    //接收客户端提交的请求数据
    let pid = req.query.pid
    let buycount = req.query.buyCount*1
    if (!pid) {
        res.json({})
        return
    }
    if (!buycount) {
        res.json({})
        return
    }
    //修改数据库
    let sql = 'SELECT * FROM wm_shopping_cart WHERE uid=? AND pid=?'   //遍历购物车表，判断商品是否已经加入购物车
    pool.query(sql, [uid, pid], function (err, result) {
        if (err) throw err   //连接失败
        if (result.length > 0) {   //找到结果，商品已经加入购物车,修改商品的购买储量
            let sql1 = 'UPDATE wm_shopping_cart SET count=? WHERE uid=? AND pid=?'
            pool.query(sql1, [result[0].count + buycount, uid, pid], function (err, result) {
                if (err) throw err
                if (result.affectedRows) {
                    res.json({ code: 200, msg: 'add succ' })
                }
            })
        } else {
            //向数据库插入新的商品购买车行
            let sql2 = 'INSERT INTO wm_shopping_cart VALUES(null, ?, ?, ?, ?)'
            pool.query(sql2, [uid, pid, buycount, true], function (err, result) {
                if (err) throw err
                if (result.affectedRows) {
                    res.json({ code: 200, msg: 'add succ' })
                }
            })
        }
    })
})

/** 
 * 3.2 购物车列表
 */
server.get('/cart/item/list', function (req, res) {
    let async = require('async');
    //获取登录用户信息
    let uid = req.query.uid
    // console.log('uid:'+uid)
    console.log(uid)
    //查询数据库
    let sql = 'SELECT * FROM wm_shopping_cart WHERE uid=?'
    pool.query(sql, [uid], function (err, result) {
        if (err) throw err
        if (result.length > 0) {
            let sql2 = 'SELECT title,price,photo_id,sm FROM wm_product, wm_product_pic WHERE wm_product.pid=wm_product_pic.product_id AND pid=?'
            async.map(result, function (item, callback) {
                pool.query(sql2, item.pid, function (err, results) {
                    if (err) throw err
                    item.title = results[0].title
                    item.price = results[0].price
                    item.photo_id = results[0].photo_id
                    item.sm = results[0].sm
                    callback(null, item)
                })
            }, function (err, results) {
                res.json(results)
            })
        } else if (result.length === 0) {
            res.json({})
        }
    })
})

/**
 * 3.3 删除购物车项
 */
server.get('/cart/item/delete', function (req, res) {
    //获取登录用户信息
    let uid = req.query.uid
    //接受客户端发送的删除购物车项信息
    let cid = req.query.cid
    //执行数据库操作
    let sql = 'DELETE FROM wm_shopping_cart WHERE uid=? AND cid=?'
    pool.query(sql, [uid, cid], function (err, result) {
        if (err) throw err
        if (result.affectedRows) { //如果删除的行数不为0，则删除成功
            // res.json(result)
            res.json({ code: 200, msg: 'delete succ', result: result })
        } else {
            res.json({ code: 501, msg: 'delete failed' })
        }
    })
})

/**
 * 3.4 修改购物车条目中的购买数量
 */
server.get('/cart/item/updatacount', function (req, res) {
    //获取登录用户信息
    let uid = req.query.uid
    //接受客户端发送的信息
    let cid = req.query.cid
    let count = req.query.count
    //执行数据库操作
    let sql = 'UPDATE wm_shopping_cart SET count=? WHERE uid=? AND cid=?'
    pool.query(sql, [count, uid, cid], function (err, result) {
        if (err) throw err
        if (result.affectedRows) {  //如果受影响的行数不为0，则删除成功
            res.json({ code: 200, msg: 'update succ' })
        }
        else {
            res.json({ code: 501, msg: 'shopping cart non-exists' })
        }
    })
})

/**
 * 3.5 修改购物车条目是否勾选
 */
server.get('/cart/item/checked', function (req, res) {
    //获取登录用户信息
    let uid = req.query.uid
    //接受客户端发送的信息
    let cid = req.query.cid
    let checked = req.query.checked
    //执行数据库操作
    let sql = 'UPDATE wm_shopping_cart SET checked=? WHERE uid=? AND cid=?'
    pool.query(sql, [checked, uid, cid], function (err, result) {
        if (err) throw err
        if (result.affectedRows) {
            res.json({ code: 200, msg: 'select succ' })
        } else {
            res.json({ code: 501, msg: 'shopping cart empty' })
        }
    })
})

/**
 * 3.6 修改购物车条目是否全部勾选
 */
server.get('/cart/item/checkall', function(req, res){
    //获取登录用户信息
    let uid = req.query.uid
    //接受客户端发送的信息
    let checked = req.query.checked
    //执行数据库操作
    let sql = 'UPDATE wm_shopping_cart SET checked=? WHERE uid=?'
    pool.query(sql, [checked, uid], function (err, result) {
        if (err) throw err
        if (result.affectedRows) {
            res.json({ code: 200, msg: 'select succ' })
        } else {
            res.json({ code: 501, msg: 'shopping cart non-exists' })
        }
    })
})

/**
 * 3.7 购物车商品列
 */
server.get('/pay/goodlist', function (req, res) {
    let async = require('async');
    //获取登录用户信息
    let uid = req.query.uid
    let sql = 'SELECT * FROM wm_shopping_cart WHERE uid=? AND checked=?'
    pool.query(sql, [uid, true], function (err, result) {
        if (err) throw err
        if (result.length > 0) {
            let sql2 = 'SELECT title,price,photo_id,md FROM wm_product, wm_product_pic WHERE wm_product.pid=wm_product_pic.product_id AND pid=?'
            //循环获取商品信息
            async.map(result, function (item, callback) {
                pool.query(sql2, item.pid, function (err, results) {
                    if (err) throw err
                    item.title = results[0].title
                    item.price = results[0].price
                    item.photo_id = results[0].photo_id
                    item.md = results[0].md
                    callback(null, item)
                })
            }, function (err, results) {
                res.json(results)
            })
        }
    })
})

/**
 * 3.8 购物车商品（立即购买按钮触发 单个商品 非购物车）
 */
server.get('/pay/a_good',function(req,res){
    //获取请求数据pid
    let pid = req.query.pid
    if(!pid){
        return;
    }
    let output={}
    //查询数据库
    let sql = 'select pid,title,md,price from wm_product as A,wm_product_pic as B WHERE A.pid=B.product_id AND pid=?'
        pool.query(sql,[pid],function(err,result){
            if(err)throw err
            if(result.length>0)
            {
                output = result[0]
                res.json(output)
            }else{
                res.json({code:404,msg:'not Found'})
            }
        })
})



/**
 * 订单模块
 */
/**
 * 4.1 订单中心状态切换
 */
server.get('/order',function(req,res){
    let status=req.query.status//订单状态
    let uid=req.query.id//用户id
    let output

    if(status==null){
        let sql='Select distinct order_id,title,sm,price,count,status from wm_order_detail,wm_order where order_id=oid order by order_id desc'
    pool.query(sql,[uid],function(err,result){
        if(err)throw err

        output = result
        res.json(output)
    })
    }else{
        let sql='Select order_id,title,sm,price,count from wm_order_detail where order_id in (select oid from wm_order where user_id=? and status=?) order by order_id desc'
        pool.query(sql,[uid,status],function(err,result){
            if(err)throw err
    
            output = result
            res.json(output)
        })
    }
 
})

/**
 * 4.2 待付款状态下进行付款
 */
server.post('/order/pay',function(req,res){
    let money=req.query.money//付款金额
    let status=req.query.status//是否确认付款,0为未付款，1为付款
    let oid=req.query.oid
    

    let output

    if(status==0){
        res.json({code:501,msg:'no pay'})
        return
    }

    let sql='update wm_order set status = "2" where oid = ?'//修改订单表状态
    pool(sql,[id],function(err,result){
        if(err)throw err

        res.json({code:200,msg:'pay success'})
    })
})

/**
 * 4.3 待收货状态下收货
 */
server.get('/order/successget',function(req,res){
    let oid=req.query.oid

    let sql='update wm_order set status = "3" where oid = ?'//修改订单表状态
    pool(sql,[oid],function(err,result){
        if(err)throw err
        
        res.json({code:200,msg:'get success'})
    })
})
/**
 * 4.4 添加订单购买项、删除相应的购物车购买项
 */
server.post('/pay/submitorder', function (req, res) {
    let async = require('async')
    //接收订单信息
    let uid = req.body.uid
    let status = req.body.status
	let addressid = req.body.addressid
    let pidlist = req.body.pidlist
    let countlist = req.body.countlist
    let titlelist = req.body.titlelist
    let pricelist = req.body.pricelist
    let pl = req.body.pl   //商品列表长度

    //新生成的订单id
    let oid
    let piclist = []

    console.log("pidlist:"+pidlist)
    console.log("countlist:"+countlist)
    console.log("titlelist:"+titlelist)
    console.log("pricelist:"+pricelist)
	
    //执行数据库
    let sql = 'INSERT INTO wm_order(oid, user_id, status, address_id) VALUES(null, ?, ?, ?)'
    let sql2 = 'SELECT sm FROM wm_product_pic WHERE product_id=?'
    let sql3 = 'INSERT INTO wm_order_detail VALUES(null, ?, ?, ?, ?, ?, ?)'
    let sql_delete = 'DELETE FROM wm_shopping_cart WHERE uid=? AND pid=?'
    //订单中心表生成新的订单行，获取新插入的oid
    pool.query(sql, [uid, status, addressid], function (err, result) {
        if (err) throw err
        if (result.affectedRows) {
            oid = result.insertId
        }
    })

    //定义索引数组:用于作为async.each的参数，将订单的商品信息逐个插入到订单详情表中
    let list = []
    for (let i = 0; i < pl; i++) {
        list[i] = i
    }

    //根据pidlist获得商品相应的图片集（piclist）
    async.map(pidlist, function (item, callback) {
        pool.query(sql2, item, function (err, result) {
            if (err) throw err
            if (result.length > 0) {
                pic = result[0]
                callback(null, pic)  //pic回调给回调函数的results
            }
        })
    }, function (err, results) {    //回调函数：获得图片集后回调执行之后的数据库操作
        piclist = results    //图片集
        //根据索引数组list，将商品信息逐个插入到订单详情表中
        async.each(list, function (item, callback) {
            pool.query(sql3, [oid, pidlist[item], countlist[item], pricelist[item], titlelist[item], piclist[item]], function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    console.log((item+1) + "行执行成功")
                    callback()
                }
            })
        }, function (err) {   //回调函数：订单详情表数据插入完成后回调执行之后的数据库操作
            if (err) console.log(err)
            else {
                //数据库操作：将下单了的商品从购物车表中删除
                async.each(pidlist, function (item, callback) {
                    pool.query(sql_delete, [uid, item], function (err, result) {
                        if (err) callback(err)
                        else {
                            console.log("购物车("+uid+"):pid"+item + "删除成功")
                            callback()
                        }
                    })
                }, function (err) {  //回调函数：购物车表以下单商品项的全部删除后回调，数据库执行结束
                    if (err) console.log(err)
                    console.log("全部删除完成")
                    res.json({code: 200, msg: "create new order!"})
                })
            }
        })
    })
})