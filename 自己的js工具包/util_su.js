//依赖jquery
(function( global, factory ){
    "use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {
        //环境检测
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
})(typeof window !== "undefined" ? window : this, function( window) {
    var UTIL_SU ={
        GLOBALIP:""
        ,locationHref:function(url){
            //页面跳转
            window.location.href=url;
        }
        ,loadData:function(uploadType,url,uploadData,getData,mimeType){
            /*
                如果是文件上传需要添加参数。
                mimeType = "multipart/form-data"
                ，以var formData = new FormData();
                formData.append('images', $("input[name=images]")[0].files[0]);
                方式传递uploadData;
            */
             var obj = {
                type: uploadType,
                async: true,
                data:uploadData,
                url:UTIL_SU.GLOBALIP+url,
                dataType: 'json',
                beforeSend: function (XMLHttpRequest) {
                    if(sessionStorage.tx_token){
                        XMLHttpRequest.setRequestHeader("token",sessionStorage.tx_token);
                    }
                },
                success: function (data) {
                    if (data&&data.status===0) {   
                        getData(data,uploadData);
                    }else if(data&&data.status===-51){
                        alert('您没有权限查看本块内容');
                    }else if(data&&data.status===-52){
                        sessionStorage.rc_JSESSIONID = undefined;
                        window.location.href = "page/rcLogin/rcLogin.html";  
                    }else{
                        console.log('抱歉!未能找到相关内容'); 
                    }
                }
            };
            if(mimeType){
                obj.mimeType=mimeType;
                obj.contentType=false;
                obj.processData=false;
            }
            return $.ajax(obj);
        }
        ,ajax(setting){
            /**
             * @param  {setting}
             */
            
            //设置参数的初始值
            var opts={
                method: (setting.method || "GET").toUpperCase(), //请求方式
                url: setting.url || "", // 请求地址
                async: setting.async || true, // 是否异步
                dataType: setting.dataType || "json", // 解析方式
                data: setting.data || "", // 参数
                success: setting.success || function(){}, // 请求成功回调
                error: setting.error || function(){} // 请求失败回调
            }

            // 参数格式化
            function params_format (obj) {
                var str = ''
                for (var i in obj) {
                    str += i + '=' + obj[i] + '&'
                }
                return str.split('').slice(0, -1).join('')
            }

            // 创建ajax对象
            var xhr=new XMLHttpRequest();

            // 连接服务器open(方法GET/POST，请求地址， 异步传输)
            if(opts.method == 'GET'){
                xhr.open(opts.method, opts.url + "?" + params_format(opts.data), opts.async);
                xhr.send();
            }else{
                xhr.open(opts.method, opts.url, opts.async);
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhr.send(opts.data);
            }

            /*
            ** 每当readyState改变时，就会触发onreadystatechange事件
            ** readyState属性存储有XMLHttpRequest的状态信息
            ** 0 ：请求未初始化
            ** 1 ：服务器连接已建立
            ** 2 ：请求已接受
            ** 3 : 请求处理中
            ** 4 ：请求已完成，且相应就绪
            */
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                    switch(opts.dataType){
                        case "json":
                            var json = JSON.parse(xhr.responseText);
                            opts.success(json);
                            break;
                        case "xml":
                            opts.success(xhr.responseXML);
                            break;
                        default:
                            opts.success(xhr.responseText);
                            break;
                    }
                }
            }

            xhr.onerror = function(err) {
                opts.error(err);
            }
        }
        ,fetch:function(url, setting) {
                
            /**
             * @param  {url}
             * @param  {setting}
             * @return {Promise}
             */
            
            //设置参数的初始值
            var opts={
                method: (setting.method || 'GET').toUpperCase(), //请求方式
                headers : setting.headers  || {}, // 请求头设置
                credentials : setting.credentials  || true, // 设置cookie是否一起发送
                body: setting.body || {},
                mode : setting.mode  || 'no-cors', // 可以设置 cors, no-cors, same-origin
                redirect : setting.redirect  || 'follow', // follow, error, manual
                cache : setting.cache  || 'default' // 设置 cache 模式 (default, reload, no-cache)
            }
            var dataType = setting.dataType || "json", // 解析方式  
                data = setting.data || "" // 参数

            // 参数格式化
            function params_format (obj) {
                var str = ''
                for (var i in obj) {
                    str += '${i}=${obj[i]}&'
                }
                return str.split('').slice(0, -1).join('')
            }

            if (opts.method === 'GET') {
                url = url + (data?'?${params_format(data)}':'')
            }else{
                setting.body = data || {}
            }
            return new Promise( (resolve, reject) => {
                fetch(url, opts).then( async res => {
                    var data = dataType === 'text' ? await res.text() :
                        dataType === 'blob' ? await res.blob() : await res.json() 
                    resolve(data)
                }).catch( e => {
                    reject(e)
                })
            })
        }
        ,keyboardProhibition:function(){
            // 禁止鼠标右键菜单和F12打开控制台看源码
            document.oncontextmenu = function () { return false; };
            document.onkeydown = function () {
                if (window.event && window.event.keyCode == 123) {
                    event.keyCode = 0;
                    event.returnValue = false;
                    return false;
                }
            };
        }
        ,formatTime:function (_time){
            //格式化时间
            var year = _time.getFullYear();
            var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
            var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
            var hour = _time.getHours()<10 ? "0"+_time.getHours() : _time.getHours();
            var minute = _time.getMinutes()<10 ? "0"+_time.getMinutes() : _time.getMinutes();
            return year+"-"+month+"-"+day+" "+hour+":"+minute;
        }
        ,formatDate:function (_time){
            //格式化日期
            var year = _time.getFullYear();
            var month = _time.getMonth()+1<10 ? "0"+(_time.getMonth()+1) : _time.getMonth()+1;
            var day = _time.getDate()<10 ? "0"+_time.getDate() : _time.getDate();
            return year+"-"+month+"-"+day;
        }
        ,formatTime:function(time, cFormat) {
            /**
             * 格式化时间
             * 
             * @param  {time} 时间
             * @param  {cFormat} 格式
             * @return {String} 字符串
             *
             * @example formatTime('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
             */
            if (arguments.length === 0) return null
            if ((time + '').length === 10) {
                time = +time * 1000
            }

            var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}', date
            if (typeof time === 'object') {
                date = time
            } else {
                date = new Date(time)
            }

            var formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
                var value = formatObj[key]
                if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                if (result.length > 0 && value < 10) {
                    value = '0' + value
                }
                return value || 0
            })
            return time_str
        }
        ,getMonths:function(time, len, direction) {
            /**
             * 返回指定长度的月份集合
             * 
             * @param  {time} 时间
             * @param  {len} 长度
             * @param  {direction} 方向：  1: 前几个月;  2: 后几个月;  3:前后几个月  默认 3
             * @return {Array} 数组
             * 
             * @example   getMonths('2018-1-29', 6, 1)  // ->  ["2018-1", "2017-12", "2017-11", "2017-10", "2017-9", "2017-8", "2017-7"]
             */
            var mm = new Date(time).getMonth(),
                yy = new Date(time).getFullYear(),
                direction = isNaN(direction) ? 3 : direction,
                index = mm;
            var cutMonth = function(index) {
                if ( index <= len && index >= -len) {
                    return direction === 1 ? formatPre(index).concat(cutMonth(++index)):
                        direction === 2 ? formatNext(index).concat(cutMonth(++index)):formatCurr(index).concat(cutMonth(++index))
                }
                return []
            }
            var formatNext = function(i) {
                var y = Math.floor(i/12),
                    m = i%12
                return [yy+y + '-' + (m+1)]
            }
            var formatPre = function(i) {
                var y = Math.ceil(i/12),
                    m = i%12
                m = m===0 ? 12 : m
                return [yy-y + '-' + (13 - m)]
            }
            var formatCurr = function(i) {
                var y = Math.floor(i/12),
                    yNext = Math.ceil(i/12),
                    m = i%12,
                    mNext = m===0 ? 12 : m
                return [yy-yNext + '-' + (13 - mNext),yy+y + '-' + (m+1)]
            }
            // 数组去重
            var unique = function(arr) {
                if ( Array.hasOwnProperty('from') ) {
                    return Array.from(new Set(arr));
                }else{
                    var n = {},r=[]; 
                    for(var i = 0; i < arr.length; i++){
                        if (!n[arr[i]]){
                            n[arr[i]] = true; 
                            r.push(arr[i]);
                        }
                    }
                    return r;
                }
            }
            return direction !== 3 ? cutMonth(index) : unique(cutMonth(index).sort(function(t1, t2){
                return new Date(t1).getTime() - new Date(t2).getTime()
            }))
        }
        ,getDays:function(time, len, diretion) {
            /**
             * 返回指定长度的天数集合
             * 
             * @param  {time} 时间
             * @param  {len} 长度
             * @param  {direction} 方向： 1: 前几天;  2: 后几天;  3:前后几天  默认 3
             * @return {Array} 数组
             *
             * @example date.getDays('2018-1-29', 6) // -> ["2018-1-26", "2018-1-27", "2018-1-28", "2018-1-29", "2018-1-30", "2018-1-31", "2018-2-1"]
             */
            var tt = new Date(time)
            var getDay = function(day) {
                var t = new Date(time)
                t.setDate(t.getDate() + day)
                var m = t.getMonth()+1
                return t.getFullYear()+'-'+m+'-'+t.getDate()
            }
            var arr = []
            if (diretion === 1) {
                for (var i = 1; i <= len; i++) {
                    arr.unshift(getDay(-i))
                }
            }else if(diretion === 2) {
                for (var i = 1; i <= len; i++) {
                    arr.push(getDay(i))
                }
            }else {
                for (var i = 1; i <= len; i++) {
                    arr.unshift(getDay(-i))
                }
                arr.push(tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate())
                for (var i = 1; i <= len; i++) {
                    arr.push(getDay(i))
                }
            }
            return diretion === 1 ? arr.concat([tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate()]) : 
                diretion === 2 ? [tt.getFullYear()+'-'+(tt.getMonth()+1)+'-'+tt.getDate()].concat(arr) : arr
        }
        ,formatHMS:function(s) {
            /**
             * @param  {s} 秒数
             * @return {String} 字符串 
             *
             * @example formatHMS(3610) // -> 1h0m10s
             */
            var str = ''
            if (s > 3600) {
                str = Math.floor(s/3600)+'h'+Math.floor(s%3600/60)+'m'+s%60+'s'
            }else if(s > 60) {
                str = Math.floor(s/60)+'m'+s%60+'s'
            }else{
                str = s%60+'s'
            }
            return str
        }
        ,getMonthOfDay:function(time) {
            /*获取某月有多少天*/
            var date = new Date(time)
            var year = date.getFullYear()
            var mouth = date.getMonth() + 1
            var days

            //当月份为二月时，根据闰年还是非闰年判断天数
            if (mouth == 2) {
                days = (year%4==0 && year%100==0 && year%400==0) || (year%4==0 && year%100!=0) ? 28 : 29
            } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
                //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
                days = 31
            } else {
                //其他月份，天数为：30.
                days = 30
            }
            return days
        }
        ,getYearOfDay:function(time) {
            /*获取某年有多少天*/
            var firstDayYear = this.getFirstDayOfYear(time);
            var lastDayYear = this.getLastDayOfYear(time);
            var numSecond = (new Date(lastDayYear).getTime() - new Date(firstDayYear).getTime())/1000;
            return Math.ceil(numSecond/(24*3600));
        }
        ,getFirstDayOfYear:function(time) {
            /**获取某年的第一天**/
            var year = new Date(time).getFullYear();
            return year + "-01-01 00:00:00";
        }
        ,getLastDayOfYear:function(time) {
            /**获取某年最后一天**/
            var year = new Date(time).getFullYear();
            var dateString = year + "-12-01 00:00:00";
            var endDay = this.getMonthOfDay(dateString);
            return year + "-12-" + endDay + " 23:59:59";
        }
        ,getDayOfYear:function(time) {
            /*获取某个日期是当年中的第几天*/
            var firstDayYear = this.getFirstDayOfYear(time);
            var numSecond = (new Date(time).getTime() - new Date(firstDayYear).getTime())/1000;
            return Math.ceil(numSecond/(24*3600));
        }
        ,getDayOfYearWeek:function(time) {
            /*获取某个日期在这一年的第几周*/
            var numdays = this.getDayOfYear(time);
            return Math.ceil(numdays / 7);
        }
        ,popup_drag:function(obj){
            /*
            模块拖拽代码。
            使用方式vm.popup_drag($("#id"));
            */
            var _move=false;//移动标记
            var _x,_y;//鼠标离控件左上角的相对位置
            obj.click(function(){
                //alert("click");//点击（松开后触发）
                }).mousedown(function(e){
                _move=true;
                _x=e.pageX-parseInt(obj.css("left"));
                _y=e.pageY-parseInt(obj.css("top"));
            });
            $(document).mousemove(function(e){
                if(_move){
                    var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                    var y=e.pageY-_y;
                    obj.css({top:y,left:x});//控件新位置
                }
            }).mouseup(function(){
            _move=false;
          });
        }
        ,typeofObj:function(bar){
            /*
            判断是否是对象
            typeof null == "object" --> true; JavaScript中 null 也被认为是对象
            
            函数为true：
            console.log((bar !== null) && ((typeof bar === "object") || (typeof bar === "function")));
            
            数组为false：
            console.log((bar !== null) && (typeof bar === "object") && (toString.call(bar) !== "[object Array]"));
            console.log((bar !== null) && (typeof bar === "object") && (! $.isArray(bar)));
            
            isString (o) { //是否字符串
                return Object.prototype.toString.call(o).slice(8, -1) === 'String'
            }

            isNumber (o) { //是否数字
                return Object.prototype.toString.call(o).slice(8, -1) === 'Number'
            }

            isBoolean (o) { //是否boolean
                return Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
            }

            isFunction (o) { //是否函数
                return Object.prototype.toString.call(o).slice(8, -1) === 'Function'
            }

            isNull (o) { //是否为null
                return Object.prototype.toString.call(o).slice(8, -1) === 'Null'
            }

            isUndefined (o) { //是否undefined
                return Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'
            }

            isObj (o) { //是否对象
                return Object.prototype.toString.call(o).slice(8, -1) === 'Object'
            }

            isArray (o) { //是否数组
                return Object.prototype.toString.call(o).slice(8, -1) === 'Array'
            }

            isDate (o) { //是否时间
                return Object.prototype.toString.call(o).slice(8, -1) === 'Date'
            }

            isRegExp (o) { //是否正则
                return Object.prototype.toString.call(o).slice(8, -1) === 'RegExp'
            }

            isError (o) { //是否错误对象
                return Object.prototype.toString.call(o).slice(8, -1) === 'Error'
            }

            isSymbol (o) { //是否Symbol函数
                return Object.prototype.toString.call(o).slice(8, -1) === 'Symbol'
            }

            isPromise (o) { //是否Promise对象
                return Object.prototype.toString.call(o).slice(8, -1) === 'Promise'
            }

            isSet (o) { //是否Set对象
                return Object.prototype.toString.call(o).slice(8, -1) === 'Set'
            }

            isFalse (o) {
                if (!o || o === 'null' || o === 'undefined' || o === 'false' || o === 'NaN') return true
                    return false
            }

            isTrue (o) {
                return !this.isFalse(o)
            }
            */
            return (bar !== null) && (typeof bar === "object");
        }
        ,isNaN:function(value){
            //NaN 不等于任何数包括自身。所以返回true；NaN是Number， typeof NaN === "number"为true;
            return value !== value
        }
        ,withinErrorMargin:function(left, right) {
            /*
            浮点数计算是不精确的 0.1 + 0.2 = 0.30000000000000004
            0.1 + 0.2 === 0.3 // false
            withinErrorMargin(0.1 + 0.2, 0.3) // true
            */
            return Math.abs(left - right) &lt; Number.EPSILON * Math.pow(2, 2);
        }
        ,isInteger:function (x) { return (x^0) === x; /*用于确定x是否是整数*/}
        ,swap:function(a,b){
            /* 
                交换变量。
                a = [b,b=a][0]; 
                a = b - a + ( b = a);
                
                是数字直接计算性能高，非数字声明一个变量交换
            */
            if((a^0) === a){
                a=a+b;
                b=a-b;
                a=a-b;
            }else{
                var tmp = a;
                a = b ;
                b = tmp;
            }
        }
        ,isIos: function() {
            var u = navigator.userAgent;
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                // return "Android";
                return false
            } else if (u.indexOf('iPhone') > -1) {//苹果手机
                // return "iPhone";
                return true
            } else if (u.indexOf('iPad') > -1) {//iPad
                // return "iPad";
                return false
            } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
                // return "Windows Phone";
                return false
            }else{
                return false
            }
        }
        ,isPC:function() { //是否为PC端
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
        ,browserType:function(){
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) return "IE7"
                else if(fIEVersion == 8) return "IE8";
                else if(fIEVersion == 9) return "IE9";
                else if(fIEVersion == 10) return "IE10";
                else return "IE7以下"//IE版本过低
            }
            if (isIE11) return 'IE11';
            if (isEdge) return "Edge";
            if (isFF) return "FF";
            if (isOpera) return "Opera";
            if (isSafari) return "Safari";
            if (isChrome) return "Chrome";
        }
        ,checkStr:function (str, type) {
            switch (type) {
                case 'phone':   //手机号码
                    return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
                case 'tel':     //座机
                    return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
                case 'card':    //身份证
                    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
                case 'pwd':     //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
                    return /^[a-zA-Z]\w{5,17}$/.test(str)
                case 'postal':  //邮政编码
                    return /[1-9]\d{5}(?!\d)/.test(str);
                case 'QQ':      //QQ号
                    return /^[1-9][0-9]{4,9}$/.test(str);
                case 'email':   //邮箱
                    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
                case 'money':   //金额(小数点2位)
                    return /^\d*(?:\.\d{0,2})?$/.test(str);
                case 'URL':     //网址
                    return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str)
                case 'IP':      //IP
                    return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
                case 'date':    //日期时间
                    return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str)
                case 'number':  //数字
                    return /^[0-9]$/.test(str);
                case 'english': //英文
                    return /^[a-zA-Z]+$/.test(str);
                case 'chinese': //中文
                    return /^[\u4E00-\u9FA5]+$/.test(str);
                case 'lower':   //小写
                    return /^[a-z]+$/.test(str);
                case 'upper':   //大写
                    return /^[A-Z]+$/.test(str);
                case 'HTML':    //HTML标记
                    return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
                default:
                    return true;
            }
        }
        ,isCardID:function(sId) {
            // 严格的身份证校验
            if (!/(^\d{15}$)|(^\d{17}(\d|X|x)$)/.test(sId)) {
                alert('你输入的身份证长度或格式错误')
                return false
            }
            //身份证城市
            var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
            if(!aCity[parseInt(sId.substr(0,2))]) { 
                alert('你的身份证地区非法')
                return false
            }

            // 出生日期验证
            var sBirthday=(sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2))).replace(/-/g,"/"),
                d = new Date(sBirthday)
            if(sBirthday != (d.getFullYear()+"/"+ (d.getMonth()+1) + "/" + d.getDate())) {
                alert('身份证上的出生日期非法')
                return false
            }

            // 身份证号码校验
            var sum = 0,
                weights =  [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                codes = "10X98765432"
            for (var i = 0; i < sId.length - 1; i++) {
                sum += sId[i] * weights[i];
            }
            var last = codes[sum % 11]; //计算出来的最后一位身份证号码
            if (sId[sId.length-1] != last) { 
                alert('你输入的身份证号非法')
                return false
            }

            return true
        }
        ,reverse:function(arr){
            arr.reverse();//翻转数组本身
            return arr;
        }
        ,contains:function(arr, val) {
            /*判断一个元素是否在数组中*/
            return arr.indexOf(val) != -1 ? true : false;
        }
        ,sort:function(arr, type) {
            type= type || 1;
            /**
             * @param  {arr} 数组
             * @param  {type} 1：从小到大   2：从大到小   3：随机
             * @return {Array}
             */
            return arr.sort(function(a, b){
                switch(type) {
                    case 1:
                        return a - b;
                    case 2:
                        return b - a;
                    case 3:
                        return Math.random() - 0.5;
                    default:
                        return arr;
                }
            })
        }
        ,unique:function(arr) {
            /*去重*/
            if ( Array.hasOwnProperty('from') ) {
                return Array.from(new Set(arr));
            }else{
                var n = {},r=[]; 
                for(var i = 0; i < arr.length; i++){
                    if (!n[arr[i]]){
                        n[arr[i]] = true; 
                        r.push(arr[i]);
                    }
                }
                return r;
            }
            // 注：上面 else 里面的排重并不能区分 2 和 '2'，但能减少用indexOf带来的性能,暂时没找到替代的方法。。。 
        }
        ,unique2:function(arr) {
            /* 正确排重
             */
            if ( Array.hasOwnProperty('from') ) {
                return Array.from(new Set(arr))
            }else{
                var r = [], NaNBol = true
                for(var i=0; i < arr.length; i++) {
                    if (arr[i] !== arr[i]) {
                        if (NaNBol && r.indexOf(arr[i]) === -1) {
                            r.push(arr[i])
                            NaNBol = false
                        }
                    }else{
                        if(r.indexOf(arr[i]) === -1) r.push(arr[i])
                    }
                }
                return r
            }
        }
        ,union:function(a, b) {
            /*求两个集合的并集*/
            var newArr = a.concat(b);
            return this.unique(newArr);
        }
        ,intersect:function(a, b) {
            /*求两个集合的交集*/
            var _this = this;
            a = this.unique(a);
            return this.map(a, function(o) {
                return _this.contains(b, o) ? o : null;
            });
        }
        ,remove:function(arr, ele) {
        /*删除其中一个元素*/
            var index = arr.indexOf(ele);
            if(index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        }
        ,formArray:function(ary) {
        /*将类数组转换为数组的方法*/
            var arr = [];
            if(Array.isArray(ary)) {
                arr = ary;
            } else {
                arr = Array.prototype.slice.call(ary);
            };
            return arr;
        }
        ,max:function (arr) {
        /*最大值*/
            return Math.max.apply(null, arr);
        }
        ,min:function (arr) {
        /*最小值*/
            return Math.min.apply(null, arr);
        }
        ,sum:function (arr) {
        /*求和*/
            return arr.reduce( (pre, cur) => {
                return pre + cur
            })
        }
        ,average:function (arr) {
        /*平均值*/
            return this.sum(arr)/arr.length
        }
        ,trim:function(str, type) {
            /**
             * 去除空格
             * @param  {str}
             * @param  {type} 
             *       type:  1-所有空格  2-前后空格  3-前空格 4-后空格
             * @return {String}
             */
            type = type || 1
            switch (type) {
                case 1:
                    return str.replace(/\s+/g, "");
                case 2:
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                case 3:
                    return str.replace(/(^\s*)/g, "");
                case 4:
                    return str.replace(/(\s*$)/g, "");
                default:
                    return str;
            }
        }
        ,changeCase:function(str, type) {
            /**
             * @param  {str} 
             * @param  {type}
             *       type:  1:首字母大写  2：首页母小写  3：大小写转换  4：全部大写  5：全部小写
             * @return {String}
             */
            type = type || 4
            switch (type) {
                case 1:
                    return str.replace(/\b\w+\b/g, function (word) {
                        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();

                    });
                case 2:
                    return str.replace(/\b\w+\b/g, function (word) {
                        return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
                    });
                case 3:
                    return str.split('').map( function(word){
                        if (/[a-z]/.test(word)) {
                            return word.toUpperCase();
                        }else{
                            return word.toLowerCase()
                        }
                    }).join('')
                case 4:
                    return str.toUpperCase();
                case 5:
                    return str.toLowerCase();
                default:
                    return str;
            }
        }
        ,checkPwd:function(str) {
            /*
                检测密码强度
            */
            var Lv = 0;
            if (str.length < 6) {
                return Lv
            }
            if (/[0-9]/.test(str)) {
                Lv++
            }
            if (/[a-z]/.test(str)) {
                Lv++
            }
            if (/[A-Z]/.test(str)) {
                Lv++
            }
            if (/[\.|-|_]/.test(str)) {
                Lv++
            }
            return Lv;
        }
        ,filterTag:function(str) {
        /*过滤html代码(把<>转换)*/
            str = str.replace(/&/ig, "&amp;");
            str = str.replace(/</ig, "&lt;");
            str = str.replace(/>/ig, "&gt;");
            str = str.replace(" ", " ");
            return str;
        }
        ,random:function(min, max) {
            /*随机数范围*/
            if (arguments.length === 2) {
                return Math.floor(min + Math.random() * ( (max+1) - min ))
            }else{
                return null;
            }
        }
        ,numberToChinese:function(num) {
            /*将阿拉伯数字翻译成中文的大写数字*/
            var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
            var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
            var a = ("" + num).replace(/(^0*)/g, "").split("."),
                k = 0,
                re = "";
            for(var i = a[0].length - 1; i >= 0; i--) {
                switch(k) {
                    case 0:
                        re = BB[7] + re;
                        break;
                    case 4:
                        if(!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$")
                            .test(a[0]))
                            re = BB[4] + re;
                        break;
                    case 8:
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }
                if(k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0)
                    re = AA[0] + re;
                if(a[0].charAt(i) != 0)
                    re = AA[a[0].charAt(i)] + BB[k % 4] + re;
                k++;
            }

            if(a.length > 1) // 加上小数部分(如果有小数部分)
            {
                re += BB[6];
                for(var i = 0; i < a[1].length; i++)
                    re += AA[a[1].charAt(i)];
            }
            if(re == '一十')
                re = "十";
            if(re.match(/^一/) && re.length == 3)
                re = re.replace("一", "");
            return re;
        }
        ,changeToChinese:function(Num) {
            /**将数字转换为大写金额**/
        
            //判断如果传递进来的不是字符的话转换为字符
            if(typeof Num == "number") {
                Num = new String(Num);
            };
            Num = Num.replace(/,/g, "") //替换tomoney()中的“,”
            Num = Num.replace(/ /g, "") //替换tomoney()中的空格
            Num = Num.replace(/￥/g, "") //替换掉可能出现的￥字符
            if(isNaN(Num)) { //验证输入的字符是否为数字
                //alert("请检查小写金额是否正确");
                return "";
            };
            //字符处理完毕后开始转换，采用前后两部分分别转换
            var part = String(Num).split(".");
            var newchar = "";
            //小数点前进行转化
            for(var i = part[0].length - 1; i >= 0; i--) {
                if(part[0].length > 10) {
                    return "";
                    //若数量超过拾亿单位，提示
                }
                var tmpnewchar = ""
                var perchar = part[0].charAt(i);
                switch(perchar) {
                    case "0":
                        tmpnewchar = "零" + tmpnewchar;
                        break;
                    case "1":
                        tmpnewchar = "壹" + tmpnewchar;
                        break;
                    case "2":
                        tmpnewchar = "贰" + tmpnewchar;
                        break;
                    case "3":
                        tmpnewchar = "叁" + tmpnewchar;
                        break;
                    case "4":
                        tmpnewchar = "肆" + tmpnewchar;
                        break;
                    case "5":
                        tmpnewchar = "伍" + tmpnewchar;
                        break;
                    case "6":
                        tmpnewchar = "陆" + tmpnewchar;
                        break;
                    case "7":
                        tmpnewchar = "柒" + tmpnewchar;
                        break;
                    case "8":
                        tmpnewchar = "捌" + tmpnewchar;
                        break;
                    case "9":
                        tmpnewchar = "玖" + tmpnewchar;
                        break;
                }
                switch(part[0].length - i - 1) {
                    case 0:
                        tmpnewchar = tmpnewchar + "元";
                        break;
                    case 1:
                        if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
                        break;
                    case 2:
                        if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
                        break;
                    case 3:
                        if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
                        break;
                    case 4:
                        tmpnewchar = tmpnewchar + "万";
                        break;
                    case 5:
                        if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
                        break;
                    case 6:
                        if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
                        break;
                    case 7:
                        if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
                        break;
                    case 8:
                        tmpnewchar = tmpnewchar + "亿";
                        break;
                    case 9:
                        tmpnewchar = tmpnewchar + "拾";
                        break;
                }
                var newchar = tmpnewchar + newchar;
            }
            //小数点之后进行转化
            if(Num.indexOf(".") != -1) {
                if(part[1].length > 2) {
                    // alert("小数点之后只能保留两位,系统将自动截断");
                    part[1] = part[1].substr(0, 2)
                }
                for(i = 0; i < part[1].length; i++) {
                    tmpnewchar = ""
                    perchar = part[1].charAt(i)
                    switch(perchar) {
                        case "0":
                            tmpnewchar = "零" + tmpnewchar;
                            break;
                        case "1":
                            tmpnewchar = "壹" + tmpnewchar;
                            break;
                        case "2":
                            tmpnewchar = "贰" + tmpnewchar;
                            break;
                        case "3":
                            tmpnewchar = "叁" + tmpnewchar;
                            break;
                        case "4":
                            tmpnewchar = "肆" + tmpnewchar;
                            break;
                        case "5":
                            tmpnewchar = "伍" + tmpnewchar;
                            break;
                        case "6":
                            tmpnewchar = "陆" + tmpnewchar;
                            break;
                        case "7":
                            tmpnewchar = "柒" + tmpnewchar;
                            break;
                        case "8":
                            tmpnewchar = "捌" + tmpnewchar;
                            break;
                        case "9":
                            tmpnewchar = "玖" + tmpnewchar;
                            break;
                    }
                    if(i == 0) tmpnewchar = tmpnewchar + "角";
                    if(i == 1) tmpnewchar = tmpnewchar + "分";
                    newchar = newchar + tmpnewchar;
                }
            }
            //替换所有无用汉字
            while(newchar.search("零零") != -1)
                newchar = newchar.replace("零零", "零");
            newchar = newchar.replace("零亿", "亿");
            newchar = newchar.replace("亿万", "亿");
            newchar = newchar.replace("零万", "万");
            newchar = newchar.replace("零元", "元");
            newchar = newchar.replace("零角", "");
            newchar = newchar.replace("零分", "");
            if(newchar.charAt(newchar.length - 1) == "元") {
                newchar = newchar + "整"
            }
            return newchar;
        }
        ,setCookie:function(name, value, day) {
            /*设置cookie*/
            var setting = arguments[0];
            if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
                for (var i in setting) {
                    var oDate = new Date();
                    oDate.setDate(oDate.getDate() + day);
                    document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
                }
            }else{
                var oDate = new Date();
                oDate.setDate(oDate.getDate() + day);
                document.cookie = name + '=' + value + ';expires=' + oDate;
            }

        }
        ,getCookie:function(name) {
            /*获取cookie*/
            var arr = document.cookie.split('; ');
            for (var i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split('=');
                if (arr2[0] == name) {
                    return arr2[1];
                }
            }
            return '';
        }
        ,removeCookie:function(name) {
            /*删除cookie*/
            this.setCookie(name, 1, -1);
        }
        ,setLocal:function(key, val) {
            /*设置localStorage*/
            var setting = arguments[0];
            if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
                for(var i in setting){
                    window.localStorage.setItem(i, JSON.stringify(setting[i]))
                }
            }else{
                window.localStorage.setItem(key, JSON.stringify(val))
            }
        }
        ,getLocal:function(key) { 
            /*获取localStorage*/
            if (key) return JSON.parse(window.localStorage.getItem(key))
            return null;

        }
        ,removeLocal:function(key) {
            /*移除localStorage*/
            window.localStorage.removeItem(key)
        }
        ,clearLocal:function() {
            /*移除所有localStorage*/
            window.localStorage.clear()
        }
        ,setSession:function(key, val) {
            /*设置sessionStorage*/
            var setting = arguments[0];
            if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object'){
                for(var i in setting){
                    window.sessionStorage.setItem(i, JSON.stringify(setting[i]))
                }
            }else{
                window.sessionStorage.setItem(key, JSON.stringify(val))
            }

        }
        ,getSession:function(key) {
            /*获取sessionStorage*/
            if (key) return JSON.parse(window.sessionStorage.getItem(key))
            return null;

        }
        ,removeSession:function(key) {
            /*移除sessionStorage*/
            window.sessionStorage.removeItem(key)
        }
        ,clearSession:function() {
            /*移除所有sessionStorage*/
            window.sessionStorage.clear()
        }
        ,getQueryString:function (name) {
            //获取导航栏携带参数的方法
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if(r != null) {
                if(name == "type") {
                    return decodeURI(r[2]);//解决中文乱码
                }else{
                    return unescape(r[2]);
                }
            }
            return null;
        }
        ,getURL:function(name){
            /*获取网址参数*/
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = decodeURI(window.location.search).substr(1).match(reg);
            if(r!=null) return  r[2]; return null;
        }
        ,getUrlAllParams:function(url) {
            /*获取全部url参数,并转换成json对象*/
            var url = url ? url : window.location.href;
            var _pa = url.substring(url.indexOf('?') + 1),
                _arrS = _pa.split('&'),
                _rs = {};
            for (var i = 0, _len = _arrS.length; i < _len; i++) {
                var pos = _arrS[i].indexOf('=');
                if (pos == -1) {
                    continue;
                }
                var name = _arrS[i].substring(0, pos),
                    value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
                _rs[name] = value;
            }
            return _rs;
        }
        ,delParamsUrl:function(url, name){
            /*删除url指定参数，返回url*/
            var baseUrl = url.split('?')[0] + '?';
            var query = url.split('?')[1];
            if (query.indexOf(name)>-1) {
                var obj = {}
                var arr = query.split("&");
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].split("=");
                    obj[arr[i][0]] = arr[i][1];
                };
                delete obj[name];
                var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
                return url
            }else{
                return url;
            }
        }
        ,getRandomColor:function() {
            /*获取十六进制随机颜色*/
            return '#' + (function(h) {
                return new Array(7 - h.length).join("0") + h;
            })((Math.random() * 0x1000000 << 0).toString(16));
        }
        ,imgLoadAll:function(arr,callback){
            /*图片加载*/
            var arrImg = []; 
            for (var i = 0; i < arr.length; i++) {
                var img = new Image();
                img.src = arr[i];
                img.onload = function(){
                    arrImg.push(this);
                    if (arrImg.length == arr.length) {
                        callback && callback();
                    }
                }
            }
        }
        ,loadAudio:function(src, callback) {
            /*音频加载*/
            var audio = new Audio(src);
            audio.onloadedmetadata = callback;
            audio.src = src;
        }
        ,domToStirng:function(htmlDOM){
            /*DOM转字符串*/
            var div= document.createElement("div");
            div.appendChild(htmlDOM);
            return div.innerHTML
        }
        ,stringToDom:function(htmlString){
            /*字符串转DOM*/
            var div= document.createElement("div");
            div.innerHTML=htmlString;
            return div.children[0];
        }
        ,setCursorPosition:function(dom,val,posLen) {
            /**
             * 光标所在位置插入字符，并设置光标位置
             * 
             * @param {dom} 输入框
             * @param {val} 插入的值
             * @param {posLen} 光标位置处在 插入的值的哪个位置
             */
            var cursorPosition = 0;
            if(dom.selectionStart){
                cursorPosition = dom.selectionStart;
            }
            this.insertAtCursor(dom,val);
            dom.focus();
            console.log(posLen)
            dom.setSelectionRange(dom.value.length,cursorPosition + (posLen || val.length));
        }
        ,insertAtCursor:function(dom, val) {
            /*光标所在位置插入字符*/
            if (document.selection){
                dom.focus();
                sel = document.selection.createRange();
                sel.text = val;
                sel.select();
            }else if (dom.selectionStart || dom.selectionStart == '0'){
                var startPos = dom.selectionStart;
                var endPos = dom.selectionEnd;
                var restoreTop = dom.scrollTop;
                dom.value = dom.value.substring(0, startPos) + val + dom.value.substring(endPos, dom.value.length);
                if (restoreTop > 0){
                    dom.scrollTop = restoreTop;
                }
                dom.focus();
                dom.selectionStart = startPos + val.length;
                dom.selectionEnd = startPos + val.length;
            } else {
                dom.value += val;
                dom.focus();
            }
        }
    }
    window.UTIL_SU = UTIL_SU;
    return UTIL_SU;
});