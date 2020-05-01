//页面加载完成，异步请求服务器端动态数据
$(window).load(function () {
    //获取登录用户id
    // let uid = sessionStorage.getItem('uid')
    let uid = 1
    if (!uid) {    //如果uid==null，提示登录
        $('#checklogin').modal()
        //关闭模态框跳转登录界面
        $('#checklogin').on('hide.bs.modal', function () {
            window.location.href = "#"
        })
    }
    $('#js_user').text(sessionStorage.getItem('uname'))
    // 获取商品列checkbox长度（商品列表长度）
    let cl = 0
    // 获取勾选的商品列长度
    let ch = 0
    //获取用户购物车信息
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/cart/item/list',
        data: `uid=${uid}`,
        success: function (data) {
            // console.log('成功获取到服务器端返回的数据')
            console.log(data)
            //let cart_data = data.cartgoods       //获取用户购物车列表数据
            let html = ``
            if (data.length > 0) {
                html = $('#goodslist').html()    //购物车页要处理的数据
                for (let i in data) {
                    html += `
                                <div class="item-box">
                                    <div class="row">
                                        <div class="col-xs-2 col-md-1 checkbox-custom js_checkbox">
                                            <input class="js_smcheckbox" type="checkbox" id="${data[i].cid}" value="">
                                            <label for="${data[i].cid}"></label>
                                        </div>
                                        <div class="col-xs-2 col-md-1">
                                            <a href="#"><img src="${data[i].md}" alt="" class="img-rounded"></a>
                                        </div>
                                        <div class="col-xs-6 col-md-4 cell-name">
                                            <div class="row">
                                                <div class="col-xs-12 col-md-12">
                                                    <h4 class="goods-name"><a href="#">${data[i].title}</a></h4>
                                                </div>
                                                <!-- 平板屏幕以上隐藏，以下价格和数量内嵌 -->
                                                <div class="col-xs-12 hidden-md hidden-lg">
                                                    <div class="row cartlist-hidden">
                                                        <div class="col-xs-6 js_price">
                                                            <h4><span>${data[i].price}</span>元</h4>
                                                        </div>
                                                        <div class="col-xs-6 js_count">
                                                            <div class="input-group">
                                                                <input id="${data[i].cid}" class="form-control count" type="number" value="${data[i].count}" step="1" min="1">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- <h3><a href="#"> </a></h3> -->
                                        </div>
                                        <div class="col-md-1 hidden-xs hidden-sm item-box cell-price js_price">
                                            <h4><span>${data[i].price}</span>元</h4>
                                        </div>
                                        <div class="col-md-2 hidden-xs hidden-sm js_count">
                                            <div class="input-group">
                                                <input id="${data[i].cid}" class="form-control count" type="number" value="${data[i].count}" step="1" min="1">
                                            </div>
                                        </div>
                                        <div class="col-md-2 hidden-xs hidden-sm cell-totalpay js_subtotal">
                                            <span>${data[i].price * data[i].count}</span>元
                                        </div>
                                        <div class="col-xs-2 col-md-1 del-cart">
                                            <a id="${data[i].cid}" href="#" class="del" title="删除">
                                                <i class="iconfont">×</i>
                                            </a>
                                        </div>
                                    </div>
                                </div>    
                            `
                    $('#goodslist').html(html)
                    //计算总商品长度
                    counts()
                    if (data[i].checked == 1) {
                        ch++
                    }
                }
                check(data)
            } else {     //购物车为空
                html += `
                            <!--商品为空 -->
                            <div class="cart-empty ">
                                <div class="row">
                                    <div class="col-md-6 empty-img">
                                        <img src="img/cart-empty.png">
                                    </div>
                                    <div class="col-md-6 empty-info">
                                        <h2>您的购物车还是空的！</h2>
                                        <a href="#" class="btn">马上去购物</a>
                                    </div>
                                </div>
                            </div>
                        `
                //隐藏购物车商品列表
                $('#cartmain').addClass('hide')
                $('#maincartlist').html(html)
            }
            cl = data.length
            //没有勾选时，结算按钮禁用
            if (ch == 0) {
                $('#settlement').addClass('btn-pay-disabled')
                $('#settlement').prop("disabled", "disabled")
            } else {
                $('#settlement').removeClass('btn-pay-disabled')
                $('#settlement').removeProp("disabled")
            }
            //所有商品列勾选时，全选checkbox状态改为勾选
            if (ch == cl) {
                $('#checkall').prop("checked", true)
            } else {
                $('#checkall').prop("checked", false)
            }
            select();
            totalPrice();

            /*********************************************************/
            //修改购买数量
            $(".count").bind('input propertychange', function () {
                let num = $(this).val()
                let price = parseFloat($(this).parents(".js_count").siblings(".js_price").find("span").text())
                let cid = $(this).attr("id")   //获取购物商品项id
                $.ajax({
                    method: 'GET',
                    url: 'http://127.0.0.1:5050/cart/item/updatacount',
                    data: `uid=${uid}&cid=${cid}&count=${num}`,
                    success: function (data) {
                        if (data.code === 200) {
                            //修改成功
                            select();
                            totalPrice();
                        }
                    }
                })
                //修改商品小计
                $(this).parents(".js_count").siblings(".js_subtotal").find("span").text((price * num).toFixed(2))

            })
            //删除购物车商品项
            $(".del").click(function () {
                let cid = $(this).attr("id")
                alert(uid)
                $.ajax({
                    method: 'GET',
                    url: 'http://127.0.0.1:5050/cart/item/delete',
                    data: `uid=${uid}&cid=${cid}`,
                    success: function (data) {
                        if (data.code === 200) {
                            //删除成功
                            console.log(data)
                        }
                        counts()
                        select();
                        totalPrice();
                    }
                })
                $(this).parents(".item-box").remove()
                //获取商品列的长度
                let item_l = $(".item-box").length / 2
                if (item_l == 0) {   // 购物车商品列表为空时，重新加载页面
                    location.reload()
                }
            })
            //购物车条目勾选
            $(".js_checkbox input").click(function () {
                let cid = $(this).attr("id")
                //获取checkbox的勾选情况：prop()方法，true为勾选；false为未选
                let check = $(this).prop("checked")
                let checked
                if (check) checked = 1
                else checked = 0
                $.ajax({
                    method: 'GET',
                    url: 'http://127.0.0.1:5050/cart/item/checked',
                    data: `uid=${uid}&cid=${cid}&checked=${checked}`,
                    success: function (data) {
                        if (data.code === 200) {
                            //修改勾选情况成功
                            // 获取商品列checkbox长度（商品列表长度）
                            cl = $(".js_checkbox input").length
                            // 获取勾选的商品列长度
                            ch = $(".js_checkbox input:checked").length
                            //没有勾选时，结算按钮禁用
                            if (ch == 0) {
                                $('#settlement').addClass('btn-pay-disabled')
                                $('#settlement').prop("disabled", "disabled")
                            } else {
                                $('#settlement').removeClass('btn-pay-disabled')
                                $('#settlement').removeProp("disabled")
                            }
                            //所有商品列勾选时，全选checkbox状态改为勾选
                            if (ch == cl) {
                                $('#checkall').prop("checked", true)
                            } else {
                                $('#checkall').prop("checked", false)
                            }
                            select();
                            totalPrice();
                        }
                    }
                })
            })
        }
    })
})

