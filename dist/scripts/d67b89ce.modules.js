!function(a,b,c){"use strict";b.module("ngResource",["ng"]).factory("$resource",["$http","$parse",function(a,d){function e(a){return f(a,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function f(a,b){return encodeURIComponent(a).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,b?"%20":"+")}function g(a,b){this.template=a+="#",this.defaults=b||{};var c=this.urlParams={};k(a.split(/\W/),function(b){b&&new RegExp("(^|[^\\\\]):"+b+"\\W").test(a)&&(c[b]=!0)}),this.template=a.replace(/\\:/g,":")}function h(d,e,f){function p(a,b){var c={};return b=l({},e,b),k(b,function(b,d){c[d]=b.charAt&&"@"==b.charAt(0)?o(a,b.substr(1)):b}),c}function q(a){m(a||{},this)}var r=new g(d);return f=l({},i,f),k(f,function(d,e){d.method=b.uppercase(d.method);var f="POST"==d.method||"PUT"==d.method||"PATCH"==d.method;q[e]=function(b,c,e,g){var h,i={},o=j,s=null;switch(arguments.length){case 4:s=g,o=e;case 3:case 2:if(!n(c)){i=b,h=c,o=e;break}if(n(b)){o=b,s=c;break}o=c,s=e;case 1:n(b)?o=b:f?h=b:i=b;break;case 0:break;default:throw"Expected between 0-4 arguments [params, data, success, error], got "+arguments.length+" arguments."}var t=this instanceof q?this:d.isArray?[]:new q(h);return a({method:d.method,url:r.url(l({},p(h,d.params||{}),i)),data:h}).then(function(a){var b=a.data;b&&(d.isArray?(t.length=0,k(b,function(a){t.push(new q(a))})):m(b,t)),(o||j)(t,a.headers)},s),t},q.prototype["$"+e]=function(a,b,d){var g,h=p(this),i=j;switch(arguments.length){case 3:h=a,i=b,g=d;break;case 2:case 1:n(a)?(i=a,g=b):(h=a,i=b||j);case 0:break;default:throw"Expected between 1-3 arguments [params, success, error], got "+arguments.length+" arguments."}var k=f?this:c;q[e].call(this,h,k,i,g)}}),q.bind=function(a){return h(d,l({},e,a),f)},q}var i={get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}},j=b.noop,k=b.forEach,l=b.extend,m=b.copy,n=b.isFunction,o=function(a,b){return d(b)(a)};return g.prototype={url:function(a){var c,d,g=this,h=this.template;a=a||{},k(this.urlParams,function(f,i){c=a.hasOwnProperty(i)?a[i]:g.defaults[i],b.isDefined(c)&&null!==c?(d=e(c),h=h.replace(new RegExp(":"+i+"(\\W)","g"),d+"$1")):h=h.replace(new RegExp("(/?):"+i+"(\\W)","g"),function(a,b,c){return"/"==c.charAt(0)?c:b+c})}),h=h.replace(/\/?#$/,"");var i=[];return k(a,function(a,b){g.urlParams[b]||i.push(f(b)+"="+f(a))}),i.sort(),h=h.replace(/\/*$/,""),h+(i.length?"?"+i.join("&"):"")}},h}])}(window,window.angular),function(a,b,c){"use strict";b.module("ngCookies",["ng"]).factory("$cookies",["$rootScope","$browser",function(a,d){function e(){var a,e,f,i;for(a in h)k(g[a])&&d.cookies(a,c);for(a in g)e=g[a],b.isString(e)?e!==h[a]&&(d.cookies(a,e),i=!0):b.isDefined(h[a])?g[a]=h[a]:delete g[a];if(i){i=!1,f=d.cookies();for(a in g)g[a]!==f[a]&&(k(f[a])?delete g[a]:g[a]=f[a],i=!0)}}var f,g={},h={},i=!1,j=b.copy,k=b.isUndefined;return d.addPollFn(function(){var b=d.cookies();f!=b&&(f=b,j(b,h),j(b,g),i&&a.$apply())})(),i=!0,a.$watch(e),g}]).factory("$cookieStore",["$cookies",function(a){return{get:function(c){var d=a[c];return d?b.fromJson(d):d},put:function(c,d){a[c]=b.toJson(d)},remove:function(b){delete a[b]}}}])}(window,window.angular),function(a,b){"use strict";function c(a){var b,c={},d=a.split(",");for(b=0;b<d.length;b++)c[d[b]]=!0;return c}function d(a,c){function d(a,d,g,h){if(d=b.lowercase(d),v[d])for(;q.last()&&w[q.last()];)f("",q.last());u[d]&&q.last()==d&&f("",d),h=r[d]||!!h,h||q.push(d);var i={};g.replace(k,function(a,b,c,d,f){var g=c||d||f||"";i[b]=e(g)}),c.start&&c.start(d,i,h)}function f(a,d){var e,f=0;if(d=b.lowercase(d))for(f=q.length-1;f>=0&&q[f]!=d;f--);if(f>=0){for(e=q.length-1;e>=f;e--)c.end&&c.end(q[e]);q.length=f}}var g,h,p,q=[],s=a;for(q.last=function(){return q[q.length-1]};a;){if(h=!0,q.last()&&x[q.last()])a=a.replace(new RegExp("(.*)<\\s*\\/\\s*"+q.last()+"[^>]*>","i"),function(a,b){return b=b.replace(n,"$1").replace(o,"$1"),c.chars&&c.chars(e(b)),""}),f("",q.last());else if(0===a.indexOf("<!--")?(g=a.indexOf("-->"),g>=0&&(c.comment&&c.comment(a.substring(4,g)),a=a.substring(g+3),h=!1)):m.test(a)?(p=a.match(j),p&&(a=a.substring(p[0].length),p[0].replace(j,f),h=!1)):l.test(a)&&(p=a.match(i),p&&(a=a.substring(p[0].length),p[0].replace(i,d),h=!1)),h){g=a.indexOf("<");var t=0>g?a:a.substring(0,g);a=0>g?"":a.substring(g),c.chars&&c.chars(e(t))}if(a==s)throw"Parse Error: "+a;s=a}f()}function e(a){return B.innerHTML=a.replace(/</g,"&lt;"),B.innerText||B.textContent||""}function f(a){return a.replace(/&/g,"&amp;").replace(q,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function g(a){var c=!1,d=b.bind(a,a.push);return{start:function(a,e,g){a=b.lowercase(a),!c&&x[a]&&(c=a),c||1!=y[a]||(d("<"),d(a),b.forEach(e,function(a,c){var e=b.lowercase(c);1!=A[e]||z[e]===!0&&!a.match(p)||(d(" "),d(c),d('="'),d(f(a)),d('"'))}),d(g?"/>":">"))},end:function(a){a=b.lowercase(a),c||1!=y[a]||(d("</"),d(a),d(">")),a==c&&(c=!1)},chars:function(a){c||d(f(a))}}}var h=function(a){var b=[];return d(a,g(b)),b.join("")},i=/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,j=/^<\s*\/\s*([\w:-]+)[^>]*>/,k=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,l=/^</,m=/^<\s*\//,n=/<!--(.*?)-->/g,o=/<!\[CDATA\[(.*?)]]>/g,p=/^((ftp|https?):\/\/|mailto:|#)/i,q=/([^\#-~| |!])/g,r=c("area,br,col,hr,img,wbr"),s=c("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),t=c("rp,rt"),u=b.extend({},t,s),v=b.extend({},s,c("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),w=b.extend({},t,c("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),x=c("script,style"),y=b.extend({},r,v,w,u),z=c("background,cite,href,longdesc,src,usemap"),A=b.extend({},z,c("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,span,start,summary,target,title,type,valign,value,vspace,width")),B=document.createElement("pre");b.module("ngSanitize",[]).value("$sanitize",h),b.module("ngSanitize").directive("ngBindHtml",["$sanitize",function(a){return function(b,c,d){c.addClass("ng-binding").data("$binding",d.ngBindHtml),b.$watch(d.ngBindHtml,function(b){b=a(b),c.html(b||"")})}}]),b.module("ngSanitize").filter("linky",function(){var a=/((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}\<\>]/,b=/^mailto:/;return function(c){if(!c)return c;for(var d,e,f,h=c,i=[],j=g(i);d=h.match(a);)e=d[0],d[2]==d[3]&&(e="mailto:"+e),f=d.index,j.chars(h.substr(0,f)),j.start("a",{href:e}),j.chars(d[0].replace(b,"")),j.end("a"),h=h.substring(f+d[0].length);return j.chars(h),i.join("")}})}(window,window.angular),!function(a){"use strict";a.fn.bootstrapSwitch=function(b){var c='input[type!="hidden"]',d={init:function(){return this.each(function(){var b,d,e,f,g,h,i=a(this),j=i.closest("form"),k="",l=i.attr("class"),m="ON",n="OFF",o=!1,p=!1;a.each(["switch-mini","switch-small","switch-large"],function(a,b){l.indexOf(b)>=0&&(k=b)}),i.addClass("has-switch"),i.data("on")&&(g="switch-"+i.data("on")),void 0!==i.data("on-label")&&(m=i.data("on-label")),void 0!==i.data("off-label")&&(n=i.data("off-label")),void 0!==i.data("label-icon")&&(o=i.data("label-icon")),void 0!==i.data("text-label")&&(p=i.data("text-label")),d=a("<span>").addClass("switch-left").addClass(k).addClass(g).html(m),g="",i.data("off")&&(g="switch-"+i.data("off")),e=a("<span>").addClass("switch-right").addClass(k).addClass(g).html(n),f=a("<label>").html("&nbsp;").addClass(k).attr("for",i.find(c).attr("id")),o&&f.html('<i class="icon '+o+'"></i>'),p&&f.html(""+p),b=i.find(c).wrap(a("<div>")).parent().data("animated",!1),i.data("animated")!==!1&&b.addClass("switch-animate").data("animated",!0),b.append(d).append(f).append(e),i.find(">div").addClass(i.find(c).is(":checked")?"switch-on":"switch-off"),i.find(c).is(":disabled")&&a(this).addClass("deactivate");var q=function(a){i.parent("label").is(".label-change-switch")||a.siblings("label").trigger("mousedown").trigger("mouseup").trigger("click")};i.on("keydown",function(b){32===b.keyCode&&(b.stopImmediatePropagation(),b.preventDefault(),q(a(b.target).find("span:first")))}),d.on("click",function(){q(a(this))}),e.on("click",function(){q(a(this))}),i.find(c).on("change",function(b,c){var d=a(this),e=d.parent(),f=d.is(":checked"),g=e.is(".switch-off");if(b.preventDefault(),e.css("left",""),g===f){if(f?e.removeClass("switch-off").addClass("switch-on"):e.removeClass("switch-on").addClass("switch-off"),e.data("animated")!==!1&&e.addClass("switch-animate"),"boolean"==typeof c&&c)return;e.parent().trigger("switch-change",{el:d,value:f})}}),i.find("label").on("mousedown touchstart",function(b){var c=a(this);h=!1,b.preventDefault(),b.stopImmediatePropagation(),c.closest("div").removeClass("switch-animate"),c.closest(".has-switch").is(".deactivate")?c.unbind("click"):c.closest(".switch-on").parent().is(".radio-no-uncheck")?c.unbind("click"):(c.on("mousemove touchmove",function(b){var c=a(this).closest(".make-switch"),d=(b.pageX||b.originalEvent.targetTouches[0].pageX)-c.offset().left,e=100*(d/c.width()),f=25,g=75;h=!0,f>e?e=f:e>g&&(e=g),c.find(">div").css("left",e-g+"%")}),c.on("click touchend",function(b){var c=a(this),d=a(b.target),e=d.siblings("input");b.stopImmediatePropagation(),b.preventDefault(),c.unbind("mouseleave"),h?e.prop("checked",!(parseInt(c.parent().css("left"))<-25)):e.prop("checked",!e.is(":checked")),h=!1,e.trigger("change")}),c.on("mouseleave",function(b){var c=a(this),d=c.siblings("input");b.preventDefault(),b.stopImmediatePropagation(),c.unbind("mouseleave"),c.trigger("mouseup"),d.prop("checked",!(parseInt(c.parent().css("left"))<-25)).trigger("change")}),c.on("mouseup",function(b){b.stopImmediatePropagation(),b.preventDefault(),a(this).unbind("mousemove")}))}),"injected"!==j.data("bootstrapSwitch")&&(j.bind("reset",function(){setTimeout(function(){j.find(".make-switch").each(function(){var b=a(this).find(c);b.prop("checked",b.is(":checked")).trigger("change")})},1)}),j.data("bootstrapSwitch","injected"))})},toggleActivation:function(){var b=a(this);b.toggleClass("deactivate"),b.find(c).prop("disabled",b.is(".deactivate"))},isActive:function(){return!a(this).hasClass("deactivate")},setActive:function(b){var d=a(this);b?(d.removeClass("deactivate"),d.find(c).removeAttr("disabled")):(d.addClass("deactivate"),d.find(c).attr("disabled","disabled"))},toggleState:function(b){var c=a(this).find(":checkbox");c.prop("checked",!c.is(":checked")).trigger("change",b)},toggleRadioState:function(b){var c=a(this).find(":radio");c.not(":checked").prop("checked",!c.is(":checked")).trigger("change",b)},toggleRadioStateAllowUncheck:function(b,c){var d=a(this).find(":radio");b?d.not(":checked").trigger("change",c):d.not(":checked").prop("checked",!d.is(":checked")).trigger("change",c)},setState:function(b,d){a(this).find(c).prop("checked",b).trigger("change",d)},setOnLabel:function(b){var c=a(this).find(".switch-left");c.html(b)},setOffLabel:function(b){var c=a(this).find(".switch-right");c.html(b)},setOnClass:function(b){var c=a(this).find(".switch-left"),d="";b&&(void 0!==a(this).attr("data-on")&&(d="switch-"+a(this).attr("data-on")),c.removeClass(d),d="switch-"+b,c.addClass(d))},setOffClass:function(b){var c=a(this).find(".switch-right"),d="";b&&(void 0!==a(this).attr("data-off")&&(d="switch-"+a(this).attr("data-off")),c.removeClass(d),d="switch-"+b,c.addClass(d))},setAnimated:function(b){var d=a(this).find(c).parent();void 0===b&&(b=!1),d.data("animated",b),d.attr("data-animated",b),d.data("animated")!==!1?d.addClass("switch-animate"):d.removeClass("switch-animate")},setSizeClass:function(b){var c=a(this),d=c.find(".switch-left"),e=c.find(".switch-right"),f=c.find("label");a.each(["switch-mini","switch-small","switch-large"],function(a,c){c!==b?(d.removeClass(c),e.removeClass(c),f.removeClass(c)):(d.addClass(c),e.addClass(c),f.addClass(c))})},setTextLabel:function(b){var c=a(this).find("label");c.html(""+b||"&nbsp")},setTextIcon:function(b){var c=a(this).find("label");c.html(b?'<i class="icon '+b+'"></i>':"&nbsp;")},status:function(){return a(this).find(c).is(":checked")},destroy:function(){var b,c=a(this),d=c.find("div"),e=c.closest("form");return d.find(":not(input)").remove(),b=d.children(),b.unwrap().unwrap(),b.unbind("change"),e&&(e.unbind("reset"),e.removeData("bootstrapSwitch")),b}};return d[b]?d[b].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof b&&b?(a.error("Method "+b+" does not exist!"),void 0):d.init.apply(this,arguments)}}(jQuery),function(a){a(function(){a(".make-switch").bootstrapSwitch()})}(jQuery),angular.module("frapontillo.bootstrap-switch",[]).directive("bsSwitch",["$timeout",function(a){return{template:'<div class="switch" data-on-label="{{switchOnLabel}}" data-off-label="{{switchOffLabel}}" data-on="{{switchOn}}" data-off="{{switchOff}}" data-text-label="{{switchLabel}}" data-icon-label="{{switchIcon}}" data-animated="{{switchAnimate}}" ng-class="switch {{getSizeClass()}}">  <input type="{{switchType}}" ng-model="ngModel"/></div>',restrict:"EA",replace:!0,transclude:!0,scope:{ngModel:"=",switchType:"@",switchActive:"@",switchSize:"@",switchOn:"@",switchOff:"@",switchOnLabel:"@",switchOffLabel:"@",switchLabel:"@",switchIcon:"@",switchAnimate:"@"},link:function(b,c,d){var e=function(){b.ngModel||(b.ngModel=!1),b.switchType||(b.switchType="checkbox"),void 0===b.switchActive&&(b.switchActive=!0),b.switchOnLabel||(b.switchOnLabel="Yes"),b.switchOffLabel||(b.switchOffLabel="No")},f=function(){b.$watch("ngModel",function(a){c.bootstrapSwitch("setState",a||!1)}),b.$watch("switchActive",function(a){c.bootstrapSwitch("setActive",a||!0)}),b.$watch("switchType",function(a){a||(b.switchType="checkbox")}),b.$watch("switchOnLabel",function(a){c.bootstrapSwitch("setOnLabel",a||"Yes")}),b.$watch("switchOffLabel",function(a){c.bootstrapSwitch("setOffLabel",a||"No")}),b.$watch("switchOn",function(a){c.bootstrapSwitch("setOnClass",a||"")}),b.$watch("switchOff",function(a){c.bootstrapSwitch("setOffClass",a||"")}),b.$watch("switchAnimate",function(a){c.bootstrapSwitch("setAnimated",b.$eval(a||"true"))}),b.$watch("switchSize",function(a){c.bootstrapSwitch("setSizeClass",b.getSizeClass(a))}),b.$watch("switchLabel",function(a){c.bootstrapSwitch("setTextLabel",a||"")}),b.$watch("switchIcon",function(a){c.bootstrapSwitch("setTextIcon",a)})},g=function(){c.on("switch-change",function(a,c){var d=c.value;b.ngModel=d,b.$apply()})};b.getSizeClass=function(){return d.switchSize?"switch-"+d.switchSize:""},a(function(){e(),c.bootstrapSwitch(),f(),g()}),b.$on("$destroy",function(){c.bootstrapSwitch("destroy")})}}}]);