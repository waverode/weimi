SET NAMES UTF8;
DROP DATABASE IF EXISTS wm;
CREATE DATABASE wm CHARSET=UTF8;
USE wm;

-- 商品型号表
CREATE TABLE wm_product_family(
    fid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32)
);

-- 商品表
CREATE TABLE wm_product(
    pid INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT,
    title VARCHAR(128),
    subtitle VARCHAR(128),
    price DECIMAL(10,2),             
    spec VARCHAR(64),           
    color VARCHAR(64),
    name VARCHAR(32),          
    os VARCHAR(32),             
    memory VARCHAR(32),         
    resolution VARCHAR(32),   
    category VARCHAR(32),              
    details VARCHAR(1024),     

    shelf_time BIGINT,          
    sold_count INT,             
    is_onsale BOOLEAN           
);

-- 商品详情图表         
CREATE TABLE wm_product_pic(
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,              
    sm VARCHAR(128),           
    md VARCHAR(128),           
    lg VARCHAR(128),
    introduce VARCHAR(128)         

);
/**用户信息**/
CREATE TABLE wm_user(
  uid INT PRIMARY KEY AUTO_INCREMENT,
  uname VARCHAR(32),
  upwd VARCHAR(32),
  email VARCHAR(64),
  phone VARCHAR(16),

  avatar VARCHAR(128),        #头像图片路径
  user_name VARCHAR(32),      #用户名，如王小明
  gender INT                  #性别  0-女  1-男
);


/**购物车条目**/
CREATE TABLE wm_shopping_cart(
  cid INT PRIMARY KEY AUTO_INCREMENT,
  uid INT,      #用户编号
  pid INT,   #商品编号
  count INT,        #购买数量
  checked BOOLEAN #是否已勾选，确定购买
);

/**消息通知表**/
CREATE TABLE wm_news(
  newid INT PRIMARY KEY AUTO_INCREMENT,	#消息编号
  uid INT,		#用户编号
  newTitle VARCHAR(32),	#消息标题
  newImg  VARCHAR(256),	#消息图片
  newDescription VARCHAR(256),	#消息描述
  newTime VARCHAR(64),		#消息时间
  newSource VARCHAR(256),	#消息来源
  newType INT		#消息类型  1-优惠消息 2-订单运输中 3-订单待签收 4-订单已签收 5-其他
);

/**用户地址信息表**/
CREATE TABLE wm_userAddress(
  addressid INT PRIMARY KEY AUTO_INCREMENT,	#地址编号
  uid INT,
  receiver VARCHAR(32),
  phone VARCHAR(16),
  area VARCHAR(32),
  address VARCHAR(128),
  address_default INT
);

/**订单表**/
CREATE TABLE wm_order(
  oid INT PRIMARY KEY AUTO_INCREMENT,	#消息编号
  user_id INT,
  status INT,
  address_id INT
);


/*首页轮播表*/
CREATE TABLE wm_index_carousel(
    cid int primary key  AUTO_INCREMENT,
    img varchar(128),
    title varchar(64),
    href varchar(128)
);

/*首页商品表*/
create table wm_index_product(
    pid int primary key AUTO_INCREMENT,
    title varchar(64),
    detail varchar(128),
    price decimal(10,2),
    img varchar(128),
    href varchar(128),
    sort varchar(16),
    recommended tinyint
);

/*订单商品详情表*/
create table wm_order_detail(
    did int primary key AUTO_INCREMENT,
    order_id int,
    product_id int,
    count int,
    price decimal(10,2),
    title varchar(128),
    sm varchar(256)
);
/*******************/
/******数据导入******/
/*******************/

-- 商品型号表
INSERT INTO wm_product_family VALUES
(NULL,'小米9'),
(NULL,'小米Air'),
(NULL,'小米电视5'),
(NULL,'红米note8'),
(NULL,'红米8'),
(NULL,'小米Mix2s'),
(NULL,'小米8'),
(NULL,'小米7'),
(NULL,'小米CC'),
(NULL,'小米note5');

