if(location.href.indexOf('login.html')<0){
    $.ajax({
        type:'get',
        url:"/employee/checkRootLogin",
        success:function (data) {
            if(data.error===400){
                location.href="login.html";
            }
            
        }
    });
}
// 进度条
$(document).ajaxStart(function(){
    NProgress.start();
});
$(document).ajaxStop(function(){
    setTimeout(function(){
        NProgress.done();
    },500)

});
$('.nav_cart').prev().on("click",function(){

    $(this).next().slideToggle();
});
$('.icon_menu').on("click",function(){
    // console.log(11);
   $('.it_aside').toggleClass('now'); 
    $('.main').toggleClass('now');
});
// 模态框

$('.icon_logout').on("click",function(){
    
    $("#logoutModal").modal("show");
});
// 发送ajax请求
$('.logoutBtn').on("click",function(){
   $.ajax({
       type:"get",
       url:"/employee/employeeLogout",
       success:function(data){
           // console.log(data);
           if(data.success){
               location.href="login.html";
           }
       }
   })
});