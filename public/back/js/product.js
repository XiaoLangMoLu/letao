$(function(){
    var currentPage=1;
    var pageSize=5;
    var imgArray=[];
    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
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
        })
    }
    render();
    // 模态框
var $form=$("#form");
    $("#addPro").on("click",function(){
        $("#proModal").modal("show");
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
            page:1,
             pageSize:100
            },
            success:function(data){
                console.log(data);
                $(".dropdown-menu").html(template("tpl1",data));
            }
        })
    });
    $(".dropdown-menu").on("click","a",function(){
        $(".dropdown-text").text($(this).text());
        $("#brandId").val($(this).data("id"));
        $form.data('bootstrapValidator').updateStatus("brandId","VALID");
    });
    // 初始化图片上传
    $("#fileupload").fileupload({
        dataType:"json",
        done:function(e,data){
            console.log(data);
            $(".img_box").append('<img src="'+data.result.picAddr+'" width="100" height="100" alt="">');
            imgArray.push(data.result);
            console.log(imgArray);
            if(imgArray.length===3){
                $form.data("bootstrapValidator").updateStatus("productLogo","VALID");

            }else{
                $form.data("bootstrapValidator").updateStatus("productLogo","INVALID");

            }
        }
    });
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
            brandId: {
                validators : {
                    //不能为空
                    notEmpty: {
                        message: '二级分类不能为空'
                    },



                }
            },
            proName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '商品名称不能为空'
                    },

                }
            },
          proDesc: {
                validators : {
                    //不能为空
                    notEmpty: {
                        message: '描述不能为空'
                    },

                }
            },

            num: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '输入库存'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '请输入大于0的库存'
                    }
                }
            },

            size: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入商品尺寸'
                    },
                },
                regexp: {
                    regexp: /^\d{2}-\d{2}$/,
                    message: 'q请输入正确的尺寸(30-50)'
                }
            },

               price: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入价格'
                    },
                }
            },

           oldPrice: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '价格不能为空'
                    },
                }
            },
            productLogo: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '图片必须三张'
                    },
                }
            },
        },
    });
    $form.on("success.form.bv",function(e){
        e.preventDefault();
        var param=$form.serialize();
        param+="&picName1="+imgArray[0].picName+imgArray[0].picAddr;
        param+="&picName2="+imgArray[1].picName+imgArray[1].picAddr;
        param+="&picName2="+imgArray[2].picName+imgArray[2].picAddr;
        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:param,
            success:function(data){
                // console.log(data);
                if(data.success){
                    $("#proModal").modal("hide");
                    currentPage=1;
                    render();
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();

                }
            }
        })
    })
});
//  proName 	是   	产品名称
// oldPrice	是   	老价格
// price   	是   	价格
// proDesc 	是   	产品描述
// size    	是   	产品尺寸
// statu   	是   	产品上下架
// num     	是   	用户库存
// brandId 	是   	归属品牌 