-- 商品表
INSERT INTO wm_product VALUES
(1,1,"小米9 骁龙855 游戏手机 幻彩紫 全网通(8G+128G)","全曲面轻薄设计，全息幻彩玻璃机身 / 骁龙855旗舰处理器 / 20W无线闪充，标配27W有线快充 / 索尼4800万超广角微距三摄 / 极速屏下指纹解锁 / 多功能NFC",2398,"8G+128G","幻彩紫","小米9 幻彩紫","Andorid","8GB","157.5 X 74.67","phone","小米9牛逼",1000,100,true),
(2,1,"小米9 骁龙855 游戏手机 幻彩紫 全网通(8G+256G)","全曲面轻薄设计，全息幻彩玻璃机身 / 骁龙855旗舰处理器 / 20W无线闪充，标配27W有线快充 / 索尼4800万超广角微距三摄 / 极速屏下指纹解锁 / 多功能NFC",2498,"8G+256G","幻彩紫","小米9 幻彩紫 pro","Andorid","8GB","157.5 X 74.67","phone","小米9牛逼",1000,100,true),
(3,1,"小米9 骁龙855 游戏手机 幻彩蓝 全网通(8G+128G)","全曲面轻薄设计，全息幻彩玻璃机身 / 骁龙855旗舰处理器 / 20W无线闪充，标配27W有线快充 / 索尼4800万超广角微距三摄 / 极速屏下指纹解锁 / 多功能NFC",2699,"8G+128G","幻彩蓝","小米9 幻彩蓝","Andorid","8GB","157.5 X 74.67","phone","小米9牛逼",1000,100,true),
(4,1,"小米9 骁龙855 游戏手机 幻彩蓝 全网通(8G+256G)","全曲面轻薄设计，全息幻彩玻璃机身 / 骁龙855旗舰处理器 / 20W无线闪充，标配27W有线快充 / 索尼4800万超广角微距三摄 / 极速屏下指纹解锁 / 多功能NFC",2999,"8G+256G","幻彩蓝","小米9 幻彩蓝 pro","Andorid","8GB","157.5 X 74.67","phone","小米9牛逼",1000,100,true),

(5,2,"小米笔记本Air 12.5  2019款","全高清屏幕 / 长续航全金属 / 超窄边框 / 像杂志一样随身携带 / 哈曼高品质扬声器",3599,"m4 4G 256G SSD","银色","小米笔记本Air 12.5 乞丐版","预装 Windows 10 家庭版","4GB","12.5","computer","小米笔记本Air 12.5 集成显卡 更轻更薄，像杂志一样随身携带 续航更持久，无风扇安静运行。胜任学习、移动办公。配备m3处理器",100000,100,true),
(6,2,"小米笔记本Air 12.5  2019款","全高清屏幕 / 长续航全金属 / 超窄边框 / 像杂志一样随身携带 / 哈曼高品质扬声器",3999,"i5 4G 256G SSD","银色","小米笔记本Air 12.5 正常版","预装 Windows 10 家庭版","4GB","12.5","computer","小米笔记本Air 12.5 集成显卡 更轻更薄，像杂志一样随身携带 续航更持久，无风扇安静运行。胜任学习、移动办公。配备m3处理器",100000,100,true),
(7,2,"小米笔记本Air 13.3  2019款","轻薄全金属机身 / MX250独立显卡 / 9.5小时超长续航 / FHD全高清屏幕 / 指纹解锁 / 兼顾办公娱乐与轻薄的高性能笔记本",4999,"i5 8G 512G PICe","银色","小米笔记本Air 13.3 i5版","预装 Windows 10 家庭版","8GB","13.3","computer","高性能轻薄笔记本 设计制图、运行大型 3D 游戏，复杂任务也可以轻松驾驭。配置第八代酷睿四核  i5处理器",100000,100,true),
(8,2,"小米笔记本Air 13.3  2019款","轻薄全金属机身 / MX250独立显卡 / 9.5小时超长续航 / FHD全高清屏幕 / 指纹解锁 / 兼顾办公娱乐与轻薄的高性能笔记本",5999,"i7 8G 512G PICe","银色","小米笔记本Air 13.3 i7版","预装 Windows 10 家庭版","8GB","13.3","computer","高性能轻薄笔记本 设计制图、运行大型 3D 游戏，复杂任务也可以轻松驾驭。配置第八代酷睿四核  i7处理器",100000,100,true),

