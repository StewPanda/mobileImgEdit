(function ($) {
    $.fn.imgEdit = function (options) {
        var _this = this;
        var opts = $.extend({
            'size': 2,                          //图片清晰度,默认为容器2倍
            'upFileBtn': 'input[type=file]',              //上传按钮
            'editBtn': '.input',                //确认按钮
            'width':this.width(),               //容器宽度
            'height':this.height(),             //容器高度
            'top':this.offset().top,            //容器顶边距
            'left':this.offset().left,          //容器左边距
        }, options);
        // console.log(opts);
        var touches=[], //记录屏幕按下去时候的坐标
            start,      //屏幕按下去两个触摸点之间的距离
            end,        //手指移动时两个触摸点之间的距离
            startY,     //屏幕按下时图片的Y坐标
            startX,     //屏幕按下时图片的X坐标
            scale,      //图片载入时的缩放比例
            moveScale,  //图片缩放过后的缩放比例
            imgWidth,   //图片的原始宽度
            imgHeight;  //图片的原始高度
        var upFileBtn = $(opts.upFileBtn);
        var editBtn = $(opts.editBtn);
        editBtn.click(function () {
            if(_this.find('img').length){
                var size = 2;
                var img = new Image();
                img.src = _this.find('img').attr('src');
                var c = document.createElement('canvas');
                c.id = 'drawImage';
                c.width = opts.width * size;
                c.height = opts.height * size;
                var ctx = c.getContext("2d");
                var sy = (_this.find('img').offset().top - opts.top);
                var sx = (_this.find('img').offset().left - opts.left);
                ctx.drawImage(img,0,0,imgWidth,imgHeight,sx * size,sy * size,imgWidth * size * moveScale,imgHeight * size * moveScale);
                var url =c.toDataURL();//转换成功的base64图片
                $('body').append('<img src="'+url+'" style="display: block;margin:0 auto;width:'+opts.width+'px;height:'+opts.height+'px">');
                // 这里写post,success之后把$('.wait').hide();$('.shareTo').show();
            }else{
                alert('请上传一张图片');
            } 
        });
        upFileBtn.on('change',function () {
            var img = new Image();
            img.src = getFileUrl(this);
            _this.html(img);
            var _that = _this.find('img');
            _that.on('load', function () {
                imgWidth = $(this).width();
                imgHeight = $(this).height();
                console.log(imgWidth,imgHeight,opts.width,opts.height);
                scale = opts.width / imgWidth;
                moveScale = opts.width / imgWidth;
                $(this).css('transform', 'translate(-50%,-50%) scale('+scale+ ')');
            });
            _that.on('touchstart',function (e) {
                var touch = event.touches;
                e.preventDefault();
                startY = parseFloat(_that.css('top'));
                startX = parseFloat(_that.css('left'));
                if (touch && touch.length == 2)
                {
                    touches[0] = touch[0];
                    touches[1] = touch[1];
                    start = getDistance(touch);
                }else if (touch && touch.length == 1){
                    touches[0] = touch[0];
                }
            });
            _that.on('touchmove',function (e) {
                var touch = event.touches;
                e.preventDefault();
                if (touch && touch.length == 2)
                {
                    end = getDistance(touch);
                    var endScale = moveScale+(end-start)*0.0002;
                    if(endScale < scale) endScale = scale;
                    if(endScale > 2) endScale = 2;
                    $(this).css('transform', 'translate(-50%,-50%) scale('+endScale+ ')');
                    moveScale = endScale;
                }else if (touch && touch.length == 1){
                    var moveY = touch[0].pageY-touches[0].pageY;
                    var moveX = touch[0].pageX-touches[0].pageX;
                    _that.css({'top':startY+moveY,'left':startX+moveX});
                }
            });
        });
    };
    function getFileUrl(selector){
        var img_url;
        if(navigator.userAgent.indexOf("MSIE")>=1){
            img_url = selector.value;
        }else{
            img_url = window.URL.createObjectURL(selector.files.item(0));
        }
        return img_url;
    }
    /**计算两个触摸点之间的距离*/
    function getDistance(points)
    {
        var distance = 0;
        if (points && points.length == 2)
        {
            var dx = points[0].pageX - points[1].pageX;
            var dy = points[0].pageY - points[1].pageY;

            distance = Math.sqrt(dx * dx + dy * dy);
        }
        return distance;
    }
})(window.jQuery);