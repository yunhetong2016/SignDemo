"use strict";
require.config({
    paths: {
        "jquery": "./jquery.min",
        "signature_pad": "./signature_pad.min",
        "bootstrap": "./bootstrap.min",
        "sweetalert": "./sweetalert.min"
    }, shim: {
        "jquery": {"export": "$"},
        "bootstrap": {"deps": ['jquery']},
        'sweetalert': {deps: ['jquery']}
    }
});
require(["jquery", "signature_pad", "bootstrap"], function () {
    // $( window ).orientationchange();
    var canvas = document.querySelector("canvas");
    var signaturePad;
    // init();
    signaturePad = initCanvas();
    $('#btn-clear').on('click', function () {
        signaturePad.clear();
    });
    $('#btn-addSign').on('click', function () {
        if (signaturePad.isEmpty()) {
            swal({
                title: "请绘制你的签名",
                type: "error",
                showCancelButton: false
            });
            return false;
        }
        $.ajax({
            url: '/sdk/QRSign/createSignByQR',
            type: 'post',
            data: {
                sign: (signaturePad.toDataURL()).split("base64,")[1]
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data.code == 200 && data.subCode == 200) {
                    alert('签名创建成功！');
                    window.open("about:blank","_self").close();
                } else {
                    alert(data.message);
                }
            },
            error: function () {
                alert('系统异常');
            }
        });
    });
    /**
     * 初始化画签名的画布
     */
    function initCanvas() {
        // var ratio = Math.max(window.devicePixelRatio || 1, 1);
        var offsetWidth = $(canvas.parentNode).width();
        //console.log($(canvas.parentNode).width());
        canvas.width = offsetWidth;
        canvas.height = offsetWidth * 0.55;
        return new SignaturePad(canvas, {
            minWidth: 1.4, maxWidth: 2
        });
        //signaturePad.penColor="rgb(255,255,0)";
    }

    $(function () {
        if (window.orientation == 0 || window.orientation == 180) {
            alert('请横屏！');
            return false;
        }
        initCanvas();
    });
    $(window).bind('orientationchange', function (e) {
        var $body = $("body");
        if (window.orientation == 0 || window.orientation == 180) {
            alert('请横屏！');
            return false;
        }
        initCanvas();
    });
    /**
     * 获取url中的token参数
     * @returns {*}
     */
    function getToken() {
        return ((window.location.search.split('token=')[1]) || 'noTokenFound').split('&')[0];
    }
});