(9,3,"小米电视5 55英寸 4K超高清 全面屏 内置小爱 3+32GB 人工智能网络平板电视 ","4K广色域屏幕 画质细腻若真/时尚全面屏设计/金属机身 尽显简约之美/支持8K视频内容/杜比震撼音效/支持远场语音 一呼即应/3GB+32GB大存储",2999,"55寸","灰色","小米电视5 55寸","PatchWall","3GB","55英寸","tv","一体折弯、喷砂阳极氧化、高亮抛光、压铸等工艺，赋予电视美的质感体现。打造出全面一体、背板无螺钉、薄至5.9mm的纤薄机身，极尽简约之美",100000,100,true),
(10,3,"小米电视5 65英寸 4K超高清 全面屏 内置小爱 3+32GB 人工智能网络平板电视 ","4K广色域屏幕 画质细腻若真/时尚全面屏设计/金属机身 尽显简约之美/支持8K视频内容/杜比震撼音效/支持远场语音 一呼即应/3GB+32GB大存储/海量好内容",3999,"65寸","灰色","小米电视5 65寸","PatchWall","3GB","65英寸","tv","一体折弯、喷砂阳极氧化、高亮抛光、压铸等工艺，赋予电视美的质感体现。打造出全面一体、背板无螺钉、薄至5.9mm的纤薄机身，极尽简约之美",100000,100,true),
(11,3,"小米电视5 75英寸 4K超高清 全面屏 内置小爱 3+32GB 人工智能网络平板电视 ","全面屏设计 / 金属机身 / 4K广色域屏幕 /纤薄机身 / 内置小爱同学 / 3GB+32GB大存储 / 支持8K视频内容",7999,"75寸","灰色","小米电视5 75寸","PatchWall","3GB","75英寸","tv","一体折弯、喷砂阳极氧化、高亮抛光、压铸等工艺，赋予电视美的质感体现。打造出全面一体、背板无螺钉、薄至5.9mm的纤薄机身，极尽简约之美",100000,100,true);