//全选
$('#checkall').click(function () {
    // let uid = sessionStorage.getItem('uid')
    let uid = 1
    let checked
    //检测全选checkbox是否勾选
    let flag = $(this).prop("checked")
    if (flag) {
        checked = 1
        $(".js_checkbox input").prop("checked", true)
    } else {
        checked = 0
        $(".js_checkbox input").prop("checked", false)
    }
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/cart/item/checkall',
        data: `uid=${uid}&checked=${checked}`,
        success: function (data) {
            console.log(data)
            //修改勾选情况成功
            // 获取商品列checkbox长度（商品列表长度）
            cl = $(".js_checkbox input").length
            // 获取勾选的商品列长度
            ch = $(".js_checkbox input:checked").length
            //没有勾选时，结算按钮禁用
            if (ch == 0) {
                $('#settlement').addClass('btn-pay-disabled')
                $('#settlement').prop("disabled", "disabled")
            } else {
                $('#settlement').removeClass('btn-pay-disabled')
                $('#settlement').removeProp("disabled")
            }
            //所有商品列勾选时，全选checkbox状态改为勾选
            if (ch == cl) {
                $('#checkall').prop("checked", true)
            } else {
                $('#checkall').prop("checked", false)
            }
        }
    })
    select();
    totalPrice();
})

//检验是否勾选
function check(data) {
    $(".js_smcheckbox").each(function (i) {
        // console.log('hgheigh')
        if (data[i].checked == 1) {
            $(this).prop("checked", true)
            // alert($(this).prop("checked"))
        } else {
            $(this).prop("checked", false)
            // alert($(this).prop("checked"))
        }

    })
}
//商品总数
function counts() {
    let sum = 0
    $(".js_checkbox input").each(function (i) {
        sum += parseInt($(this).parents(".item-box").find(".count").val())
    })
    $("#countall").text(sum)
}
//选择商品总数
function select() {
    let sum = 0
    $(".js_checkbox input:checked").each(function (i) {
        sum += parseInt($(this).parents(".item-box").find(".count").val())
    })
    $("#select").text(sum)
}
//总金额
function totalPrice() {
    let prices = 0;
    $(".js_checkbox input:checked").each(function (i) {
        prices += parseFloat($(this).parents(".item-box").find(".js_subtotal span").text())
    })
    $("#totalprice").text(prices)
}
