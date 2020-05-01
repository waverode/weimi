window.onload=function(){
    let uid = sessionStorage.getItem('uid')
    console.log(uid)
    $.ajax({
        method:'GET',
        url:'http://127.0.0.1:5050/user/uname',
        data:`uid=${uid}`,
    
        // xhrFields: {withCredentials: true}, 
        success:function(data,msg,xhr){
            console.log('异步查询查询用户名成功')
            if(data.code==351){
                let uname = data.uname
                console.log('当前用户是：',uname)
             
            html2=`
            <li class="dropdown">
                    <a href="#" style=" font-size: 22px;color: #ffffff;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">${uname}<span class="caret"></span></a>
                    <ul class="dropdown-menu wm-gray">
                        
                      <li><a type="button" id="bt1" style="font-size: 18px;color: #ffffff;" href="/user/user.html">消息通知</a></li>
                      <li><a style="font-size: 18px;color: #ffffff;" href="/cart/cart.html">购物车</a></li>
                      <li><a style="font-size: 18px;color: #ffffff;" href="/user/user.html">我的个人中心</a></li>
                      <li role="separator" class="divider"></li>
                      <li><a type="button" id="btLogout" style="font-size: 18px;color: #ffffff;" href="/index.html">退出登录</a></li>
                    </ul>
                  </li> `  
        
    
            }else{
            html2=`<li><a style="font-size: 22px;color: #ffffff;" href="/signin.html">登录</a></li>
             <li><a style="font-size: 22px;color: #ffffff;" href="/signup.html">注册</a></li>
             `
            }
        html1=$('#block1').html()
    html3=html2+html1
    $('#block1').html(html3) 
     $('#btLogout').click(function(){
         let uid=sessionStorage.getItem('uid')
         console.log('移除uid',uid)
         sessionStorage.removeItem('uid')
         location.href='index.html'
  
})
        },error:function(xhr,err){

            }
            
    })
        
  
}
 
$('#btSearch').click(function(){
     let word = $('#keyword').val()
     location.href='/search.html?search='+word
     
})

//collapse不能正常折叠的时使用这个函数
//在有 collapsed 的class 里面 加上 cccc 
$(".cccc").click(function () {
    console.log('11111')

    if ($('#wm-header-menu').attr("class") === "navbar-collapse collapse") {
        $('#wm-header-menu').attr("class", "navbar-collapse collapse in").css("height", "auto");
    } else {
        $('#wm-header-menu').attr("class", "navbar-collapse collapse").css("height", "0px");
    }
    return false;//停止运行bootstrap自带的函数
})
    