-- 商品图片表
INSERT INTO wm_product_pic VALUES
/*小米9 幻彩紫  */
(1,1,"/img/product/mi9_purple/mi9_1_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_1_lg.jpg","/img/product/mi9_purple/mi9_1_introd.jpg"),
(2,1,"/img/product/mi9_purple/mi9_2_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_2_lg.jpg","/img/product/mi9_purple/mi9_2_introd.jpg"),
(3,1,"/img/product/mi9_purple/mi9_3_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_3_lg.jpg","/img/product/mi9_purple/mi9_3_introd.jpg"),
(4,1,"/img/product/mi9_purple/mi9_4_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_4_lg.jpg","/img/product/mi9_purple/mi9_4_introd.jpg"),
(5,1,"/img/product/mi9_purple/mi9_5_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_5_lg.jpg","/img/product/mi9_purple/mi9_5_introd.jpg"),
(6,2,"/img/product/mi9_purple/mi9_1_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_1_lg.jpg","/img/product/mi9_purple/mi9_1_introd.jpg"),
(7,2,"/img/product/mi9_purple/mi9_2_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_2_lg.jpg","/img/product/mi9_purple/mi9_2_introd.jpg"),
(8,2,"/img/product/mi9_purple/mi9_3_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_3_lg.jpg","/img/product/mi9_purple/mi9_3_introd.jpg"),
(9,2,"/img/product/mi9_purple/mi9_4_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_4_lg.jpg","/img/product/mi9_purple/mi9_4_introd.jpg"),
(10,2,"/img/product/mi9_purple/mi9_5_sm.jpg","/img/product/mi9_purple/mi9_1_md.jpg","/img/product/mi9_purple/mi9_5_lg.jpg","/img/product/mi9_purple/mi9_5_introd.jpg"),
/*小米9 幻彩蓝  */
(11,3,"/img/product/mi9_blue/mi9_1_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_1_lg.jpg","/img/product/mi9_purple/mi9_1_introd.jpg"),
(12,3,"/img/product/mi9_blue/mi9_2_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_2_lg.jpg","/img/product/mi9_purple/mi9_2_introd.jpg"),
(13,3,"/img/product/mi9_blue/mi9_3_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_3_lg.jpg","/img/product/mi9_purple/mi9_3_introd.jpg"),
(14,3,"/img/product/mi9_blue/mi9_4_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_4_lg.jpg","/img/product/mi9_purple/mi9_4_introd.jpg"),
(15,3,"/img/product/mi9_blue/mi9_5_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_5_lg.jpg","/img/product/mi9_purple/mi9_5_introd.jpg"),
(16,4,"/img/product/mi9_blue/mi9_1_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_1_lg.jpg","/img/product/mi9_purple/mi9_1_introd.jpg"),
(17,4,"/img/product/mi9_blue/mi9_2_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_2_lg.jpg","/img/product/mi9_purple/mi9_2_introd.jpg"),
(18,4,"/img/product/mi9_blue/mi9_3_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_3_lg.jpg","/img/product/mi9_purple/mi9_3_introd.jpg"),
(19,4,"/img/product/mi9_blue/mi9_4_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_4_lg.jpg","/img/product/mi9_purple/mi9_4_introd.jpg"),
(20,4,"/img/product/mi9_blue/mi9_5_sm.jpg","/img/product/mi9_blue/mi9_1_md.jpg","/img/product/mi9_blue/mi9_5_lg.jpg","/img/product/mi9_purple/mi9_5_introd.jpg"),
/*小米笔记本Air 12.5  2019款  */
(21,5,"/img/product/Air12.5/Air12.5_1_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_1_lg.jpg","/img/product/Air12.5/Air12.5_1_introd.jpg"),
(22,5,"/img/product/Air12.5/Air12.5_2_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_2_lg.jpg","/img/product/Air12.5/Air12.5_2_introd.jpg"),
(23,5,"/img/product/Air12.5/Air12.5_3_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_3_lg.jpg","/img/product/Air12.5/Air12.5_3_introd.jpg"),
(25,5,"/img/product/Air12.5/Air12.5_4_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_4_lg.jpg","/img/product/Air12.5/Air12.5_4_introd.jpg"),
(26,5,"/img/product/Air12.5/Air12.5_5_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_5_lg.jpg","/img/product/Air12.5/Air12.5_5_introd.jpg"),
(27,6,"/img/product/Air12.5/Air12.5_1_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_1_lg.jpg","/img/product/Air12.5/Air12.5_1_introd.jpg"),
(28,6,"/img/product/Air12.5/Air12.5_2_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_2_lg.jpg","/img/product/Air12.5/Air12.5_2_introd.jpg"),
(29,6,"/img/product/Air12.5/Air12.5_3_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_3_lg.jpg","/img/product/Air12.5/Air12.5_3_introd.jpg"),
(30,6,"/img/product/Air12.5/Air12.5_4_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_4_lg.jpg","/img/product/Air12.5/Air12.5_4_introd.jpg"),
(31,6,"/img/product/Air12.5/Air12.5_5_sm.jpg","/img/product/Air12.5/Air12.5_1_md.jpg","/img/product/Air12.5/Air12.5_5_lg.jpg","/img/product/Air12.5/Air12.5_5_introd.jpg"),
/*小米笔记本Air 13.3  2019款  */
(32,7,"/img/product/Air13.3/Air13.3_1_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_1_lg.png","/img/product/Air13.3/Air13.3_1_introd.jpg"),
(33,7,"/img/product/Air13.3/Air13.3_2_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_2_lg.jpg","/img/product/Air13.3/Air13.3_2_introd.jpg"),
(34,7,"/img/product/Air13.3/Air13.3_3_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_3_lg.png","/img/product/Air13.3/Air13.3_3_introd.jpg"),
(35,7,"/img/product/Air13.3/Air13.3_4_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_4_lg.png","/img/product/Air13.3/Air13.3_4_introd.jpg"),
(36,7,"/img/product/Air13.3/Air13.3_5_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_5_lg.png","/img/product/Air13.3/Air13.3_5_introd.jpg"),
(37,8,"/img/product/Air13.3/Air13.3_1_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_1_lg.png","/img/product/Air13.3/Air13.3_1_introd.jpg"),
(38,8,"/img/product/Air13.3/Air13.3_2_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_2_lg.jpg","/img/product/Air13.3/Air13.3_2_introd.jpg"),
(39,8,"/img/product/Air13.3/Air13.3_3_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_3_lg.png","/img/product/Air13.3/Air13.3_3_introd.jpg"),
(40,8,"/img/product/Air13.3/Air13.3_4_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_4_lg.png","/img/product/Air13.3/Air13.3_4_introd.jpg"),
(41,8,"/img/product/Air13.3/Air13.3_5_sm.jpg","/img/product/Air13.3/Air13.3_1_md.jpg","/img/product/Air13.3/Air13.3_5_lg.png","/img/product/Air13.3/Air13.3_5_introd.jpg"),
/*小米电视5 55寸  */
(42,9,"/img/product/mitv_55/mitv_1_sm.jpg","/img/product/mitv_55/mitv_1_md.jpg","/img/product/mitv_55/mitv_1_lg.jpg","/img/product/mitv_55/mitv_1_introd.jpg"),
(43,9,"/img/product/mitv_55/mitv_2_sm.jpg","/img/product/mitv_55/mitv_1_md.jpg","/img/product/mitv_55/mitv_2_lg.jpg","/img/product/mitv_55/mitv_2_introd.jpg"),
(44,9,"/img/product/mitv_55/mitv_3_sm.jpg","/img/product/mitv_55/mitv_1_md.jpg","/img/product/mitv_55/mitv_3_lg.jpg","/img/product/mitv_55/mitv_3_introd.jpg"),
/*小米电视5 65寸  */
(45,10,"/img/product/mitv_65/mitv_1_sm.jpg","/img/product/mitv_65/mitv_1_md.jpg","/img/product/mitv_65/mitv_1_lg.jpg","/img/product/mitv_65/mitv_1_introd.jpg"),
(46,10,"/img/product/mitv_65/mitv_2_sm.jpg","/img/product/mitv_65/mitv_1_md.jpg","/img/product/mitv_65/mitv_2_lg.jpg","/img/product/mitv_65/mitv_2_introd.jpg"),
(47,10,"/img/product/mitv_65/mitv_3_sm.jpg","/img/product/mitv_65/mitv_1_md.jpg","/img/product/mitv_65/mitv_3_lg.jpg","/img/product/mitv_65/mitv_3_introd.jpg"),
/*小米电视5 75寸  */
(48,11,"/img/product/mitv_75/mitv_1_sm.jpg","/img/product/mitv_75/mitv_1_md.jpg","/img/product/mitv_75/mitv_1_lg.jpg","/img/product/mitv_75/mitv_1_introd.jpg"),
(49,11,"/img/product/mitv_75/mitv_2_sm.jpg","/img/product/mitv_75/mitv_1_md.jpg","/img/product/mitv_75/mitv_2_lg.jpg","/img/product/mitv_75/mitv_2_introd.jpg"),
(50,11,"/img/product/mitv_75/mitv_3_sm.jpg","/img/product/mitv_75/mitv_1_md.jpg","/img/product/mitv_75/mitv_3_lg.jpg","/img/product/mitv_75/mitv_3_introd.jpg");

