//页面加载完成，异步请求服务器端动态数据
$(window).load(function () {
    //获取登录用户id
    let uid = sessionStorage.getItem('uid')
    // let uid = 1
    if (!uid) {
        $('#checklogin').modal()
        //关闭模态框跳转登录界面
        $('#checklogin').on('hide.bs.modal', function () {
            window.location.href = "#"
        })
    }
    $('#js_user').text(sessionStorage.getItem('uname'))
    //加载下单商品信息
   if(!GetRequest().pid){
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/pay/goodlist',
        data: `uid=${uid}`,
        success: function (data) {
            console.log(data)
            let html = $('.row-good-info').html()
            if (data.length > 0) {
                for (let i in data) {
                    html += `
                        <div class="item-row js_gooditem" id="${data[i].pid}">
                            <div class="row">
                                <div class="col-xs-3 col-sm-2 col-md-1">
                                    <img class="img-responsive" src="${data[i].md}">
                                </div>
                                <div class="col-xs-5 col-sm-6 col-md-5">
                                    <h4 class="box-font goods-name js_goodtitle">${data[i].title}</h4>
                                </div>
                                <div class="col-xs-4 col-sm-4 col-md-3">
                                    <div class="row row-xs-hidden">
                                        <div class="col-xs-12">
                                            <h4 class="box-font">￥<i class="js_price">${data[i].price}</i> × <i class="js_count">${data[i].count}</i></h4>
                                        </div>
                                        <div class="col-xs-12 hidden-md hidden-lg">
                                            <h4 class="box-font total-price">￥<i class="js_totalprices">${data[i].price * data[i].count}</i></h4>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 hidden-xs hidden-sm">
                                    <h4 class="box-font total-price">￥${data[i].price * data[i].count}</h4>
                                </div>
                            </div>
                        </div>
                        `
                }
            }
            $('.row-good-info').html(html)
            counts();
            totalPrice();
            totalpay();
        }
    })
    }else{
        $.ajax({
            method: 'GET',
            url: 'http://127.0.0.1:5050/pay/a_good',
            data: `pid=`+GetRequest().pid,
            success: function (data) {
                let html =  `
                            <div class="item-row js_gooditem" id="${data.pid}">
                                <div class="row">
                                    <div class="col-xs-3 col-sm-2 col-md-1">
                                        <img class="img-responsive" src="${data.md}">
                                    </div>
                                    <div class="col-xs-5 col-sm-6 col-md-5">
                                        <h4 class="box-font goods-name js_goodtitle">${data.title}</h4>
                                    </div>
                                    <div class="col-xs-4 col-sm-4 col-md-3">
                                        <div class="row row-xs-hidden">
                                            <div class="col-xs-12">
                                                <h4 class="box-font">￥<i class="js_price">${data.price}</i> × <i class="js_count">1</i></h4>
                                            </div>
                                            <div class="col-xs-12 hidden-md hidden-lg">
                                                <h4 class="box-font total-price">￥<i class="js_totalprices">${data.price }</i></h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3 hidden-xs hidden-sm">
                                        <h4 class="box-font total-price">￥${data.price}</h4>
                                    </div>
                                </div>
                            </div>
                            `
                            $('.row-good-info').html(html)                   
                            counts();
                            totalPrice();
                            totalpay();
                }
        })
    }
    //加载地址
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/user/showAddress',
        data: `uid=${uid}`,
        success: function (data) {
            console.log(data)
            for (let i in data) {
                if (data[i].address_default == 1) {
                    $('.js_address').text(data[i].area + data[i].address)
                    $('.js_address').prop("id", data[i].addressid)
                    break
                }
            }
        }
    })
})
//下单
$('#js_order').click(function () {
    // 获取登录用户uid
    let uid = sessionStorage.getItem('uid')
    if (!uid) {
        alert('登录！')
    }
    let addressid = $('.js_address').prop("id")
    let pidlist = new Array()
    let countlist = new Array()
    let titlelist = new Array()
    let pricelist = new Array()
    //获取商品列长度
    let pl = $('.js_gooditem').length
    //获取所有商品pid和相应商品数量
    $('.js_gooditem').each(function (i) {
        pidlist.push($(this).prop("id"))
        countlist.push(parseInt($(this).find('.js_count').text()))
        titlelist.push($(this).find('.js_goodtitle').text())
        pricelist.push(parseFloat($(this).find('.js_price').text()))
    })
    $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:5050/pay/submitorder',
        data: {
            'uid': uid,
            'status': 1,
            'addressid': addressid,
            'pidlist': pidlist,
            'countlist': countlist,
            'titlelist': titlelist,
            'pricelist': pricelist,
            'pl': pl
            // `uid=${uid}&status=${status}&plist=${pidlist}`,
        },
        traditional: true,     //传递数组
        success: function (data) {
            console.log(data)
            window.location.href = "#"
        }
    })
})
//商品总数
function counts() {
    let sum = 0
    $('.js_count').each(function (i) {
        sum += parseInt($(this).text())
    })
    $('#stacounts').text(sum)
}
//总金额
function totalPrice() {
    let prices = 0
    $(".js_totalprices").each(function (i) {
        prices += parseFloat($(this).text())
    })
    $('#staprices').text(prices)
}
//应付金额
function totalpay() {
    let prices = parseFloat($('#staprices').text())
    let coupon = parseFloat($('#stacoupon').text())
    // alert(price+'+'+coupon)
    $('#stapay').text(prices - coupon)
}
    //获取网页？后面的请求参数
    function GetRequest() {  
        var url = location.search; //获取url中"?"符后的字串  
        var theRequest = new Object();  
             if (url.indexOf("?") != -1) {  
                var str = url.substr(1);  
                strs = str.split("&");  
                for(var i = 0; i < strs.length; i ++) {  
                   theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
                 }  
             }  
             return theRequest;  
         }  