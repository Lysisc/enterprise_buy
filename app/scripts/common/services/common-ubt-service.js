(function () {

  /**
   * H5 UBT 统计 service
   *
   * 使用时需要引入 $ubt 
   *
   * 用法示例:
   *
   * $ubt.setPageId({
   *   hybrid: 10086,
   *   browser: 95555
   * });
   * 
   * .....
   * 
   * $ubt.send();
   *
   * 提供的方法:
   * 
   * setPageId
   * 
   * 设置当前页面或视图的 page_id
   * arg: Object 类型,
   * arg.hybrid: Number 类型, 用于 Hybrid 的 page_id,
   * arg.browser: Number 类型, 用于 Mobile Browser 的 page_id
   * 
   * send
   * 
   * 需要先 setPageId
   * 开始发送 UBT 统计数据
   *
   * reset
   * 
   * 重置统计参数, UBT 这坑爹货没有提供停止统计的方法, 目前路由变化时会自动执行
   */
 
  /**
   * @source  http://webresint.sh.ctriptravel.com/code/ubt/_bfa.min.js
   * @doc     http://cdataportal.sh.ctripcorp.com/fx/ubtcheck/doc_yw.html
   * 
   * 包含的 UBT 脚本不定期更新
   * ugly, stable, fast.
   */

  // --------- UBT SCRIPT START -------- //

  /**
   * Ctrip JavaScript Code
   * http://www.ctrip.com/
   * Copyright(C) 2008 - 2014, Ctrip All rights reserved.
   * Version: 140728
   * Date: 2014-07-28
   */

;(function(f,H){try{if(!f.$_bf||!0!==f.$_bf.loaded){f.$_bf=f.$_bf||{};f.$_bf.version="2.0.18";f.$_bf.loaded=!0;var k=f.document,u=k.location,c=c||{},I=Object.prototype.toString,w=function(){},C={undefined:"undefined",number:"number","boolean":"boolean",string:"string","[object Function]":"function","[object RegExp]":"regexp","[object Array]":"array","[object Date]":"date","[object Error]":"error","[object Object]":"object"};c.PROTOCOL=-1!=u.protocol.indexOf("file:")?"http:":u.protocol;c.ENV=f.$_bf.env||
"online";c.ishttps="https:"==c.PROTOCOL?!0:!1;c.CFG={domain:u.hostname.split(".").slice(-2).join(".")||"ctrip.com",referrer:!1,cv1:!1,orderID:"",cookiePath:"/",surl:c.PROTOCOL+"//s.c-ctrip.com/",href:u.href,dCollect:{},delay:0,debug:!1};c.now=Date.now||function(){return(new Date).getTime()};c.type=function(a){return C[typeof a]||C[I.call(a)]||(a?"object":"null")};c.isArray=function(a){return"array"===c.type(a)};c.isFunction=function(a){return"function"===c.type(a)};c.isNumber=function(a){return"number"===
typeof a&&isFinite(a)};c.isEmpty=function(a){return a===H||"-"==a||""==a};c.getRand=function(){return(""+Math.random()).slice(-8)};c.hash=function(a){var b=1,e=0,d;if(!c.isEmpty(a))for(b=0,d=a.length-1;0<=d;d--)e=a.charCodeAt(d),b=(b<<6&268435455)+e+(e<<14),e=b&266338304,b=0!=e?b^e>>21:b;return b};c.$=function(a){return k.getElementById(a)};c.$v=function(a){return(a=c.$(a))&&a.value||""};c.encode=function(a){return encodeURIComponent(a)};c.decode=function(a){return decodeURIComponent(a)};c.contains=
function(a,b){return-1<a.indexOf(b)};c.getCookie=function(a,b,e){return(a=k.cookie.match(RegExp("(^| )"+a+"=([^;]*)(;|$)")))?e?c.decode(a[2]):a[2]:b||""};c.getCookieObj=function(a,b){var e={__k:a},d=[],g;if(d=c.getCookie(a,"",b))for(var d=d.split("&")||[],l=0;l<d.length;l++)g=d[l].split("="),1<g.length&&(e[g[0]]=g[1]);return e};c.setCookie=function(a,b,e){var d=c.CFG.domain?";domain="+c.CFG.domain:"",g="";0<=e&&(g=";expires="+(new Date(c.now()+e)).toUTCString());k.cookie=a+"="+c.encode(b)+d+";path=/"+
g};c.getItem=function(a){};c.get=function(a,b){var e,d={};b=b||{};d.v=b.v||"";d.w=b.w||"default";d.l=b.l||0;d.t=b.t||"string";switch(d.w){case "input":e=c.$v(a);break;case "cookie":e=c.getCookie(a,d.v);break;case "function":e=c.isFunction(d.v)?d.v():"";break;case "object":break;default:e=d.v}switch(d.t){case "number":return parseInt(d.v,10)||0;case "boolean":return!!e;default:return d.l?String(e).substring(0,d.l):e}};c.getXpath=function(a){for(var b=[],e=0;a;){var c=b,g=e++,l=a.nodeName,f;a:{f=0;
if(a.parentNode)for(var m=a.parentNode.firstChild;m;){if(m==a){f=0==f?"":"["+(f+1)+"]";break a}1==m.nodeType&&m.tagName==a.tagName&&f++;m=m.nextSibling}f=""}c[g]=l+f;if("HTML"!=a.tagName.toUpperCase())a=a.parentNode;else break}b=b.reverse();return b.join("/")};c.CLI=function(){var a=f.screen,b=f.navigator,e=a?a.colorDepth+"-bit":"",d=(b&&b.language?b.language:b&&b.browserLanguage?b.browserLanguage:"").toLowerCase(),g=b&&b.javaEnabled()?1:0;return{s:a,c:e,l:d,j:g,getRefer:function(){if(c.CFG.referrer)return c.CFG.referrer;
var a="";try{a=k&&k.referrer}catch(b){}if(!a)try{f.opener&&(a=f.opener.location&&f.opener.location.href)}catch(e){}c.CFG.referrer=String(a).substring(0,500);return c.CFG.referrer},getHash:function(){for(var l=f.history.length,h=[b.appName,b.appVersion,d,b.platform,b.userAgent,g,a.width+a.height,e,k.cookie?k.cookie:"",k.referrer?k.referrer:""].join(""),m=h.length;0<l;)h+=l--^m++;return c.hash(h)}}}();c.send=function(a,b){var e=c.CFG.debug?"http://localhost/bf.gif":c.CFG.surl+"bf.gif",e=e+("?"+a+"&rd="+
c.getRand()+"&mt="+c.now()+"&jv=2.0.18");c.isFunction(b)||(b=w);var d=new Image;d.width=1;d.height=1;d.onload=function(){d=d.onerror=d.onload=null;b(1)};d.onerror=function(){d=d.onerror=d.onload=null;b(0)};d.src=e};c.on=function(){return k.addEventListener?function(a,b,e,c){a.addEventListener(b,e,c||!1)}:k.attachEvent?function(a,b,e){a.attachEvent("on"+b,e)}:w}();c.isSupportStorage=function(){var a=!1;if("undefined"!=typeof Storage)try{f.localStorage.setItem("_tmptest","tmpval"),a=!0,f.localStorage.removeItem("_tmptest")}catch(b){}return a?
!0:!1}();c.isSupportCookie=!0;c._union_=!1;(function(){try{var a=document.createElement("script");a.type="text/javascript";a.onload=function(){a=a.onload=a.onerror=null;c._union_=!0};a.onerror=function(){a=a.onload=a.onerror=null;c._union_=!0};a.src=c.PROTOCOL+"//webresource.c-ctrip.com/ResUnionOnline/R7/common/h5redirect.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}catch(e){c._union_=!0}})();(function(){function a(a){return 10>a?"0"+a:a}function b(a){d.lastIndex=
0;return d.test(a)?'"'+a.replace(d,function(a){var b=f[a];return"string"===typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function e(a,c){var d,f,s,x,k=g,p,n=c[a];n&&"object"===typeof n&&"function"===typeof n.toJSON&&(n=n.toJSON(a));"function"===typeof h&&(n=h.call(c,a,n));switch(typeof n){case "string":return b(n);case "number":return isFinite(n)?String(n):"null";case "boolean":case "null":return String(n);case "object":if(!n)return"null";g+=l;p=[];if("[object Array]"===
Object.prototype.toString.apply(n)){x=n.length;for(d=0;d<x;d+=1)p[d]=e(d,n)||"null";s=0===p.length?"[]":g?"[\n"+g+p.join(",\n"+g)+"\n"+k+"]":"["+p.join(",")+"]";g=k;return s}if(h&&"object"===typeof h)for(x=h.length,d=0;d<x;d+=1)"string"===typeof h[d]&&(f=h[d],(s=e(f,n))&&p.push(b(f)+(g?": ":":")+s));else for(f in n)Object.prototype.hasOwnProperty.call(n,f)&&(s=e(f,n))&&p.push(b(f)+(g?": ":":")+s);s=0===p.length?"{}":g?"{\n"+g+p.join(",\n"+g)+"\n"+k+"}":"{"+p.join(",")+"}";g=k;return s}}if("object"===
typeof JSON&&"function"===typeof JSON.stringify)return c.JSON={stringify:JSON.stringify},!0;"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+a(this.getUTCMonth()+1)+"-"+a(this.getUTCDate())+"T"+a(this.getUTCHours())+":"+a(this.getUTCMinutes())+":"+a(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var d=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
g,l,f={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},h;c.JSON={};c.JSON.stringify=function(a,b,c){var d;l=g="";if("number"===typeof c)for(d=0;d<c;d+=1)l+=" ";else"string"===typeof c&&(l=c);if((h=b)&&"function"!==typeof b&&("object"!==typeof b||"number"!==typeof b.length))throw Error("JSON.stringify");return e("",{"":a})}})();(function(){if(!(document.visibilityState||document.webkitVisibilityState||document.mozVisibilityState)){document.hidden=!1;document.visibilityState=
"visible";var a=null,b=function(){document.createEvent?(a||(a=document.createEvent("HTMLEvents"),a.initEvent("visibilitychange",!0,!0)),document.dispatchEvent(a)):"object"==typeof Visibility&&Visibility._onChange.call(Visibility,{})},c=function(){document.hidden=!1;document.visibilityState="visible";b()},d=function(){document.hidden=!0;document.visibilityState="hidden";b()};document.addEventListener?(f.addEventListener("focus",c,!0),f.addEventListener("blur",d,!0)):(document.attachEvent("onfocusin",
c),document.attachEvent("onfocusout",d))}})();(function(a){var b=f.Visibility={onVisible:function(a){if(!b.isSupported()||!b.hidden())return a(),b.isSupported();var c=b.change(function(g,f){b.hidden()||(b.unbind(c),a())});return c},change:function(a){if(!b.isSupported())return!1;b._lastCallback+=1;var c=b._lastCallback;b._callbacks[c]=a;b._setListener();return c},unbind:function(a){delete b._callbacks[a]},afterPrerendering:function(a){if(!b.isSupported()||"prerender"!=b.state())return a(),b.isSupported();
var c=b.change(function(g,f){"prerender"!=f&&(b.unbind(c),a())});return c},hidden:function(){return b._prop("hidden",!1)},state:function(){return b._prop("visibilityState","visible")},isSupported:function(){return b._prefix()!=a},_doc:f.document,_prefixes:["webkit","moz"],_chechedPrefix:null,_listening:!1,_lastCallback:-1,_callbacks:{},_hiddenBefore:!1,_init:function(){b._hiddenBefore=b.hidden()},_prefix:function(){if(null!==b._chechedPrefix)return b._chechedPrefix;if(b._doc.visibilityState!=a)return b._chechedPrefix=
"";for(var c,d=0;d<b._prefixes.length;d++)if(c=b._prefixes[d]+"VisibilityState",b._doc[c]!=a)return b._chechedPrefix=b._prefixes[d]},_name:function(a){var c=b._prefix();return""==c?a:c+a.substr(0,1).toUpperCase()+a.substr(1)},_prop:function(a,c){return b.isSupported()?b._doc[b._name(a)]:c},_onChange:function(a){var c=b.state(),g;for(g in b._callbacks)b._callbacks[g].call(b._doc,a,c);b._hiddenBefore=b.hidden()},_setListener:function(){if(!b._listening){var a=b._prefix()+"visibilitychange",c=function(){b._onChange.apply(Visibility,
arguments)};b._doc.addEventListener?b._doc.addEventListener(a,c,!1):b._doc.attachEvent(a,c);b._listening=!0;b._hiddenBefore=b.hidden()}}};b._init()})();var y={_env:/((test[a-z]?|dev|uat|ui|local)\.sh\.(ctrip|huixuan)travel)|(qa\.nt\.ctripcorp)/i,_bfa:/^\d.+(\.\d+){2,}$/,_bfs:/^\d+\.\d+$/,_var:/\$\{(\w+)\}/g},r=function(){this.isEventInit=this.isPSSend=this.isPVSend=!1;this.enterTime=c.now();this.commonData=[];this.eSkip=this.pid=0;this.envInit_();this.init()};r.prototype={constructor:r,_QUEUE:[],
init:function(){this.isPVSend=!1;this.bfi=this.bfs=this.bfa=null;this.isLogin=this._isNewVisitor=0;this.readBfa();this.sessRead();this.readBfi()},envInit_:function(){var a=u.hostname;"test"==c.ENV||y._env.test(a)?c.CFG.surl=c.PROTOCOL+"//ubt.uat.qa.nt.ctripcorp.com/":"offline"==c.ENV&&(c.CFG.surl=c.PROTOCOL+"//ubt.sh.ctriptravel.com/");if(a=this.domainInit(a))c.CFG.domain=a},inputInit:function(){try{var a={},b=this;document.body.innerHTML.replace(/\bbf_ubt_([^ '"]*)/ig,function(e,g){var f=c.$v(e);
if(f){var h=g.split("_");h[0]&&"tl"==h[0]?("offline"==c.ENV?"callid"==h[1]&&b.sendData({k:"pvctm",v:'{"callid":"'+f+'"}'}):b._setPVCustom(h[1],f),a[h[1]]=f):(a[h[0]]=f,b.set_(h[0].toLowerCase(),f))}});"offline"==c.ENV&&a.eid&&b.sendData({k:"offline_order",v:'{"uid":"'+(a.uid||"")+'","orderid":"'+(a.orderid||"")+'","callid":"'+a.callid+'","eid":"'+a.eid+'","pid":${page_id},"order_type":"'+(a.ordertype||"")+'"}'})}catch(e){}},domainInit:function(a){a=a||location.hostname;if(/^(\d|\.)+$/.test(a))return a;
var b="",c=a.split(".").reverse(),b=c[1]+"."+c[0];/(?:\.co)m?\.\w{2,}$/i.test(a)&&(b=c[2]+"."+b);return b},uniqueId_:function(){return c.getRand()^c.CLI.getHash()&2147483647},plus_:function(a){return parseInt(a,10)+1},setItem:function(a,b,e){if(c.isSupportCookie)c.setCookie(a,b,e);else return!1},getItem:function(a,b,e){return c.isSupportCookie?c.getCookie(a,b,!0):""},readBfa:function(){var a=this.getItem("_bfa","",!0);a&&y._bfa.test(a)&&(a=a.split("."),6<a.length&&(this.bfa=a));this.bfa||(a=this.enterTime,
this.bfa=[1,a,this.uniqueId_().toString(36),1,a,a,0,0],this._isNewVisitor=1)},sessRead:function(){var a=this.getItem("_bfs","",!0);!this._isNewVisitor&&a&&y._bfs.test(a)?(this.bfs=a.split("."),this.bfs[1]=this.plus_(this.bfs[1])):(this.bfs=[1,1],this.bfa[4]=this.bfa[5],this.bfa[5]=this.enterTime,this.bfa[6]=this.plus_(this.bfa[6]));this.bfa[7]=this.plus_(this.bfa[7]);this.sessWrite()},sessWrite:function(){this.setItem("_bfa",this.bfa.join("."),63072E6);this.setItem("_bfs",this.bfs.join("."),18E5)},
readBfi:function(){var a,b,c={};if(a=this.getItem("_bfi","",!0)){a=a.split("&")||[];for(var d=0;d<a.length;d++)b=a[d].split("="),1<b.length&&(c[b[0]]=b[1])}this.ppi=c&&c.p1?c.p1:0;this.ppv=c&&c.v1?c.v1:0;this.bfi=c},updateBfi:function(){if(this.isPVSend){var a=this.get_("pvid");this.setItem("_bfi","p1="+this.pid+"&p2="+this.ppi+"&v1="+a+"&v2="+this.ppv)}},get_:function(a){if(this.bfa){var b=this.bfa;switch(a){case "vid":return b[1]+"."+b[2];case "sid":return parseInt(b[6],10)||0;case "pvid":return parseInt(b[7],
10)||0;case "fullpv":return b[1]+"."+b[2]+"."+b[6]+"."+b[7];default:return""}}},set_:function(a,b){switch(a){case "domain":this._setDomain(b);break;case "clickv1":this._setClickV1(b);break;case "collect":this._delCollect(b);break;case "referrer":this._setReferrer(b);break;case "orderid":this._setOrderID(b)}},getPid:function(a){if(!this.pid||a)this.pid=parseInt(c.$v("page_id"),10)||0;return this.pid},getABtest:function(){if(this.d_abtest)return this.d_abtest;for(var a=c.$("ab_testing_tracker"),b=[],
e="";a;)e+=a.value,b.push(a),a.removeAttribute("id"),a.removeAttribute("name"),a=c.$("ab_testing_tracker");for(a=0;a<b.length;a++)b[a].setAttribute("id","ab_testing_tracker");try{b="",(b=document.location.hash)&&-1!==b.indexOf("abtest=")&&(e+=decodeURIComponent(b.replace(/.*(abtest=)/i,"").replace(/#.*/i,"")))}catch(d){}return this.d_abtest=e.substring(0,280)},getPVparams:function(){if(this.d_pvparams)return this.d_pvparams;var a=c.getCookieObj("Session"),b=c.getCookieObj("CtripUserInfo"),e=c.getCookieObj("StartCity_Pkg"),
d=c.getCookieObj("Union"),a={engine:a&&a.SmartLinkCode?a.SmartLinkCode:"",keyword:a&&a.SmartLinkQuary?a.SmartLinkQuary:"",start_city:e&&e.PkgStartCity?e.PkgStartCity:"",alliance_id:d&&d.AllianceID?d.AllianceID:"",alliance_sid:d&&d.SID?d.SID:"",alliance_ouid:d&&d.OUID?d.OUID:"",user_grade:b&&b.VipGrade?b.VipGrade:"",duid:b&&b.U?b.U:"",zdata:c.get("zdatactrip",{w:"cookie",v:""}),callid:c.get("bf_ubt_tl_callid",{w:"input",v:""})};try{if(!a.alliance_id&&!a.alliance_sid&&c.isSupportStorage&&(d=localStorage.getItem("UNION"))){var f=
JSON.parse(d);(d=f.data)&&(f.st||f.timeout)&&(b=0,(b=f.st?new Date(f.st):new Date(f.timeout.replace(/-/g,"/")))&&b>=c.now()&&(a.alliance_id=d.AllianceID||d.ALLIANCEID||"",a.alliance_sid=d.SID||"",a.alliance_ouid=d.OUID||""))}}catch(h){}a.duid&&(this.isLogin=1);return this.d_pvparams=a},getCommon:function(a){if(a||4>this.commonData.length)this.commonData=[this.getPid(),this.get_("vid"),this.get_("sid"),this.get_("pvid"),c.get("CorrelationId",{w:"input",v:""}),this.getABtest()||"",c.get("bf_ubt_offline_mid",
{w:"input",v:""})];return this.commonData},getUinfo:function(){var a=this.getPVparams(),b=[],e="";try{e+="cl="+document.cookie.length,e+=",ckl="+(document.cookie.match(/[^=]+=[^;]*;?/g)||[]).length}catch(d){}b[0]=7;b[1]=parseInt(this.ppi,10)||0;b[2]=parseInt(this.ppv,10)||0;b[3]=String(c.CFG.href).substring(0,600);b[4]=c.CLI.s.width;b[5]=c.CLI.s.height;b[6]=e;b[7]=c.CLI.l;b[8]=a.engine;b[9]=a.keyword;b[10]=c.CLI.getRefer();b[11]=this.getABtest();b[12]=this._isNewVisitor;b[13]=this.isLogin;b[14]=c.get("login_uid",
{w:"cookie",v:""});b[15]=a.user_grade;b[16]=c.get("corpid",{w:"cookie",v:""});b[17]=a.start_city;b[18]=a.alliance_id;b[19]=a.alliance_sid;b[20]=a.alliance_ouid;b[21]=c.CFG.orderID;b[22]=a.duid;b[23]=a.zdata;b[24]=a.callid;b[25]=c.get("bid",{w:"cookie",v:""});return b},replaceParam:function(a){var b={duid:this.getPVparams().duid,page_id:this.getPid(),is_login:this.isLogin};return a.replace(y._var,function(a,c){return c in b?b[c]:a})},dataHandler:function(a){if("string"==typeof a)return a;if("object"==
typeof a){if(a.c&&a.d)return a={c:this.getCommon(),d:a.d},"ac=g&d="+c.encode(c.JSON.stringify(a));if(a.k&&a.v){var b=c.encode(this.replaceParam(a.v));return"ac=tl&pi="+this.getPid()+"&key="+a.k+"&val="+b+"&pv="+this.get_("fullpv")+"&v=6"}}return!1},sendData:function(a){if(this.isPVSend){var b=this.dataHandler(a);b&&c.send(b,a.callback||w)}else this._QUEUE.push(a)},sendPV:function(a){var b=this;if(this.isPVSend)return!0;try{var e={c:this.getCommon(!0),d:{uinfo:this.getUinfo()}},d="ac=g&d="+c.encode(c.JSON.stringify(e));
c.send(d,function(d){d&&(b.isPVSend=!0,b.queueSend_());c.isFunction(a)&&a(d)})}catch(f){}},queueSend_:function(){this.updateBfi();var a=this._QUEUE,b=a.length;if(b){for(var e=0;e<b;e++){var d=a[e],f=this.dataHandler(d);f&&c.send(f,d.callback||w)}this._QUEUE=[]}c.PVCTM&&this.sendData({k:"pvctm",v:c.JSON.stringify(c.PVCTM)});return!0},getPS:function(){for(var a="navigationStart redirectStart unloadEventStart unloadEventEnd redirectEnd fetchStart domainLookupStart domainLookupEnd connectStart connectEnd requestStart responseStart responseEnd domLoading domInteractive domContentLoadedEventStart domContentLoadedEventEnd domComplete loadEventStart loadEventEnd".split(" "),
b=f.performance.timing,c=[6],d=0;d<a.length;d++)c.push(b[a[d]]);c.push(f.performance.navigation.type||0);c.push(f.performance.navigation.redirectCount||0);return c},sendPS:function(){if(!(c.CFG.dCollect.performance||!f.performance||0>this.getPid())){var a=0,b=this;(function(){if(f.performance.timing.loadEventEnd&&!this.isPSSend){var e={c:b.getCommon(),d:{ps:b.getPS()}},e="ac=g&d="+c.encode(c.JSON.stringify(e));c.send(e);b.isPSSend=!0}else 300>a&&(a++,setTimeout(arguments.callee,300))})()}},bindSend:function(a){var b=
this;if(this.isEventInit)return!0;this.isEventInit=!0;this.inputInit();this.sendPV(a);Visibility.change(function(a,c){"visible"==c&&b.updateBfi()});this.sendPS();if(!c.CFG.dCollect.click)c.on(k,"mousedown",function(a){var b;b=a||f.event;var g="";if((a=b.target||b.srcElement)&&a.parentNode&&a!=k){a.getAttribute("_bfClick")&&(g=a.getAttribute("_bfClick"),g="CLICKTIME"==g?"CT"+10*Math.round((+new Date-v.enterTime)/1E4):g);var l=parseInt(Math.max(k.documentElement.clientWidth||k.body.clientWidth,k.documentElement.scrollWidth||
k.body.scrollWidth)/2,10),l="pageX"in b?b.pageX-l:b.clientX+(k.body.scrollLeft||k.documentElement.scrollLeft)-l;b="pageY"in b?b.pageY:b.clientY+(k.body.scrollTop||k.documentElement.scrollTop);a=["ac=record","pv="+h.get_("fullpv"),"pi="+h.getPid(),"ct="+c.now(),"x="+l,"y="+b,"xp="+c.encode((h.getABtest()?h.getABtest().toUpperCase()+"/":"")+c.getXpath(a).replace("HTML/","")),"ppi="+1*h.ppi,"va1="+c.encode(h.getABtest()),"va2="+c.encode(g),"va3="+c.encode(c.CFG.cv1||""),"v=6"].join("&");h.sendData(a)}},
!0)},_asynRefresh:function(a,b){if("object"==typeof a){"undefined"!=typeof a.page_id&&(this.pid=parseInt(a.page_id,10)||0);"undefined"!=typeof a.url&&c.contains(a.url,"http")&&(c.CFG.href=a.url);if("undefined"!=typeof a.orderid)this._setOrderID(a.orderid,!0);else{var e=c.$v("bf_ubt_orderid");e&&this._setOrderID(e,!0)}a.refer&&this._setReferrer(a.refer)}this.isEventInit?(this.init(),this.sendPV(b)):this.bindSend(b)},_setEnv:function(a){c.ENV=a||"online";this.envInit_()},_setDebug:function(a){c.CFG.debug=
!!a},_setDomain:function(a){c.CFG.domain=a},_setClickV1:function(a){c.CFG.cv1=a||""},_delCollect:function(a){},_setReferrer:function(a){c.CFG.referrer=a},_setOrderID:function(a,b){!a||c.CFG.orderID&&!b||(c.CFG.orderID=a)},_setPVCustom:function(a,b){c.PVCTM||(c.PVCTM={});c.PVCTM[a]=b},_tracklog:function(a,b,c){if("string"!=typeof b)return!1;this.sendData({k:a,v:b,callback:c||!1})},_trackError:function(a,b){if("object"!=c.type(a))return!1;if(this.eSkip&&"undefined"==typeof a.skip)return this.eSkip=
!1;!0===a.skip&&(this.eSkip=!0);for(var e="version message line file category framework time repeat islogin name column".split(" "),d=[7,"",0,"","","",c.now()-this.enterTime,1,this.isLogin,"",0],f=1,h=e.length;f<h;f++){var k=e[f];if(a[k]){var m=a[k]+"";switch(k){case "message":case "file":m=m.substring(0,500);break;case "category":case "framework":case "name":m=m.substring(0,100);break;case "time":m=parseInt(m,10);break;case "column":m=parseInt(m,10);break;default:m=parseInt(m,10)||0}d[f]=m}}e="";
a.stack?e=a.stack:"undefined"!=typeof cQuery&&c.isFunction(cQuery.trace)&&(e=cQuery.trace(),c.isArray(e)&&(e=e.join("")));e=e.slice(d.join("").length-2E3);d.push(e);this.sendData({c:!0,d:{error:d},callback:b||!1})},_trackUserBlock:function(a,b){if("object"!=typeof a)return!1;var c=[6];c[1]=this.isLogin;c[2]=String(a.message||"").substring(0,300);c[3]=String(a.value||"").substring(0,300);c[4]=String(a.type||"").substring(0,50);c[5]=String(a.dom||"").substring(0,100);c[6]=String(a.form||"").substring(0,
100);c[7]=parseInt(a.count||0,10)||0;this.sendData({c:!0,d:{ub:c},callback:b||!1})},_trackMatrix:function(a,b,e,d,f){d="number"==typeof d?d:c.now();var h=0;"string"===typeof a&&"object"===typeof b&&"number"===typeof e&&(a={name:a,tags:b,value:e,ts:d},a=[[1,"matrix"],this.getCommon(),[a]],a="ac=a&d="+c.encode(c.JSON.stringify(a)),c.send(a),h=1);c.isFunction(f)&&f(h)}};var h=new r,B=new function(){this.push=function(a){for(var b=arguments,c=0,d=b.length,f=0;f<d;f++)try{if("function"===typeof b[f])b[f]();
else{var l=b[f][0];"_"==l.substring(0,1)&&h[l].apply(h,b[f].slice(1))}}catch(k){c++}return c}},J=alert,D=0;(function(){try{f.alert=function(a){D++;B.push(["_trackUserBlock",{message:a,value:"alert",type:"function.alert",dom:"",form:"",count:D}]);J(a)}}catch(a){}})();var E=f.__bfi;if(E&&c.isArray(E))for(var K=f.__bfi.length,r=0;r<K;r++)B.push(f.__bfi[r]);else f.__bfi=[];f.__bfi.push=B.push;f.$_bf._getFullPV=function(){return h.get_("fullpv")};f.$_bf.tracklog=function(a,b,c){h._tracklog(a,b,c)};f.$_bf.trackError=
function(a,b){h._trackError(a,b)};f.$_bf._getStatue=function(){return{vid:h.get_("vid"),sid:h.get_("sid"),pvid:h.get_("pvid"),pid:h.getPid(),abtest:h.getABtest(),pv:h.isPVSend,ps:h.isPSSend}};f.$_bf.asynRefresh=function(a,b){h._asynRefresh(a,b)};var z=1,A=!1,F=function(){if(!A){if(c._union_){if("wait"!=c.$v("page_id")){if(0!=h.getPid()||"complete"===document.readyState)return A=!0,h.bindSend();var a=!1;try{a=null==f.frameElement&&document.documentElement}catch(b){}if(a&&a.doScroll)try{return a.doScroll("left"),
A=!0,h.bindSend()}catch(e){}}z=1}5<z&&(c._union_=!0);if(40<z)return h.bindSend();z++;setTimeout(F,500)}};F();c.on(f,"beforeunload",function(){h.bindSend()});if("null"==c.type(f.onerror)){var G={};f.onerror=function(){if("undefined"==typeof cQuery||!cQuery.config||!cQuery.config("allowDebug"))try{var a=arguments,b={message:""+a[0],file:""+a[1],line:a[2],category:"inner-error",framework:"normal",time:c.now()-h.enterTime,repeat:1},e=b.message+b.file+b.line;G[e]||(h._trackError(b),G[e]=!0)}catch(d){}}}(function(a){function b(a,
b){var c=null;return function(){var d=this,e=arguments;clearTimeout(c);c=setTimeout(function(){a.apply(d,e)},b)}}function e(){this._queue=[];this._init()}if("offline"!=c.ENV&&!c.ishttps&&"undefined"!=typeof JSON&&"function"==typeof JSON.stringify&&a.performance){var d=h.get_("vid");if(!d||5<c.hash(d)%100)return!1;var g={};(function(a){function b(a){var c=0,d=[],e=0;this.n=function(){if(0==e){if(c>=a.length)return null;var b=a.charCodeAt(c++);if(127>=b)return b;if(2047>=b)return d[1]=128|b&63,e=1,
192|b>>6&31;if(55296<=b&&57343>=b)throw"unsupported char code.";d[0]=128|b>>6&63;d[1]=128|b&63;e=2;return 224|b>>12&15}return d[d.length-e--]}}function c(a){var b=new function(a){for(var b=[],c=-1,d;null!=(d=a.n());)if(0==d[0]){if(-1==c||255==b[c])b.push(128),c=b.length-1;b.push(d[1]);b[c]++}else{c=-1;b.push(d[0]);var e=d[1];if(127>=e)b.push(e);else{for(d=[];0<e;)d.push(e&127),e>>=7;for(e=d.length-1;0<=e;e--)b.push(d[e]|128);b[b.length-1]&=127}}c=0;this.n=function(){return c>=b.length?null:b[c++]}}(new function(a){function b(a,
c){for(var d=0,e=0;e<h;e++)d=131*d+a[c+e];return d}for(var c=[],d=[],q=[],g,k=0,l,t;null!=(g=a.n());)q.push(g);this.n=function(){if(k<q.length-h+1){for(var a=b(q,k),g=t=l=0;g<d.length;g++)if(a==d[g]){var n,m;n=g;for(m=k;n<c.length&&m<q.length&&!(c[n]!=q[m]||m-k>=f);n++,m++);n-g>=t&&n-g>=h&&(t=n-g,l=g)}if(0==t)return a=[0,q[k]],g=q[k++],c.push(g),c.length>e&&(c.shift(),d.shift()),c.length>=h&&(g=c.length-h,d[g]=b(c,g)),a;k+=t;return[t,c.length-(l+t)]}return k<q.length?[0,q[k++]]:null}}(a));this.n=
function(){return b.n()}}function d(a){var b=[],c=0;this.n=function(){if(0<c)return b[4-c--];var d=[a.n(),a.n(),a.n()];if(null==d[0])return null;b[0]=g.charAt(d[0]>>2);b[1]=null==d[1]?g.charAt(d[0]<<4&63):g.charAt((d[0]<<4|d[1]>>4)&63);b[2]=null==d[1]?"~":null==d[2]?g.charAt(d[1]<<2&63):g.charAt((d[1]<<2|d[2]>>6)&63);b[3]=null==d[2]?"~":g.charAt(d[2]&63);c=3;return b[0]}}var e=1024,f=63,h=3,g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";a.compress=function(a){a=new b(a);a=new c(a);
a=new d(a);for(var e,f=[];null!=(e=a.n());)f[f.length]=e;return f.join("")}})(g);var l=a.document,k=l.documentElement,d="1.0.0".trim,m=l.addEventListener?function(a,b,c,d){a.addEventListener&&a.addEventListener(b,c,d)}:function(a,b,c){a.attachEvent&&a.attachEvent("on"+b,c)};d&&d.call("\ufeff\u00a0");e.prototype={constructor:e,_init:function(){var c=this;m(a,"scroll",b(function(a){c.collectScroll(a)},300));m(a,"resize",b(function(a){c.collectViewport(a)},500));m(l,"click",function(a){c.collectClick(a);
c.collectChange(a)},!0);this.collectViewport()},_sendData:function(a){var b=c.CFG.debug?"http://localhost/bf.gif?ac=a&d=":c.CFG.surl+"bf.gif?ac=a&d=",b=b+(g.compress(a)+"&jv=1.0.0"),d=new Image;d.onload=function(){d=d.onload=null};d.src=b},_getTagIndex:function(a){var b=0;if(a.parentNode)for(var c=a.parentNode.firstChild;c&&c!=a;)1==c.nodeType&&c.tagName==a.tagName&&b++,c=c.nextSibling;return 0<b?"["+ ++b+"]":""},_getXpath:function(a){for(var b=[],c=0,d;a&&9!=a.nodeType;){var e=a.nodeName+this._getTagIndex(a)+
(a.id?"[@id='"+a.id+"']":"");if(d=a.getAttribute("block"))e+="[@block='"+d+"']";b[c++]=e;a=a.parentNode}return b.reverse().join("/")},_push:function(a,b,c){this._queue.push({action:a,xpath:b,ts:c||+new Date});this._checkSend()},_checkSend:function(a){if(a||5<this._queue.length)a=[[1],[h.pid,h.get_("vid"),h.get_("sid"),h.get_("pvid")],this._queue],this._sendData(JSON.stringify(a)),this._queue=[]},_getFocus:function(){var a=l.activeElement;return a&&(a.type||a.href||~a.tabIndex)?a:null},collectChange:function(a){this._getFocus()},
collectViewport:function(a){this._push("viewport","HTML/BODY"+("[@w='"+(k.clientWidth||l.body.clientWidth)+"'][h='"+(k.clientHeight||l.body.clientHeight)+"']"))},collectScroll:function(a){a=Math.max(k.scrollLeft,l.body.scrollLeft);var b=Math.max(k.scrollTop,l.body.scrollTop);this._push("scroll","HTML/BODY"+("[@x='"+a+"'][@y='"+b+"']"))},collectClick:function(a){var b=a.target||a.srcElement,c=b.nodeName.toUpperCase();if(b.getBoundingClientRect){var d=b.getBoundingClientRect(),e="",f=Math.max(k.scrollLeft,
l.body.scrollLeft),g=Math.max(k.scrollTop,l.body.scrollTop),h=a.pageX||a.clientX+f;a=a.pageY||a.clientY+g;var m=parseInt((k.clientWidth||l.body.clientWidth)/2,10);"SELECT"==c&&0>a-d.top-g?(e+="[@x='"+parseInt(h+d.left+f-m,10)+"'][@y='"+parseInt(a+d.top,10)+"']",e=e+("[@rx='"+h+"']")+("[@ry='"+(a-g)+"']")):(e+="[@x='"+(h-m)+"'][@y='"+a+"']",e+="[@rx='"+parseInt(h-d.left-f,10)+"']",e+="[@ry='"+parseInt(a-d.top-g,10)+"']");this._push("click",this._getXpath(b)+e)}}};var r=new e;c.on(f,"beforeunload",
function(){r._checkSend(!0)})}})(f)}}catch(L){}})(window);

  // --------- UBT SCRIPT END -------- //

  // angular service wrapper

  angular.module('GSH5').factory('$ubt', ['$rootScope', 'ENV', function ($rootScope, ENV) {

    var service = {};

    var $ = function (selector) {
      if (document.querySelector) {
        return angular.element(document.querySelector(selector)); 
      }
    };

    // be default, page_id should be 'wait'
    service.page_id = 'wait';

    /**
     * Set Page Id
     *
     * 设置当前页面或视图的 page_id
     * arg: Object 类型,
     * arg.hybrid: Number 类型, 用于 Hybrid 的 page_id,
     * arg.browser: Number 类型, 用于 Mobile Browser 的 page_id
     */
    service.setPageId = function (arg) {

      arg = arg || {};

      var hybrid = arg.hybrid || 0;
      var browser = arg.browser || 0;
      var page_id = ENV.isHybrid ? hybrid : browser;
      var $el = $('#page_id') || {};

      if (page_id !== 0) {

        this.page_id = page_id;

        if ($el.length > 0) {
          $el.val(page_id);
        }
      }
    };

    /**
     * 开始发送 UBT 统计数据
     * @return {void}
     */
    service.send = function () {
      var self = this;

      if (this.page_id === 'wait' || this.page_id === 0) {
        return false;
      }

      if (typeof window.__bfi === 'undefined') {
        window.__bfi = [];
      }

      if (window.$_bf && window.$_bf.loaded === true) {
        window.$_bf.asynRefresh({
            page_id: self.page_id,
            url: window.location.href
        });
      }
    };

    /**
     * 重置统计参数, UBT 这坑爹货没有提供停止统计的方法, 目前路由变化时会自动执行
     * @return {[type]}
     */
    service.reset = function () {
      this.page_id = 'wait';

      $('#page_id').val(this.page_id);

      window.$_bf.asynRefresh({
        page_id: this.page_id,
        url: window.location.href
      });
    };

    /**
     * 路由变化时会自动重置统计参数
     * @return {void}
     */
    $rootScope.$on('$stateChangeStart', function () { 
      service.reset();
    });

    return service;
  }]);

})();