/**用户信息**/
INSERT INTO wm_user VALUES
(NULL, 'dingding', '123456', 'ding@qq.com', '13501234567', '/img/avatar/default.png', '丁伟', '1'),
(NULL, 'dangdang', '123456', 'dang@qq.com', '13501234568', '/img/avatar/default.png', '林当', '1'),
(NULL, 'doudou', '123456', 'dou@qq.com', '13501234569', '/img/avatar/default.png', '窦志强', '1'),
(NULL, 'yaya', '123456', 'ya@qq.com', '13501234560', '/img/avatar/default.png', '秦小雅', '0');
/* 购物车数据 */
INSERT INTO wm_shopping_cart VALUE(1,1,1,2,TRUE),(2,1,6,1,FALSE),(3,2,8,1,TRUE);

/**消息通知信息**/
INSERT INTO wm_news VALUES
(NULL, '1', '您的订单已发货', '/img/product/mi9_blue/mi9_1_sm.jpg', '您购买的小米手机已发货', '2019-12-23 00:00:00', '来自订单1234567890', '2'),
(NULL, '1', '您的订单快递员正在派送', '/img/product/mi9_blue/mi9_1_sm.jpg', '您购买的小米手机由快递员林丹是发送中', '2019-12-24 00:00:00', '来自运单0987654321', '3'),
(NULL, '1', '您的订单待取件', '/img/product/mi9_blue/mi9_1_sm.jpg', '您购买的小米手机已到达华南师范大学南海校区菜鸟驿站', '2019-12-25 00:00:00', '来自菜鸟驿站', '4'),
(NULL, '1', '您的订单已签收', '/img/product/mi9_blue/mi9_1_sm.jpg', '您购买的小米手机已签收', '2019-12-25 10:00:00', '运单编号：0987654321', '4'),
(NULL, '1', '双12百货钜惠', '/img/avatar/default.png', '圣诞节黑科技降价啦，疯抢百元大额卷！', '2019-12-11 00:00:00', '来自活动特惠', '1');

