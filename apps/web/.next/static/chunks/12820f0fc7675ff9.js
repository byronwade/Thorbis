(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,552585,(t,e,i)=>{t.e,e.exports=function(t,e,i){var n=function(t){return t.add(4-t.isoWeekday(),"day")},r=e.prototype;r.isoWeekYear=function(){return n(this).year()},r.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),"day");var e,r,a,s=n(this),o=(e=this.isoWeekYear(),a=4-(r=(this.$u?i.utc:i)().year(e).startOf("year")).isoWeekday(),r.isoWeekday()>4&&(a+=7),r.add(a,"day"));return s.diff(o,"week")+1},r.isoWeekday=function(t){return this.$utils().u(t)?this.day()||7:this.day(this.day()%7?t:t-7)};var a=r.startOf;r.startOf=function(t,e){var i=this.$utils(),n=!!i.u(e)||e;return"isoweek"===i.p(t)?n?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):a.bind(this)(t,e)}}},927840,(t,e,i)=>{t.e,e.exports=function(){"use strict";var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},e=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,i=/\d/,n=/\d\d/,r=/\d\d?/,a=/\d*[^-_:/,()\s\d]+/,s={},o=function(t){return(t*=1)+(t>68?1900:2e3)},c=function(t){return function(e){this[t]=+e}},l=[/[+-]\d\d:?(\d\d)?|Z/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t||"Z"===t)return 0;var e=t.match(/([+-]|\d\d)/g),i=60*e[1]+(+e[2]||0);return 0===i?0:"+"===e[0]?-i:i}(t)}],u=function(t){var e=s[t];return e&&(e.indexOf?e:e.s.concat(e.f))},d=function(t,e){var i,n=s.meridiem;if(n){for(var r=1;r<=24;r+=1)if(t.indexOf(n(r,0,e))>-1){i=r>12;break}}else i=t===(e?"pm":"PM");return i},h={A:[a,function(t){this.afternoon=d(t,!1)}],a:[a,function(t){this.afternoon=d(t,!0)}],Q:[i,function(t){this.month=3*(t-1)+1}],S:[i,function(t){this.milliseconds=100*t}],SS:[n,function(t){this.milliseconds=10*t}],SSS:[/\d{3}/,function(t){this.milliseconds=+t}],s:[r,c("seconds")],ss:[r,c("seconds")],m:[r,c("minutes")],mm:[r,c("minutes")],H:[r,c("hours")],h:[r,c("hours")],HH:[r,c("hours")],hh:[r,c("hours")],D:[r,c("day")],DD:[n,c("day")],Do:[a,function(t){var e=s.ordinal,i=t.match(/\d+/);if(this.day=i[0],e)for(var n=1;n<=31;n+=1)e(n).replace(/\[|\]/g,"")===t&&(this.day=n)}],w:[r,c("week")],ww:[n,c("week")],M:[r,c("month")],MM:[n,c("month")],MMM:[a,function(t){var e=u("months"),i=(u("monthsShort")||e.map(function(t){return t.slice(0,3)})).indexOf(t)+1;if(i<1)throw Error();this.month=i%12||i}],MMMM:[a,function(t){var e=u("months").indexOf(t)+1;if(e<1)throw Error();this.month=e%12||e}],Y:[/[+-]?\d+/,c("year")],YY:[n,function(t){this.year=o(t)}],YYYY:[/\d{4}/,c("year")],Z:l,ZZ:l};return function(i,n,r){r.p.customParseFormat=!0,i&&i.parseTwoDigitYear&&(o=i.parseTwoDigitYear);var a=n.prototype,c=a.parse;a.parse=function(i){var n=i.date,a=i.utc,o=i.args;this.$u=a;var l=o[1];if("string"==typeof l){var u=!0===o[2],d=!0===o[3],f=o[2];d&&(f=o[2]),s=this.$locale(),!u&&f&&(s=r.Ls[f]),this.$d=function(i,n,r,a){try{if(["x","X"].indexOf(n)>-1)return new Date(("X"===n?1e3:1)*i);var o=(function(i){var n,r;n=i,r=s&&s.formats;for(var a=(i=n.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(e,i,n){var a=n&&n.toUpperCase();return i||r[n]||t[n]||r[a].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(t,e,i){return e||i.slice(1)})})).match(e),o=a.length,c=0;c<o;c+=1){var l=a[c],u=h[l],d=u&&u[0],f=u&&u[1];a[c]=f?{regex:d,parser:f}:l.replace(/^\[|\]$/g,"")}return function(t){for(var e={},i=0,n=0;i<o;i+=1){var r=a[i];if("string"==typeof r)n+=r.length;else{var s=r.regex,c=r.parser,l=t.slice(n),u=s.exec(l)[0];c.call(e,u),t=t.replace(u,"")}}return function(t){var e=t.afternoon;if(void 0!==e){var i=t.hours;e?i<12&&(t.hours+=12):12===i&&(t.hours=0),delete t.afternoon}}(e),e}})(n)(i),c=o.year,l=o.month,u=o.day,d=o.hours,f=o.minutes,m=o.seconds,y=o.milliseconds,k=o.zone,g=o.week,p=new Date,_=u||(c||l?1:p.getDate()),b=c||p.getFullYear(),v=0;c&&!l||(v=l>0?l-1:p.getMonth());var x,T=d||0,w=f||0,D=m||0,$=y||0;return k?new Date(Date.UTC(b,v,_,T,w,D,$+60*k.offset*1e3)):r?new Date(Date.UTC(b,v,_,T,w,D,$)):(x=new Date(b,v,_,T,w,D,$),g&&(x=a(x).week(g).toDate()),x)}catch(t){return new Date("")}}(n,l,a,r),this.init(),f&&!0!==f&&(this.$L=this.locale(f).$L),(u||d)&&n!=this.format(l)&&(this.$d=new Date("")),s={}}else if(l instanceof Array)for(var m=l.length,y=1;y<=m;y+=1){o[1]=l[y-1];var k=r.apply(this,o);if(k.isValid()){this.$d=k.$d,this.$L=k.$L,this.init();break}y===m&&(this.$d=new Date(""))}else c.call(this,i)}}}()},218468,(t,e,i)=>{t.e,e.exports=function(t,e){var i=e.prototype,n=i.format;i.format=function(t){var e=this,i=this.$locale();if(!this.isValid())return n.bind(this)(t);var r=this.$utils(),a=(t||"YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g,function(t){switch(t){case"Q":return Math.ceil((e.$M+1)/3);case"Do":return i.ordinal(e.$D);case"gggg":return e.weekYear();case"GGGG":return e.isoWeekYear();case"wo":return i.ordinal(e.week(),"W");case"w":case"ww":return r.s(e.week(),"w"===t?1:2,"0");case"W":case"WW":return r.s(e.isoWeek(),"W"===t?1:2,"0");case"k":case"kk":return r.s(String(0===e.$H?24:e.$H),"k"===t?1:2,"0");case"X":return Math.floor(e.$d.getTime()/1e3);case"x":return e.$d.getTime();case"z":return"["+e.offsetName()+"]";case"zzz":return"["+e.offsetName("long")+"]";default:return t}});return n.bind(this)(a)}}},249592,t=>{"use strict";var e,i,n,r=t.i(612938),a=t.i(697619),s=t.i(625393),o=t.i(181713),c=t.i(585458),l=t.i(552585),u=t.i(927840),d=t.i(218468);t.i(991577);var h=t.i(692423),f=t.i(707568),f=f,m=t.i(60297),m=m,y=t.i(453779),y=y,k=t.i(197609),g=t.i(189517),p=t.i(321137);let _=Math.PI/180,b=180/Math.PI,v=4/29,x=6/29,T=6/29*3*(6/29),w=6/29*(6/29)*(6/29);function D(t){if(t instanceof $)return new $(t.l,t.a,t.b,t.opacity);if(t instanceof Y)return L(t);t instanceof p.Rgb||(t=(0,p.rgbConvert)(t));var e,i,n=E(t.r),r=E(t.g),a=E(t.b),s=C((.2225045*n+.7168786*r+.0606169*a)/1);return n===r&&r===a?e=i=s:(e=C((.4360747*n+.3850649*r+.1430804*a)/.96422),i=C((.0139322*n+.0971045*r+.7141733*a)/.82521)),new $(116*s-16,500*(e-s),200*(s-i),t.opacity)}function $(t,e,i,n){this.l=+t,this.a=+e,this.b=+i,this.opacity=+n}function C(t){return t>w?Math.pow(t,1/3):t/T+v}function S(t){return t>x?t*t*t:T*(t-v)}function M(t){return 255*(t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055)}function E(t){return(t/=255)<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4)}function A(t,e,i,n){return 1==arguments.length?function(t){if(t instanceof Y)return new Y(t.h,t.c,t.l,t.opacity);if(t instanceof $||(t=D(t)),0===t.a&&0===t.b)return new Y(NaN,0<t.l&&t.l<100?0:NaN,t.l,t.opacity);var e=Math.atan2(t.b,t.a)*b;return new Y(e<0?e+360:e,Math.sqrt(t.a*t.a+t.b*t.b),t.l,t.opacity)}(t):new Y(t,e,i,null==n?1:n)}function Y(t,e,i,n){this.h=+t,this.c=+e,this.l=+i,this.opacity=+n}function L(t){if(isNaN(t.h))return new $(t.l,0,0,t.opacity);var e=t.h*_;return new $(t.l,Math.cos(e)*t.c,Math.sin(e)*t.c,t.opacity)}(0,g.default)($,function(t,e,i,n){return 1==arguments.length?D(t):new $(t,e,i,null==n?1:n)},(0,g.extend)(p.Color,{brighter(t){return new $(this.l+18*(null==t?1:t),this.a,this.b,this.opacity)},darker(t){return new $(this.l-18*(null==t?1:t),this.a,this.b,this.opacity)},rgb(){var t=(this.l+16)/116,e=isNaN(this.a)?t:t+this.a/500,i=isNaN(this.b)?t:t-this.b/200;return e=.96422*S(e),t=+S(t),i=.82521*S(i),new p.Rgb(M(3.1338561*e-1.6168667*t-.4906146*i),M(-.9787684*e+1.9161415*t+.033454*i),M(.0719453*e-.2289914*t+1.4052427*i),this.opacity)}})),(0,g.default)(Y,A,(0,g.extend)(p.Color,{brighter(t){return new Y(this.h,this.c,this.l+18*(null==t?1:t),this.opacity)},darker(t){return new Y(this.h,this.c,this.l-18*(null==t?1:t),this.opacity)},rgb(){return L(this).rgb()}}));var I=t.i(425902);function F(t){return function(e,i){var n=t((e=A(e)).h,(i=A(i)).h),r=(0,I.default)(e.c,i.c),a=(0,I.default)(e.l,i.l),s=(0,I.default)(e.opacity,i.opacity);return function(t){return e.h=n(t),e.c=r(t),e.l=a(t),e.opacity=s(t),e+""}}}let O=F(I.hue);function W(t){return t}function P(t){return"translate("+t+",0)"}function z(t){return"translate(0,"+t+")"}function N(){return!this.__axis}function B(t,e){var i=[],n=null,r=null,a=6,s=6,o=3,c="undefined"!=typeof window&&window.devicePixelRatio>1?0:.5,l=1===t||4===t?-1:1,u=4===t||2===t?"x":"y",d=1===t||3===t?P:z;function h(h){var f=null==n?e.ticks?e.ticks.apply(e,i):e.domain():n,m=null==r?e.tickFormat?e.tickFormat.apply(e,i):W:r,y=Math.max(a,0)+o,k=e.range(),g=+k[0]+c,p=+k[k.length-1]+c,_=(e.bandwidth?function(t,e){return e=Math.max(0,t.bandwidth()-2*e)/2,t.round()&&(e=Math.round(e)),i=>+t(i)+e}:function(t){return e=>+t(e)})(e.copy(),c),b=h.selection?h.selection():h,v=b.selectAll(".domain").data([null]),x=b.selectAll(".tick").data(f,e).order(),T=x.exit(),w=x.enter().append("g").attr("class","tick"),D=x.select("line"),$=x.select("text");v=v.merge(v.enter().insert("path",".tick").attr("class","domain").attr("stroke","currentColor")),x=x.merge(w),D=D.merge(w.append("line").attr("stroke","currentColor").attr(u+"2",l*a)),$=$.merge(w.append("text").attr("fill","currentColor").attr(u,l*y).attr("dy",1===t?"0em":3===t?"0.71em":"0.32em")),h!==b&&(v=v.transition(h),x=x.transition(h),D=D.transition(h),$=$.transition(h),T=T.transition(h).attr("opacity",1e-6).attr("transform",function(t){return isFinite(t=_(t))?d(t+c):this.getAttribute("transform")}),w.attr("opacity",1e-6).attr("transform",function(t){var e=this.parentNode.__axis;return d((e&&isFinite(e=e(t))?e:_(t))+c)})),T.remove(),v.attr("d",4===t||2===t?s?"M"+l*s+","+g+"H"+c+"V"+p+"H"+l*s:"M"+c+","+g+"V"+p:s?"M"+g+","+l*s+"V"+c+"H"+p+"V"+l*s:"M"+g+","+c+"H"+p),x.attr("opacity",1).attr("transform",function(t){return d(_(t)+c)}),D.attr(u+"2",l*a),$.attr(u,l*y).text(m),b.filter(N).attr("fill","none").attr("font-size",10).attr("font-family","sans-serif").attr("text-anchor",2===t?"start":4===t?"end":"middle"),b.each(function(){this.__axis=_})}return h.scale=function(t){return arguments.length?(e=t,h):e},h.ticks=function(){return i=Array.from(arguments),h},h.tickArguments=function(t){return arguments.length?(i=null==t?[]:Array.from(t),h):i.slice()},h.tickValues=function(t){return arguments.length?(n=null==t?null:Array.from(t),h):n&&n.slice()},h.tickFormat=function(t){return arguments.length?(r=t,h):r},h.tickSize=function(t){return arguments.length?(a=s=+t,h):a},h.tickSizeInner=function(t){return arguments.length?(a=+t,h):a},h.tickSizeOuter=function(t){return arguments.length?(s=+t,h):s},h.tickPadding=function(t){return arguments.length?(o=+t,h):o},h.offset=function(t){return arguments.length?(c=+t,h):c},h}F(I.default);var H=t.i(1685),G=t.i(97349),G=G,R=t.i(516636),j=t.i(80534),V=t.i(847686),U=t.i(233253),Z=t.i(850051),q=t.i(299505),X=function(){var t=(0,s.__name)(function(t,e,i,n){for(i=i||{},n=t.length;n--;i[t[n]]=e);return i},"o"),e=[6,8,10,12,13,14,15,16,17,18,20,21,22,23,24,25,26,27,28,29,30,31,33,35,36,38,40],i=[1,26],n=[1,27],r=[1,28],a=[1,29],o=[1,30],c=[1,31],l=[1,32],u=[1,33],d=[1,34],h=[1,9],f=[1,10],m=[1,11],y=[1,12],k=[1,13],g=[1,14],p=[1,15],_=[1,16],b=[1,19],v=[1,20],x=[1,21],T=[1,22],w=[1,23],D=[1,25],$=[1,35],C={trace:(0,s.__name)(function(){},"trace"),yy:{},symbols_:{error:2,start:3,gantt:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NL:10,weekday:11,weekday_monday:12,weekday_tuesday:13,weekday_wednesday:14,weekday_thursday:15,weekday_friday:16,weekday_saturday:17,weekday_sunday:18,weekend:19,weekend_friday:20,weekend_saturday:21,dateFormat:22,inclusiveEndDates:23,topAxis:24,axisFormat:25,tickInterval:26,excludes:27,includes:28,todayMarker:29,title:30,acc_title:31,acc_title_value:32,acc_descr:33,acc_descr_value:34,acc_descr_multiline_value:35,section:36,clickStatement:37,taskTxt:38,taskData:39,click:40,callbackname:41,callbackargs:42,href:43,clickStatementDebug:44,$accept:0,$end:1},terminals_:{2:"error",4:"gantt",6:"EOF",8:"SPACE",10:"NL",12:"weekday_monday",13:"weekday_tuesday",14:"weekday_wednesday",15:"weekday_thursday",16:"weekday_friday",17:"weekday_saturday",18:"weekday_sunday",20:"weekend_friday",21:"weekend_saturday",22:"dateFormat",23:"inclusiveEndDates",24:"topAxis",25:"axisFormat",26:"tickInterval",27:"excludes",28:"includes",29:"todayMarker",30:"title",31:"acc_title",32:"acc_title_value",33:"acc_descr",34:"acc_descr_value",35:"acc_descr_multiline_value",36:"section",38:"taskTxt",39:"taskData",40:"click",41:"callbackname",42:"callbackargs",43:"href"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[19,1],[19,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,1],[9,2],[37,2],[37,3],[37,3],[37,4],[37,3],[37,4],[37,2],[44,2],[44,3],[44,3],[44,4],[44,3],[44,4],[44,2]],performAction:(0,s.__name)(function(t,e,i,n,r,a,s){var o=a.length-1;switch(r){case 1:return a[o-1];case 2:case 6:case 7:this.$=[];break;case 3:a[o-1].push(a[o]),this.$=a[o-1];break;case 4:case 5:this.$=a[o];break;case 8:n.setWeekday("monday");break;case 9:n.setWeekday("tuesday");break;case 10:n.setWeekday("wednesday");break;case 11:n.setWeekday("thursday");break;case 12:n.setWeekday("friday");break;case 13:n.setWeekday("saturday");break;case 14:n.setWeekday("sunday");break;case 15:n.setWeekend("friday");break;case 16:n.setWeekend("saturday");break;case 17:n.setDateFormat(a[o].substr(11)),this.$=a[o].substr(11);break;case 18:n.enableInclusiveEndDates(),this.$=a[o].substr(18);break;case 19:n.TopAxis(),this.$=a[o].substr(8);break;case 20:n.setAxisFormat(a[o].substr(11)),this.$=a[o].substr(11);break;case 21:n.setTickInterval(a[o].substr(13)),this.$=a[o].substr(13);break;case 22:n.setExcludes(a[o].substr(9)),this.$=a[o].substr(9);break;case 23:n.setIncludes(a[o].substr(9)),this.$=a[o].substr(9);break;case 24:n.setTodayMarker(a[o].substr(12)),this.$=a[o].substr(12);break;case 27:n.setDiagramTitle(a[o].substr(6)),this.$=a[o].substr(6);break;case 28:this.$=a[o].trim(),n.setAccTitle(this.$);break;case 29:case 30:this.$=a[o].trim(),n.setAccDescription(this.$);break;case 31:n.addSection(a[o].substr(8)),this.$=a[o].substr(8);break;case 33:n.addTask(a[o-1],a[o]),this.$="task";break;case 34:this.$=a[o-1],n.setClickEvent(a[o-1],a[o],null);break;case 35:this.$=a[o-2],n.setClickEvent(a[o-2],a[o-1],a[o]);break;case 36:this.$=a[o-2],n.setClickEvent(a[o-2],a[o-1],null),n.setLink(a[o-2],a[o]);break;case 37:this.$=a[o-3],n.setClickEvent(a[o-3],a[o-2],a[o-1]),n.setLink(a[o-3],a[o]);break;case 38:this.$=a[o-2],n.setClickEvent(a[o-2],a[o],null),n.setLink(a[o-2],a[o-1]);break;case 39:this.$=a[o-3],n.setClickEvent(a[o-3],a[o-1],a[o]),n.setLink(a[o-3],a[o-2]);break;case 40:this.$=a[o-1],n.setLink(a[o-1],a[o]);break;case 41:case 47:this.$=a[o-1]+" "+a[o];break;case 42:case 43:case 45:this.$=a[o-2]+" "+a[o-1]+" "+a[o];break;case 44:case 46:this.$=a[o-3]+" "+a[o-2]+" "+a[o-1]+" "+a[o]}},"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:17,12:i,13:n,14:r,15:a,16:o,17:c,18:l,19:18,20:u,21:d,22:h,23:f,24:m,25:y,26:k,27:g,28:p,29:_,30:b,31:v,33:x,35:T,36:w,37:24,38:D,40:$},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:36,11:17,12:i,13:n,14:r,15:a,16:o,17:c,18:l,19:18,20:u,21:d,22:h,23:f,24:m,25:y,26:k,27:g,28:p,29:_,30:b,31:v,33:x,35:T,36:w,37:24,38:D,40:$},t(e,[2,5]),t(e,[2,6]),t(e,[2,17]),t(e,[2,18]),t(e,[2,19]),t(e,[2,20]),t(e,[2,21]),t(e,[2,22]),t(e,[2,23]),t(e,[2,24]),t(e,[2,25]),t(e,[2,26]),t(e,[2,27]),{32:[1,37]},{34:[1,38]},t(e,[2,30]),t(e,[2,31]),t(e,[2,32]),{39:[1,39]},t(e,[2,8]),t(e,[2,9]),t(e,[2,10]),t(e,[2,11]),t(e,[2,12]),t(e,[2,13]),t(e,[2,14]),t(e,[2,15]),t(e,[2,16]),{41:[1,40],43:[1,41]},t(e,[2,4]),t(e,[2,28]),t(e,[2,29]),t(e,[2,33]),t(e,[2,34],{42:[1,42],43:[1,43]}),t(e,[2,40],{41:[1,44]}),t(e,[2,35],{43:[1,45]}),t(e,[2,36]),t(e,[2,38],{42:[1,46]}),t(e,[2,37]),t(e,[2,39])],defaultActions:{},parseError:(0,s.__name)(function(t,e){if(e.recoverable)this.trace(t);else{var i=Error(t);throw i.hash=e,i}},"parseError"),parse:(0,s.__name)(function(t){var e=this,i=[0],n=[],r=[null],a=[],o=this.table,c="",l=0,u=0,d=0,h=a.slice.call(arguments,1),f=Object.create(this.lexer),m={};for(var y in this.yy)Object.prototype.hasOwnProperty.call(this.yy,y)&&(m[y]=this.yy[y]);f.setInput(t,m),m.lexer=f,m.parser=this,void 0===f.yylloc&&(f.yylloc={});var k=f.yylloc;a.push(k);var g=f.options&&f.options.ranges;function p(){var t;return"number"!=typeof(t=n.pop()||f.lex()||1)&&(t instanceof Array&&(t=(n=t).pop()),t=e.symbols_[t]||t),t}"function"==typeof m.parseError?this.parseError=m.parseError:this.parseError=Object.getPrototypeOf(this).parseError,(0,s.__name)(function(t){i.length=i.length-2*t,r.length=r.length-t,a.length=a.length-t},"popStack"),(0,s.__name)(p,"lex");for(var _,b,v,x,T,w,D,$,C,S={};;){if(v=i[i.length-1],this.defaultActions[v]?x=this.defaultActions[v]:(null==_&&(_=p()),x=o[v]&&o[v][_]),void 0===x||!x.length||!x[0]){var M="";for(w in C=[],o[v])this.terminals_[w]&&w>2&&C.push("'"+this.terminals_[w]+"'");M=f.showPosition?"Parse error on line "+(l+1)+":\n"+f.showPosition()+"\nExpecting "+C.join(", ")+", got '"+(this.terminals_[_]||_)+"'":"Parse error on line "+(l+1)+": Unexpected "+(1==_?"end of input":"'"+(this.terminals_[_]||_)+"'"),this.parseError(M,{text:f.match,token:this.terminals_[_]||_,line:f.yylineno,loc:k,expected:C})}if(x[0]instanceof Array&&x.length>1)throw Error("Parse Error: multiple actions possible at state: "+v+", token: "+_);switch(x[0]){case 1:i.push(_),r.push(f.yytext),a.push(f.yylloc),i.push(x[1]),_=null,b?(_=b,b=null):(u=f.yyleng,c=f.yytext,l=f.yylineno,k=f.yylloc,d>0&&d--);break;case 2:if(D=this.productions_[x[1]][1],S.$=r[r.length-D],S._$={first_line:a[a.length-(D||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-(D||1)].first_column,last_column:a[a.length-1].last_column},g&&(S._$.range=[a[a.length-(D||1)].range[0],a[a.length-1].range[1]]),void 0!==(T=this.performAction.apply(S,[c,u,l,m,x[1],r,a].concat(h))))return T;D&&(i=i.slice(0,-1*D*2),r=r.slice(0,-1*D),a=a.slice(0,-1*D)),i.push(this.productions_[x[1]][0]),r.push(S.$),a.push(S._$),$=o[i[i.length-2]][i[i.length-1]],i.push($);break;case 3:return!0}}return!0},"parse")};function S(){this.yy={}}return C.lexer={EOF:1,parseError:(0,s.__name)(function(t,e){if(this.yy.parser)this.yy.parser.parseError(t,e);else throw Error(t)},"parseError"),setInput:(0,s.__name)(function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:(0,s.__name)(function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},"input"),unput:(0,s.__name)(function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var n=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var r=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===n.length?this.yylloc.first_column:0)+n[n.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[r[0],r[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},"unput"),more:(0,s.__name)(function(){return this._more=!0,this},"more"),reject:(0,s.__name)(function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"reject"),less:(0,s.__name)(function(t){this.unput(this.match.slice(t))},"less"),pastInput:(0,s.__name)(function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:(0,s.__name)(function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:(0,s.__name)(function(){var t=this.pastInput(),e=Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},"showPosition"),test_match:(0,s.__name)(function(t,e){var i,n,r;if(this.options.backtrack_lexer&&(r={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(r.yylloc.range=this.yylloc.range.slice(0))),(n=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=n.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:n?n[n.length-1].length-n[n.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack)for(var a in r)this[a]=r[a];return!1},"test_match"),next:(0,s.__name)(function(){if(this.done)return this.EOF;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var t,e,i,n,r=this._currentRules(),a=0;a<r.length;a++)if((i=this._input.match(this.rules[r[a]]))&&(!e||i[0].length>e[0].length)){if(e=i,n=a,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,r[a])))return t;if(!this._backtrack)return!1;e=!1;continue}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,r[n]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:(0,s.__name)(function(){var t=this.next();return t||this.lex()},"lex"),begin:(0,s.__name)(function(t){this.conditionStack.push(t)},"begin"),popState:(0,s.__name)(function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:(0,s.__name)(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:(0,s.__name)(function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},"topState"),pushState:(0,s.__name)(function(t){this.begin(t)},"pushState"),stateStackSize:(0,s.__name)(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:(0,s.__name)(function(t,e,i,n){switch(i){case 0:return this.begin("open_directive"),"open_directive";case 1:return this.begin("acc_title"),31;case 2:return this.popState(),"acc_title_value";case 3:return this.begin("acc_descr"),33;case 4:return this.popState(),"acc_descr_value";case 5:this.begin("acc_descr_multiline");break;case 6:case 15:case 18:case 21:case 24:this.popState();break;case 7:return"acc_descr_multiline_value";case 8:case 9:case 10:case 12:case 13:break;case 11:return 10;case 14:this.begin("href");break;case 16:return 43;case 17:this.begin("callbackname");break;case 19:this.popState(),this.begin("callbackargs");break;case 20:return 41;case 22:return 42;case 23:this.begin("click");break;case 25:return 40;case 26:return 4;case 27:return 22;case 28:return 23;case 29:return 24;case 30:return 25;case 31:return 26;case 32:return 28;case 33:return 27;case 34:return 29;case 35:return 12;case 36:return 13;case 37:return 14;case 38:return 15;case 39:return 16;case 40:return 17;case 41:return 18;case 42:return 20;case 43:return 21;case 44:return"date";case 45:return 30;case 46:return"accDescription";case 47:return 36;case 48:return 38;case 49:return 39;case 50:return":";case 51:return 6;case 52:return"INVALID"}},"anonymous"),rules:[/^(?:%%\{)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:%%(?!\{)*[^\n]*)/i,/^(?:[^\}]%%*[^\n]*)/i,/^(?:%%*[^\n]*[\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:%[^\n]*)/i,/^(?:href[\s]+["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:call[\s]+)/i,/^(?:\([\s]*\))/i,/^(?:\()/i,/^(?:[^(]*)/i,/^(?:\))/i,/^(?:[^)]*)/i,/^(?:click[\s]+)/i,/^(?:[\s\n])/i,/^(?:[^\s\n]*)/i,/^(?:gantt\b)/i,/^(?:dateFormat\s[^#\n;]+)/i,/^(?:inclusiveEndDates\b)/i,/^(?:topAxis\b)/i,/^(?:axisFormat\s[^#\n;]+)/i,/^(?:tickInterval\s[^#\n;]+)/i,/^(?:includes\s[^#\n;]+)/i,/^(?:excludes\s[^#\n;]+)/i,/^(?:todayMarker\s[^\n;]+)/i,/^(?:weekday\s+monday\b)/i,/^(?:weekday\s+tuesday\b)/i,/^(?:weekday\s+wednesday\b)/i,/^(?:weekday\s+thursday\b)/i,/^(?:weekday\s+friday\b)/i,/^(?:weekday\s+saturday\b)/i,/^(?:weekday\s+sunday\b)/i,/^(?:weekend\s+friday\b)/i,/^(?:weekend\s+saturday\b)/i,/^(?:\d\d\d\d-\d\d-\d\d\b)/i,/^(?:title\s[^\n]+)/i,/^(?:accDescription\s[^#\n;]+)/i,/^(?:section\s[^\n]+)/i,/^(?:[^:\n]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[6,7],inclusive:!1},acc_descr:{rules:[4],inclusive:!1},acc_title:{rules:[2],inclusive:!1},callbackargs:{rules:[21,22],inclusive:!1},callbackname:{rules:[18,19,20],inclusive:!1},href:{rules:[15,16],inclusive:!1},click:{rules:[24,25],inclusive:!1},INITIAL:{rules:[0,1,3,5,8,9,10,11,12,13,14,17,23,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],inclusive:!0}}},(0,s.__name)(S,"Parser"),S.prototype=C,C.Parser=S,new S}();X.parser=X,c.default.extend(l.default),c.default.extend(u.default),c.default.extend(d.default);var Q={friday:5,saturday:6},K="",J="",tt=void 0,te="",ti=[],tn=[],tr=new Map,ta=[],ts=[],to="",tc="",tl=["active","done","crit","milestone","vert"],tu=[],td=!1,th=!1,tf="sunday",tm="saturday",ty=0,tk=(0,s.__name)(function(){ta=[],ts=[],to="",tu=[],tZ=0,e=void 0,i=void 0,tK=[],K="",J="",tc="",tt=void 0,te="",ti=[],tn=[],td=!1,th=!1,ty=0,tr=new Map,(0,a.clear)(),tf="sunday",tm="saturday"},"clear"),tg=(0,s.__name)(function(t){J=t},"setAxisFormat"),tp=(0,s.__name)(function(){return J},"getAxisFormat"),t_=(0,s.__name)(function(t){tt=t},"setTickInterval"),tb=(0,s.__name)(function(){return tt},"getTickInterval"),tv=(0,s.__name)(function(t){te=t},"setTodayMarker"),tx=(0,s.__name)(function(){return te},"getTodayMarker"),tT=(0,s.__name)(function(t){K=t},"setDateFormat"),tw=(0,s.__name)(function(){td=!0},"enableInclusiveEndDates"),tD=(0,s.__name)(function(){return td},"endDatesAreInclusive"),t$=(0,s.__name)(function(){th=!0},"enableTopAxis"),tC=(0,s.__name)(function(){return th},"topAxisEnabled"),tS=(0,s.__name)(function(t){tc=t},"setDisplayMode"),tM=(0,s.__name)(function(){return tc},"getDisplayMode"),tE=(0,s.__name)(function(){return K},"getDateFormat"),tA=(0,s.__name)(function(t){ti=t.toLowerCase().split(/[\s,]+/)},"setIncludes"),tY=(0,s.__name)(function(){return ti},"getIncludes"),tL=(0,s.__name)(function(t){tn=t.toLowerCase().split(/[\s,]+/)},"setExcludes"),tI=(0,s.__name)(function(){return tn},"getExcludes"),tF=(0,s.__name)(function(){return tr},"getLinks"),tO=(0,s.__name)(function(t){to=t,ta.push(t)},"addSection"),tW=(0,s.__name)(function(){return ta},"getSections"),tP=(0,s.__name)(function(){let t=t3(),e=0;for(;!t&&e<10;)t=t3(),e++;return ts=tK},"getTasks"),tz=(0,s.__name)(function(t,e,i,n){let r=t.format(e.trim()),a=t.format("YYYY-MM-DD");return!(n.includes(r)||n.includes(a))&&(!!(i.includes("weekends")&&(t.isoWeekday()===Q[tm]||t.isoWeekday()===Q[tm]+1)||i.includes(t.format("dddd").toLowerCase()))||i.includes(r)||i.includes(a))},"isInvalidDate"),tN=(0,s.__name)(function(t){tf=t},"setWeekday"),tB=(0,s.__name)(function(){return tf},"getWeekday"),tH=(0,s.__name)(function(t){tm=t},"setWeekend"),tG=(0,s.__name)(function(t,e,i,n){let r;if(!i.length||t.manualEndTime)return;let[a,s]=tR(r=(r=t.startTime instanceof Date?(0,c.default)(t.startTime):(0,c.default)(t.startTime,e,!0)).add(1,"d"),t.endTime instanceof Date?(0,c.default)(t.endTime):(0,c.default)(t.endTime,e,!0),e,i,n);t.endTime=a.toDate(),t.renderEndTime=s},"checkTaskDates"),tR=(0,s.__name)(function(t,e,i,n,r){let a=!1,s=null;for(;t<=e;)a||(s=e.toDate()),(a=tz(t,i,n,r))&&(e=e.add(1,"d")),t=t.add(1,"d");return[e,s]},"fixTaskDates"),tj=(0,s.__name)(function(t,e,i){if(i=i.trim(),("x"===e.trim()||"X"===e.trim())&&/^\d+$/.test(i))return new Date(Number(i));let n=/^after\s+(?<ids>[\d\w- ]+)/.exec(i);if(null!==n){let t=null;for(let e of n.groups.ids.split(" ")){let i=t0(e);void 0!==i&&(!t||i.endTime>t.endTime)&&(t=i)}if(t)return t.endTime;let e=new Date;return e.setHours(0,0,0,0),e}let r=(0,c.default)(i,e.trim(),!0);if(r.isValid())return r.toDate();{s.log.debug("Invalid date:"+i),s.log.debug("With date format:"+e.trim());let t=new Date(i);if(void 0===t||isNaN(t.getTime())||-1e4>t.getFullYear()||t.getFullYear()>1e4)throw Error("Invalid date:"+i);return t}},"getStartDate"),tV=(0,s.__name)(function(t){let e=/^(\d+(?:\.\d+)?)([Mdhmswy]|ms)$/.exec(t.trim());return null!==e?[Number.parseFloat(e[1]),e[2]]:[NaN,"ms"]},"parseDuration"),tU=(0,s.__name)(function(t,e,i,n=!1){i=i.trim();let r=/^until\s+(?<ids>[\d\w- ]+)/.exec(i);if(null!==r){let t=null;for(let e of r.groups.ids.split(" ")){let i=t0(e);void 0!==i&&(!t||i.startTime<t.startTime)&&(t=i)}if(t)return t.startTime;let e=new Date;return e.setHours(0,0,0,0),e}let a=(0,c.default)(i,e.trim(),!0);if(a.isValid())return n&&(a=a.add(1,"d")),a.toDate();let s=(0,c.default)(t),[o,l]=tV(i);if(!Number.isNaN(o)){let t=s.add(o,l);t.isValid()&&(s=t)}return s.toDate()},"getEndDate"),tZ=0,tq=(0,s.__name)(function(t){return void 0===t?"task"+(tZ+=1):t},"parseId"),tX=(0,s.__name)(function(t,e){let i=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),n={};ee(i,n,tl);for(let t=0;t<i.length;t++)i[t]=i[t].trim();let r="";switch(i.length){case 1:n.id=tq(),n.startTime=t.endTime,r=i[0];break;case 2:n.id=tq(),n.startTime=tj(void 0,K,i[0]),r=i[1];break;case 3:n.id=tq(i[0]),n.startTime=tj(void 0,K,i[1]),r=i[2]}return r&&(n.endTime=tU(n.startTime,K,r,td),n.manualEndTime=(0,c.default)(r,"YYYY-MM-DD",!0).isValid(),tG(n,K,tn,ti)),n},"compileData"),tQ=(0,s.__name)(function(t,e){let i=(":"===e.substr(0,1)?e.substr(1,e.length):e).split(","),n={};ee(i,n,tl);for(let t=0;t<i.length;t++)i[t]=i[t].trim();switch(i.length){case 1:n.id=tq(),n.startTime={type:"prevTaskEnd",id:t},n.endTime={data:i[0]};break;case 2:n.id=tq(),n.startTime={type:"getStartDate",startData:i[0]},n.endTime={data:i[1]};break;case 3:n.id=tq(i[0]),n.startTime={type:"getStartDate",startData:i[1]},n.endTime={data:i[2]}}return n},"parseData"),tK=[],tJ={},t1=(0,s.__name)(function(t,e){let n={section:to,type:to,processed:!1,manualEndTime:!1,renderEndTime:null,raw:{data:e},task:t,classes:[]},r=tQ(i,e);n.raw.startTime=r.startTime,n.raw.endTime=r.endTime,n.id=r.id,n.prevTaskId=i,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.vert=r.vert,n.order=ty,ty++;let a=tK.push(n);i=n.id,tJ[n.id]=a-1},"addTask"),t0=(0,s.__name)(function(t){return tK[tJ[t]]},"findTaskById"),t2=(0,s.__name)(function(t,i){let n={section:to,type:to,description:t,task:t,classes:[]},r=tX(e,i);n.startTime=r.startTime,n.endTime=r.endTime,n.id=r.id,n.active=r.active,n.done=r.done,n.crit=r.crit,n.milestone=r.milestone,n.vert=r.vert,e=n,ts.push(n)},"addTaskOrg"),t3=(0,s.__name)(function(){let t=(0,s.__name)(function(t){let e=tK[t],i="";switch(tK[t].raw.startTime.type){case"prevTaskEnd":{let t=t0(e.prevTaskId);e.startTime=t.endTime;break}case"getStartDate":(i=tj(void 0,K,tK[t].raw.startTime.startData))&&(tK[t].startTime=i)}return tK[t].startTime&&(tK[t].endTime=tU(tK[t].startTime,K,tK[t].raw.endTime.data,td),tK[t].endTime&&(tK[t].processed=!0,tK[t].manualEndTime=(0,c.default)(tK[t].raw.endTime.data,"YYYY-MM-DD",!0).isValid(),tG(tK[t],K,tn,ti))),tK[t].processed},"compileTask"),e=!0;for(let[i,n]of tK.entries())t(i),e=e&&n.processed;return e},"compileTasks"),t4=(0,s.__name)(function(t,e){let i=e;"loose"!==(0,a.getConfig2)().securityLevel&&(i=(0,o.sanitizeUrl)(e)),t.split(",").forEach(function(t){void 0!==t0(t)&&(t6(t,()=>{window.open(i,"_self")}),tr.set(t,i))}),t5(t,"clickable")},"setLink"),t5=(0,s.__name)(function(t,e){t.split(",").forEach(function(t){let i=t0(t);void 0!==i&&i.classes.push(e)})},"setClass"),t9=(0,s.__name)(function(t,e,i){if("loose"!==(0,a.getConfig2)().securityLevel||void 0===e)return;let n=[];if("string"==typeof i){n=i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);for(let t=0;t<n.length;t++){let e=n[t].trim();e.startsWith('"')&&e.endsWith('"')&&(e=e.substr(1,e.length-2)),n[t]=e}}0===n.length&&n.push(t),void 0!==t0(t)&&t6(t,()=>{r.utils_default.runFunc(e,...n)})},"setClickFun"),t6=(0,s.__name)(function(t,e){tu.push(function(){let i=document.querySelector(`[id="${t}"]`);null!==i&&i.addEventListener("click",function(){e()})},function(){let i=document.querySelector(`[id="${t}-text"]`);null!==i&&i.addEventListener("click",function(){e()})})},"pushFun"),t8=(0,s.__name)(function(t,e,i){t.split(",").forEach(function(t){t9(t,e,i)}),t5(t,"clickable")},"setClickEvent"),t7=(0,s.__name)(function(t){tu.forEach(function(e){e(t)})},"bindFunctions"),et={getConfig:(0,s.__name)(()=>(0,a.getConfig2)().gantt,"getConfig"),clear:tk,setDateFormat:tT,getDateFormat:tE,enableInclusiveEndDates:tw,endDatesAreInclusive:tD,enableTopAxis:t$,topAxisEnabled:tC,setAxisFormat:tg,getAxisFormat:tp,setTickInterval:t_,getTickInterval:tb,setTodayMarker:tv,getTodayMarker:tx,setAccTitle:a.setAccTitle,getAccTitle:a.getAccTitle,setDiagramTitle:a.setDiagramTitle,getDiagramTitle:a.getDiagramTitle,setDisplayMode:tS,getDisplayMode:tM,setAccDescription:a.setAccDescription,getAccDescription:a.getAccDescription,addSection:tO,getSections:tW,getTasks:tP,addTask:t1,findTaskById:t0,addTaskOrg:t2,setIncludes:tA,getIncludes:tY,setExcludes:tL,getExcludes:tI,setClickEvent:t8,setLink:t4,getLinks:tF,bindFunctions:t7,parseDuration:tV,isInvalidDate:tz,setWeekday:tN,getWeekday:tB,setWeekend:tH};function ee(t,e,i){let n=!0;for(;n;)n=!1,i.forEach(function(i){let r=RegExp("^\\s*"+i+"\\s*$");t[0].match(r)&&(e[i]=!0,t.shift(1),n=!0)})}(0,s.__name)(ee,"getTaskTags");var ei=(0,s.__name)(function(){s.log.debug("Something is calling, setConf, remove the call")},"setConf"),en={monday:Z.timeMonday,tuesday:Z.timeTuesday,wednesday:Z.timeWednesday,thursday:Z.timeThursday,friday:Z.timeFriday,saturday:Z.timeSaturday,sunday:Z.timeSunday},er=(0,s.__name)((t,e)=>{let i=[...t].map(()=>-1/0),n=[...t].sort((t,e)=>t.startTime-e.startTime||t.order-e.order),r=0;for(let t of n)for(let n=0;n<i.length;n++)if(t.startTime>=i[n]){i[n]=t.endTime,t.order=n+e,n>r&&(r=n);break}return r},"getMaxIntersections"),ea={parser:X,db:et,renderer:{setConf:ei,draw:(0,s.__name)(function(t,e,i,r){let o,l=(0,a.getConfig2)().gantt,u=(0,a.getConfig2)().securityLevel;"sandbox"===u&&(o=(0,h.select)("#i"+e));let d="sandbox"===u?(0,h.select)(o.nodes()[0].contentDocument.body):(0,h.select)("body"),g="sandbox"===u?o.nodes()[0].contentDocument:document,p=g.getElementById(e);void 0===(n=p.parentElement.offsetWidth)&&(n=1200),void 0!==l.useWidth&&(n=l.useWidth);let _=r.db.getTasks(),b=[];for(let t of _)b.push(t.type);b=Y(b);let v={},x=2*l.topPadding;if("compact"===r.db.getDisplayMode()||"compact"===l.displayMode){let t={};for(let e of _)void 0===t[e.section]?t[e.section]=[e]:t[e.section].push(e);let e=0;for(let i of Object.keys(t)){let n=er(t[i],e)+1;e+=n,x+=n*(l.barHeight+l.barGap),v[i]=n}}else for(let t of(x+=_.length*(l.barHeight+l.barGap),b))v[t]=_.filter(e=>e.type===t).length;p.setAttribute("viewBox","0 0 "+n+" "+x);let T=d.select(`[id="${e}"]`),w=(0,f.default)().domain([(0,m.default)(_,function(t){return t.startTime}),(0,y.default)(_,function(t){return t.endTime})]).rangeRound([0,n-l.leftPadding-l.rightPadding]);function D(t,e){let i=t.startTime,n=e.startTime,r=0;return i>n?r=1:i<n&&(r=-1),r}function $(t,e,i){let n=l.barHeight,a=n+l.barGap,s=l.topPadding,o=l.leftPadding,c=(0,k.scaleLinear)().domain([0,b.length]).range(["#00B9FA","#F95002"]).interpolate(O);S(a,s,o,e,i,t,r.db.getExcludes(),r.db.getIncludes()),M(o,s,e,i),C(t,a,s,o,n,c,e,i),E(a,s,o,n,c),A(o,s,e,i)}function C(t,i,n,s,o,c,u){t.sort((t,e)=>t.vert===e.vert?0:t.vert?1:-1);let d=[...new Set(t.map(t=>t.order))].map(e=>t.find(t=>t.order===e));T.append("g").selectAll("rect").data(d).enter().append("rect").attr("x",0).attr("y",function(t,e){return t.order*i+n-2}).attr("width",function(){return u-l.rightPadding/2}).attr("height",i).attr("class",function(t){for(let[e,i]of b.entries())if(t.type===i)return"section section"+e%l.numberSectionStyles;return"section section0"}).enter();let f=T.append("g").selectAll("rect").data(t).enter(),m=r.db.getLinks();if(f.append("rect").attr("id",function(t){return t.id}).attr("rx",3).attr("ry",3).attr("x",function(t){return t.milestone?w(t.startTime)+s+.5*(w(t.endTime)-w(t.startTime))-.5*o:w(t.startTime)+s}).attr("y",function(t,e){return(e=t.order,t.vert)?l.gridLineStartPadding:e*i+n}).attr("width",function(t){return t.milestone?o:t.vert?.08*o:w(t.renderEndTime||t.endTime)-w(t.startTime)}).attr("height",function(t){return t.vert?_.length*(l.barHeight+l.barGap)+2*l.barHeight:o}).attr("transform-origin",function(t,e){return e=t.order,(w(t.startTime)+s+.5*(w(t.endTime)-w(t.startTime))).toString()+"px "+(e*i+n+.5*o).toString()+"px"}).attr("class",function(t){let e="";t.classes.length>0&&(e=t.classes.join(" "));let i=0;for(let[e,n]of b.entries())t.type===n&&(i=e%l.numberSectionStyles);let n="";return t.active?t.crit?n+=" activeCrit":n=" active":t.done?n=t.crit?" doneCrit":" done":t.crit&&(n+=" crit"),0===n.length&&(n=" task"),t.milestone&&(n=" milestone "+n),t.vert&&(n=" vert "+n),n+=i,"task"+(n+=" "+e)}),f.append("text").attr("id",function(t){return t.id+"-text"}).text(function(t){return t.task}).attr("font-size",l.fontSize).attr("x",function(t){let e=w(t.startTime),i=w(t.renderEndTime||t.endTime);if(t.milestone&&(e+=.5*(w(t.endTime)-w(t.startTime))-.5*o,i=e+o),t.vert)return w(t.startTime)+s;let n=this.getBBox().width;return n>i-e?i+n+1.5*l.leftPadding>u?e+s-5:i+s+5:(i-e)/2+e+s}).attr("y",function(t,e){return t.vert?l.gridLineStartPadding+_.length*(l.barHeight+l.barGap)+60:t.order*i+l.barHeight/2+(l.fontSize/2-2)+n}).attr("text-height",o).attr("class",function(t){let e=w(t.startTime),i=w(t.endTime);t.milestone&&(i=e+o);let n=this.getBBox().width,r="";t.classes.length>0&&(r=t.classes.join(" "));let a=0;for(let[e,i]of b.entries())t.type===i&&(a=e%l.numberSectionStyles);let s="";return(t.active&&(s=t.crit?"activeCritText"+a:"activeText"+a),t.done?s=t.crit?s+" doneCritText"+a:s+" doneText"+a:t.crit&&(s=s+" critText"+a),t.milestone&&(s+=" milestoneText"),t.vert&&(s+=" vertText"),n>i-e)?i+n+1.5*l.leftPadding>u?r+" taskTextOutsideLeft taskTextOutside"+a+" "+s:r+" taskTextOutsideRight taskTextOutside"+a+" "+s+" width-"+n:r+" taskText taskText"+a+" "+s+" width-"+n}),"sandbox"===(0,a.getConfig2)().securityLevel){let t=(0,h.select)("#i"+e).nodes()[0].contentDocument;f.filter(function(t){return m.has(t.id)}).each(function(e){var i=t.querySelector("#"+e.id),n=t.querySelector("#"+e.id+"-text");let r=i.parentNode;var a=t.createElement("a");a.setAttribute("xlink:href",m.get(e.id)),a.setAttribute("target","_top"),r.appendChild(a),a.appendChild(i),a.appendChild(n)})}}function S(t,e,i,n,a,o,u,d){let h,f;if(0===u.length&&0===d.length)return;for(let{startTime:t,endTime:e}of o)(void 0===h||t<h)&&(h=t),(void 0===f||e>f)&&(f=e);if(!h||!f)return;if((0,c.default)(f).diff((0,c.default)(h),"year")>5)return void s.log.warn("The difference between the min and max time is more than 5 years. This will cause performance issues. Skipping drawing exclude days.");let m=r.db.getDateFormat(),y=[],k=null,g=(0,c.default)(h);for(;g.valueOf()<=f;)r.db.isInvalidDate(g,m,u,d)?k?k.end=g:k={start:g,end:g}:k&&(y.push(k),k=null),g=g.add(1,"d");T.append("g").selectAll("rect").data(y).enter().append("rect").attr("id",t=>"exclude-"+t.start.format("YYYY-MM-DD")).attr("x",t=>w(t.start.startOf("day"))+i).attr("y",l.gridLineStartPadding).attr("width",t=>w(t.end.endOf("day"))-w(t.start.startOf("day"))).attr("height",a-e-l.gridLineStartPadding).attr("transform-origin",function(e,n){return(w(e.start)+i+.5*(w(e.end)-w(e.start))).toString()+"px "+(n*t+.5*a).toString()+"px"}).attr("class","exclude-range")}function M(t,e,i,n){let a,s=r.db.getDateFormat(),o=r.db.getAxisFormat();a=o||("D"===s?"%d":l.axisFormat??"%Y-%m-%d");let c=B(3,w).tickSize(-n+e+l.gridLineStartPadding).tickFormat((0,H.timeFormat)(a)),u=/^([1-9]\d*)(millisecond|second|minute|hour|day|week|month)$/.exec(r.db.getTickInterval()||l.tickInterval);if(null!==u){let t=u[1],e=u[2],i=r.db.getWeekday()||l.weekday;switch(e){case"millisecond":c.ticks(G.millisecond.every(t));break;case"second":c.ticks(R.timeSecond.every(t));break;case"minute":c.ticks(j.timeMinute.every(t));break;case"hour":c.ticks(V.timeHour.every(t));break;case"day":c.ticks(U.timeDay.every(t));break;case"week":c.ticks(en[i].every(t));break;case"month":c.ticks(q.timeMonth.every(t))}}if(T.append("g").attr("class","grid").attr("transform","translate("+t+", "+(n-50)+")").call(c).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10).attr("dy","1em"),r.db.topAxisEnabled()||l.topAxis){let i=B(1,w).tickSize(-n+e+l.gridLineStartPadding).tickFormat((0,H.timeFormat)(a));if(null!==u){let t=u[1],e=u[2],n=r.db.getWeekday()||l.weekday;switch(e){case"millisecond":i.ticks(G.millisecond.every(t));break;case"second":i.ticks(R.timeSecond.every(t));break;case"minute":i.ticks(j.timeMinute.every(t));break;case"hour":i.ticks(V.timeHour.every(t));break;case"day":i.ticks(U.timeDay.every(t));break;case"week":i.ticks(en[n].every(t));break;case"month":i.ticks(q.timeMonth.every(t))}}T.append("g").attr("class","grid").attr("transform","translate("+t+", "+e+")").call(i).selectAll("text").style("text-anchor","middle").attr("fill","#000").attr("stroke","none").attr("font-size",10)}}function E(t,e){let i=0,n=Object.keys(v).map(t=>[t,v[t]]);T.append("g").selectAll("text").data(n).enter().append(function(t){let e=t[0].split(a.common_default.lineBreakRegex),i=-(e.length-1)/2,n=g.createElementNS("http://www.w3.org/2000/svg","text");for(let[t,r]of(n.setAttribute("dy",i+"em"),e.entries())){let e=g.createElementNS("http://www.w3.org/2000/svg","tspan");e.setAttribute("alignment-baseline","central"),e.setAttribute("x","10"),t>0&&e.setAttribute("dy","1em"),e.textContent=r,n.appendChild(e)}return n}).attr("x",10).attr("y",function(r,a){if(!(a>0))return r[1]*t/2+e;for(let s=0;s<a;s++)return i+=n[a-1][1],r[1]*t/2+i*t+e}).attr("font-size",l.sectionFontSize).attr("class",function(t){for(let[e,i]of b.entries())if(t[0]===i)return"sectionTitle sectionTitle"+e%l.numberSectionStyles;return"sectionTitle"})}function A(t,e,i,n){let a=r.db.getTodayMarker();if("off"===a)return;let s=T.append("g").attr("class","today"),o=new Date,c=s.append("line");c.attr("x1",w(o)+t).attr("x2",w(o)+t).attr("y1",l.titleTopMargin).attr("y2",n-l.titleTopMargin).attr("class","today"),""!==a&&c.attr("style",a.replace(/,/g,";"))}function Y(t){let e={},i=[];for(let n=0,r=t.length;n<r;++n)Object.prototype.hasOwnProperty.call(e,t[n])||(e[t[n]]=!0,i.push(t[n]));return i}(0,s.__name)(D,"taskCompare"),_.sort(D),$(_,n,x),(0,a.configureSvgSize)(T,x,n,l.useMaxWidth),T.append("text").text(r.db.getDiagramTitle()).attr("x",n/2).attr("y",l.titleTopMargin).attr("class","titleText"),(0,s.__name)($,"makeGantt"),(0,s.__name)(C,"drawRects"),(0,s.__name)(S,"drawExcludeDays"),(0,s.__name)(M,"makeGrid"),(0,s.__name)(E,"vertLabels"),(0,s.__name)(A,"drawToday"),(0,s.__name)(Y,"checkUnique")},"draw")},styles:(0,s.__name)(t=>`
  .mermaid-main-font {
        font-family: ${t.fontFamily};
  }

  .exclude-range {
    fill: ${t.excludeBkgColor};
  }

  .section {
    stroke: none;
    opacity: 0.2;
  }

  .section0 {
    fill: ${t.sectionBkgColor};
  }

  .section2 {
    fill: ${t.sectionBkgColor2};
  }

  .section1,
  .section3 {
    fill: ${t.altSectionBkgColor};
    opacity: 0.2;
  }

  .sectionTitle0 {
    fill: ${t.titleColor};
  }

  .sectionTitle1 {
    fill: ${t.titleColor};
  }

  .sectionTitle2 {
    fill: ${t.titleColor};
  }

  .sectionTitle3 {
    fill: ${t.titleColor};
  }

  .sectionTitle {
    text-anchor: start;
    font-family: ${t.fontFamily};
  }


  /* Grid and axis */

  .grid .tick {
    stroke: ${t.gridColor};
    opacity: 0.8;
    shape-rendering: crispEdges;
  }

  .grid .tick text {
    font-family: ${t.fontFamily};
    fill: ${t.textColor};
  }

  .grid path {
    stroke-width: 0;
  }


  /* Today line */

  .today {
    fill: none;
    stroke: ${t.todayLineColor};
    stroke-width: 2px;
  }


  /* Task styling */

  /* Default task */

  .task {
    stroke-width: 2;
  }

  .taskText {
    text-anchor: middle;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideRight {
    fill: ${t.taskTextDarkColor};
    text-anchor: start;
    font-family: ${t.fontFamily};
  }

  .taskTextOutsideLeft {
    fill: ${t.taskTextDarkColor};
    text-anchor: end;
  }


  /* Special case clickable */

  .task.clickable {
    cursor: pointer;
  }

  .taskText.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideLeft.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }

  .taskTextOutsideRight.clickable {
    cursor: pointer;
    fill: ${t.taskTextClickableColor} !important;
    font-weight: bold;
  }


  /* Specific task settings for the sections*/

  .taskText0,
  .taskText1,
  .taskText2,
  .taskText3 {
    fill: ${t.taskTextColor};
  }

  .task0,
  .task1,
  .task2,
  .task3 {
    fill: ${t.taskBkgColor};
    stroke: ${t.taskBorderColor};
  }

  .taskTextOutside0,
  .taskTextOutside2
  {
    fill: ${t.taskTextOutsideColor};
  }

  .taskTextOutside1,
  .taskTextOutside3 {
    fill: ${t.taskTextOutsideColor};
  }


  /* Active task */

  .active0,
  .active1,
  .active2,
  .active3 {
    fill: ${t.activeTaskBkgColor};
    stroke: ${t.activeTaskBorderColor};
  }

  .activeText0,
  .activeText1,
  .activeText2,
  .activeText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Completed task */

  .done0,
  .done1,
  .done2,
  .done3 {
    stroke: ${t.doneTaskBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
  }

  .doneText0,
  .doneText1,
  .doneText2,
  .doneText3 {
    fill: ${t.taskTextDarkColor} !important;
  }


  /* Tasks on the critical line */

  .crit0,
  .crit1,
  .crit2,
  .crit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.critBkgColor};
    stroke-width: 2;
  }

  .activeCrit0,
  .activeCrit1,
  .activeCrit2,
  .activeCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.activeTaskBkgColor};
    stroke-width: 2;
  }

  .doneCrit0,
  .doneCrit1,
  .doneCrit2,
  .doneCrit3 {
    stroke: ${t.critBorderColor};
    fill: ${t.doneTaskBkgColor};
    stroke-width: 2;
    cursor: pointer;
    shape-rendering: crispEdges;
  }

  .milestone {
    transform: rotate(45deg) scale(0.8,0.8);
  }

  .milestoneText {
    font-style: italic;
  }
  .doneCritText0,
  .doneCritText1,
  .doneCritText2,
  .doneCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .vert {
    stroke: ${t.vertLineColor};
  }

  .vertText {
    font-size: 15px;
    text-anchor: middle;
    fill: ${t.vertLineColor} !important;
  }

  .activeCritText0,
  .activeCritText1,
  .activeCritText2,
  .activeCritText3 {
    fill: ${t.taskTextDarkColor} !important;
  }

  .titleText {
    text-anchor: middle;
    font-size: 18px;
    fill: ${t.titleColor||t.textColor};
    font-family: ${t.fontFamily};
  }
`,"getStyles")};t.s(["diagram",()=>ea],249592)}]);