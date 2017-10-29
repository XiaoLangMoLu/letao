$(function(){
    /*前端校验功能  bootstrap validator*/
    /*1.完整的表单结构  form   input  submit 这些元素*/
    /*2.表单元素需要对应的名字 name="username" */
    /*3.初始化表单验证组件 插件*/
    /*4.配置组件功能*/
    /*5.配置具体的属性需要的校验规则*/
    var $form=$('#form');
    $form.bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // excluded: [':disabled', ':hidden', ':not(:visible)'],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            username: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    callback:{
                        message:'用户名不正确'
                    },


                }
            },
            password:{
                validators:{
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength:{
                        min:6,
                        max:18,
                        message:'密码在6-18个字符内'
                    },
                    callback: {
                        message: '密码不正确'
                    }
                }
            }
        }

    }).on('success.form.bv', function (e) {
        // console.log(e);
        e.preventDefault();
        var $form=$(e.target);
        // console.log($form.serialize());
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$form.serialize(),
            // dataType:"json",
            success:function(data){
                if(data.success){
                  location.href='index.html';
                    $form.data('bootstrpValidator').disableSubmitButtons(false);
                }else{
                    if(data.error==1000){
                        $form.data('bootstrapValidator').updateStatus('username', 'INVALID' , 'callback');
                    }
                    if(data.error==1001){
                        $form.data('bootstrapValidator').updateStatus('password', 'INVALID' , 'callback');
                    }

                }
                
            }
        })
    });
    $('[type="reset"]').on("click",function(){
         $form.data('bootstrapValidator').resetForm();
    })
});