/**订单中心表信息**/
INSERT INTO wm_order VALUES
(NULL, '1', '1','12354561825'),
(NULL, '1', '2','12354156532'),
(NULL, '1', '2','12353452352'),
(NULL, '1', '3','12362531823'),
(NULL, '1', '3','12253235282'),
(NULL, '1', '3','12354532528');

/**用户地址表信息**/
INSERT INTO wm_useraddress VALUES
(NULL, '1', '吴彦祖','12345678910','广东佛山市南海区','华南师范大学','0'),
(NULL, '1', '蔡徐坤','12354156532','广东佛山市南海区','华南师范大学','1'),
(NULL, '1', '彭于晏','12353452352','广东佛山市南海区','华南师范大学','0'),
(NULL, '1', '杨幂','12362531823','广东佛山市南海区','华南师范大学','0'),
(NULL, '1', '杨超越','12253235282','广东佛山市南海区','华南师范大学','0'),
(NULL, '1', '沈腾','12354532528','广东佛山市南海区','华南师范大学','0');

/*首页轮播*/
insert into wm_index_carousel(cid,img,title,href)
values(null,'/img/carousel/img1.jpg','手机1','/product/details.html?pid=14'),
(null,'/img/carousel/img2.jpg','手机2','/product/details.html?pid=13'),
(null,'/img/carousel/img3.jpg','手机3','/product/details.html?pid=11');

/*首页商品*/
insert into wm_index_product(pid,title,detail,price,img,href,sort,recommended)
values(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone1.jpg','/product/details.html?pid=1','phone',1),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone2.jpg','/product/details.html?pid=2','phone',2),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone3.jpg','/product/details.html?pid=3','phone',3),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone4.jpg','/product/details.html?pid=4','phone',4),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone5.jpg','/product/details.html?pid=3','phone',5),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone6.jpg','/product/details.html?pid=3','phone',6),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone7.jpg','/product/details.html?pid=3','phone',7),
(null,'Redmi K30','120Hz流速屏',1599,'/img/index_product/phone/phone8.jpg','/product/details.html?pid=3','phone',8),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer1.jpg','/product/details.html?pid=5','computer',1),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer2.jpg','/product/details.html?pid=6','computer',2),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer3.jpg','/product/details.html?pid=7','computer',3),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer4.jpg','/product/details.html?pid=8','computer',4),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer5.jpg','/product/details.html?pid=8','computer',5),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer6.jpg','/product/details.html?pid=6','computer',6),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer7.jpg','/product/details.html?pid=6','computer',7),
(null,'Redmibook 13','让高速性能全部展现',4399,'/img/index_product/computer/computer8.jpg','/product/details.html?pid=7','computer',8),
(null,'Redmi 红米电视 70英寸','全面屏设计 人工智能语音',4399,'/img/index_product/tv/tv1.jpg','/product/details.html?pid=11','tv',1),
(null,'Redmi 红米电视 70英寸','全面屏设计 人工智能语音',4399,'/img/index_product/tv/tv2.jpg','/product/details.html?pid=9','tv',2),
(null,'Redmi 红米电视 70英寸','全面屏设计 人工智能语音',4399,'/img/index_product/tv/tv3.jpg','/product/details.html?pid=9','tv',3),
(null,'Redmi 红米电视 70英寸','全面屏设计 人工智能语音',4399,'/img/index_product/tv/tv4.jpg','/product/details.html?pid=10','tv',4);

/*订单详情*/
insert into wm_order_detail(did,order_id,product_id,count,price,title,sm)
values(null,1,1,3,2699,'小米9 幻彩蓝 乞丐版','/img/product/mi9_blue/mi9_1_sm.jpg'),
(null,2,2,11,7999,'小米电视75寸','/img/product/mitv_75/mitv_1_sm.jpg')