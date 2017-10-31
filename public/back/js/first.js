$(function(){

    // 发送ajax请求
    var currentPage=1;
    var pageSize=5;
    function render(){
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{

                pageSize:pageSize,
                page:currentPage
            },
            success:function(data){
                console.log(data);
                $("tbody").html(template("tpl",data));
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:currentPage,//当前页
                    totalPages:Math.ceil(data.total/pageSize),//总页数
                    size:"small",//设置控件的大小，mini, small, normal,large
                    onPageClicked:function(event, originalEvent, type,page){
                        currentPage=page;
                        render();

                    }
                });

            }

        });
    }
    render();


    // 弹出模态框
    $("#addbtn").on("click",function(){
       $("#addModal").modal("show");

    })
    // 表单验证
    var $form=$("#form");
    $form.bootstrapValidator({



        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            categoryName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '一级分类不为空'
                    }
                }
            },
        }

    });
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        $.ajax({
            type:"post",
            url:"/category/addTopCategory",
            data:$form.serialize(),
            success:function(data){
                // console.log(data);
               if(data.success){
                   $("#addModal").modal("hide");
                   currentPage=1;
                   render();
                   $form.data('bootstrapValidator').resetForm();
                   $form[0].reset();

               }
            }
        })
    });
});