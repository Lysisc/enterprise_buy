// 'use strict';

// ;(function () {
//   var _gaq = window._gaq || [];
//   _gaq.push(['_setAccount', 'UA-3748357-1']);
//   _gaq.push(['_setDomainName', '.ctrip.com']);
//   _gaq.push(['_setAllowHash', false]);
//   _gaq.push(['_addOrganic', 'soso', 'w']);
//   _gaq.push(['_addOrganic', 'sogou', 'query']);
//   _gaq.push(['_addOrganic', 'youdao', 'q']);
//   _gaq.push(['_addOrganic', 'so.360.cn', 'q']); //添加360搜索
//   _gaq.push(['_addOrganic', 'so.com', 'q']); //添加360搜索另一域名
//   _gaq.push(['_addOrganic', 'm.baidu.com', 'word']);
//   _gaq.push(['_addOrganic', 'wap.baidu.com', 'word']);
//   _gaq.push(['_addOrganic', 'wap.soso.com', 'key']); //
//   _gaq.push(['_trackPageview']);
//   window._gaq = _gaq;

//   var ga = document.createElement('script');
//   ga.type = 'text/javascript';
//   ga.async = true;
//   ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//   var script = document.getElementsByTagName('script')[0];
//   script.parentNode.insertBefore(ga, script);
// })();

var UA = navigator.userAgent.toLowerCase();

if (!/webkit/i.test(UA)) {
    alert('请使用最新版本的chrome浏览器浏览本站！');
}
