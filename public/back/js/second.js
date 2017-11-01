$(function(){

    var currentPage=1;
    var pageSize=5;
    // 发送ajax请求
    function render(){
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize

            },
            success:function(data){
                console.log(data);

                $("tbody").html(template("tpl",data));
                $("#pagintor").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(data.total/pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage=page;
                        render();
                    }
                });

            }
        });
    }
    render();

    $("#addbtn").on("click",function(){
        // console.log(1);
        $("#addModal").modal("show");
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            success:function(data){
                // console.log(data);
                $(".dropdown-menu").html(template("tpl1",data))
            }
        })
    });
    $(".dropdown-menu").on("click", "a",function(){
        $(".dropdown-text").text($(this).text());
        $("#categoryId").val($(this).data("id"));
        $form.data('bootstrapValidator').updateStatus("categoryId","VALID")
    });
    // 初始文件上传
    $("#fileupload").fileupload({
        dataType:"json",
        done:function(e,data){
            console.log(data);
            console.log(e);
            $(".img_box img").attr("src",data.result.picAddr);
            $("#brandLogo").val(data.result.picAddr);
            $form.data('bootstrapValidator').updateStatus("brandLogo","VALID");
        }
        
    });
    // 表单验证
  var $form=$("#form");
    $form.bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryId: {
                validators : {
                    //不能为空
                    notEmpty: {
                        message: '一级分类不能为空'
                    },


                    //正则校验
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '用户名由数字字母下划线和.组成'
                    }
                }
            },
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '二级分类不能为空'
                    },
                }
            },
            brandLogo: {
                validators : {
                    //不能为空
                    notEmpty: {
                        message: '图片不能为空'
                    },



                }
            },
        },
       


    });
   $form.on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
       console.log($form.serialize());
     $.ajax({
         type:"post",
         url:"/category/addSecondCategory",
         data:$form.serialize(),

         success:function(data){
             // console.log(data);
             if(data.success){
                 $("#addModal").modal("hide");
                 currentPage=1;
                 render();
                 $form[0].reset();
                 $form.data("bootstrapValidator").resetForm();

             }
         }
     })
    });
    
});