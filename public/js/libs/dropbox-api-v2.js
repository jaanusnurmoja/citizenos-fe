(function(){var e,o,n,t,r,i,s,a,l,c;null==window.Dropbox&&(window.Dropbox={}),null==Dropbox.baseUrl&&(Dropbox.baseUrl="https://www.dropbox.com"),null==Dropbox.blockBaseUrl&&(Dropbox.blockBaseUrl="https://dl-web.dropbox.com"),Dropbox.addListener=function(e,o,n){e.addEventListener?e.addEventListener(o,n,!1):e.attachEvent("on"+o,function(e){return e.preventDefault=function(){return this.returnValue=!1},n(e)})},Dropbox.removeListener=function(e,o,n){e.removeEventListener?e.removeEventListener(o,n,!1):e.detachEvent("on"+o,n)},e=function(e){var o,n;return n=encodeURIComponent(Dropbox.VERSION),o=e.indexOf("?")===-1?"?":"&",""+e+o+"version="+n},o=function(o,n){var t,r,i,s,a,l,c,d,p;return l=encodeURIComponent(window.location.protocol+"//"+window.location.host),t=encodeURIComponent(Dropbox.appKey),s=encodeURIComponent(o.linkType||""),d=encodeURIComponent(o._trigger||"js"),a=Boolean(o.multiselect),r=encodeURIComponent((null!=(c=o.extensions)&&"function"==typeof c.join?c.join(" "):void 0)||""),i=Boolean(o.folderselect),n=Boolean(n),p=Dropbox.baseUrl+"/chooser?origin="+l+"&app_key="+t+"&link_type="+s,p+="&trigger="+d+"&multiselect="+a+"&extensions="+r+"&folderselect="+i+"&iframe="+n,e(p)},c=function(){var o,n,t;return n=encodeURIComponent(window.location.protocol+"//"+window.location.host),o=encodeURIComponent(Dropbox.appKey),t=Dropbox.baseUrl+"/saver?origin="+n+"&app_key="+o,e(t)},a=1,r=function(o,n){var t,r,i,s;if(t=encodeURIComponent(Dropbox.appKey),s=Dropbox.baseUrl+"/dropins/job_status?job="+n+"&app_key="+t,s=e(s),i=function(e){var n;"COMPLETE"===e.status?("function"==typeof o.progress&&o.progress(1),"function"==typeof o.success&&o.success()):"PENDING"===(n=e.status)||"DOWNLOADING"===n?(null!=e.progress&&"function"==typeof o.progress&&o.progress(e.progress/100),setTimeout(r,1500)):"FAILED"===e.status&&"function"==typeof o.error&&o.error(e.error)},"withCredentials"in new XMLHttpRequest)r=function(){var e;return e=new XMLHttpRequest,e.onload=function(){return i(JSON.parse(e.responseText))},e.onerror=function(){return"function"==typeof o.error?o.error():void 0},e.open("GET",s,!0),e.send()};else if(Dropbox.disableJSONP){if("undefined"==typeof XDomainRequest||null===XDomainRequest||"https:"!==document.location.protocol)throw new Error("Unable to find suitable means of cross domain communication");r=function(){var e;return e=new XDomainRequest,e.onload=function(){return i(JSON.parse(e.responseText))},e.onerror=function(){return"function"==typeof o.error?o.error():void 0},e.open("get",s),e.send()}}else r=function(){var e,n,t;return e="DropboxJsonpCallback"+a++,n=!1,window[e]=function(e){return n=!0,i(e)},t=document.createElement("script"),t.src=s+"&callback="+e,t.onreadystatechange=function(){var e;if("loaded"===t.readyState)return n||"function"==typeof o.error&&o.error(),null!=(e=t.parentNode)?e.removeChild(t):void 0},document.getElementsByTagName("head")[0].appendChild(t)};return"function"==typeof o.progress&&o.progress(0),r()},i=function(e,o,n){var i,a,l,c,d,p,u;switch(a=JSON.parse(e.data),l=void 0!==s&&null!==s&&n._popup?s.contentWindow:e.source,a.method){case"origin_request":e.source.postMessage(JSON.stringify({method:"origin"}),Dropbox.baseUrl);break;case"ready":null!=n.files&&(n._fetch_url_on_save?(u=(function(){var e,o,t,r;for(t=n.files,r=[],e=0,o=t.length;e<o;e++)d=t[e],r.push({filename:d.filename});return r})(),p=JSON.stringify({method:"files_with_callback",params:u})):p=JSON.stringify({method:"files",params:n.files}),l.postMessage(p,Dropbox.baseUrl),null!=n._ews_auth_token&&(c=JSON.stringify({method:"ews_auth_token",params:{ews_auth_token:n._ews_auth_token}}),l.postMessage(c,Dropbox.baseUrl))),"function"==typeof n.ready&&n.ready();break;case"files_selected":case"files_saved":"function"==typeof o&&o(),"function"==typeof n.success&&n.success(a.params);break;case"progress":"function"==typeof n.progress&&n.progress(a.params);break;case"close_dialog":"function"==typeof o&&o(),"function"==typeof n.cancel&&n.cancel();break;case"web_session_error":"function"==typeof o&&o(),"function"==typeof n.webSessionFailure&&n.webSessionFailure();break;case"web_session_unlinked":"function"==typeof o&&o(),"function"==typeof n.webSessionUnlinked&&n.webSessionUnlinked();break;case"resize":"function"==typeof n.resize&&n.resize(a.params);break;case"error":"function"==typeof o&&o(),"function"==typeof n.error&&n.error(a.params);break;case"job_id":"function"==typeof o&&o(),r(n,a.params);break;case"save_callback":i=function(e){if(null==e)throw new Error("Please supply {urls: [...]} to success callback");if(null!=e.url&&null!=e.urls)throw new Error("Do not pass both url and urls to the save callback");if(null!=e.url&&(e.urls=[e.url]),null==e.urls)throw new Error("Please supply {urls: [...]} to success callback");a={method:"continue_saving",params:{download_urls:e.urls}},l.postMessage(JSON.stringify(a),Dropbox.baseUrl)},t(n,a.params,i);break;case"_debug_log":"undefined"!=typeof console&&null!==console&&console.log(a.params.msg)}},t=function(e,o,n){var t;e._fetch_url_on_save&&(t=e.fetch_urls_fn,"function"!=typeof t&&"function"==typeof e.error&&e.error("Something went wrong, file url callback not provided."),t(n,o))},s=null,n=function(){/\bTrident\b/.test(navigator.userAgent)&&null!=document.body&&null==s&&(s=document.createElement("iframe"),s.setAttribute("id","dropbox_xcomm"),s.setAttribute("src",Dropbox.baseUrl+"/static/api/1/xcomm.html"),s.style.display="none",document.body.appendChild(s))},Dropbox.createChooserWidget=function(e){var n;return n=x(o(e,!0)),n._handler=function(o){o.source===n.contentWindow&&o.origin===Dropbox.baseUrl&&i(o,null,e)},Dropbox.addListener(window,"message",n._handler),n},Dropbox.cleanupWidget=function(e){if(!e._handler)throw new Error("Invalid widget!");Dropbox.removeListener(window,"message",e._handler),delete e._handler},l=function(e,o){var n,t;return n=(window.screenX||window.screenLeft)+((window.outerWidth||document.documentElement.offsetWidth)-e)/2,t=(window.screenY||window.screenTop)+((window.outerHeight||document.documentElement.offsetHeight)-o)/2,"width="+e+",height="+o+",left="+n+",top="+t};var d,p,u,f,b,m,x,h,g,w,y,v,_,k,D,E,S,N,C=[].slice,U=[].indexOf||function(e){for(var o=0,n=this.length;o<n;o++)if(o in this&&this[o]===e)return o;return-1};if(Dropbox._dropinsjs_loaded)return void("undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn("dropins.js included more than once"));Dropbox._dropinsjs_loaded=!0,null==Dropbox.appKey&&(Dropbox.appKey=null!=(E=document.getElementById("dropboxjs"))?E.getAttribute("data-app-key"):void 0),f=function(e){return e},d="https://www.dropbox.com/developers/dropins/chooser/js",u=["text","documents","images","video","audio"],Dropbox.init=function(e){null!=e.translation_function&&(f=e.translation_function),null!=e.appKey&&(Dropbox.appKey=e.appKey)},x=function(e){var o;return o=document.createElement("iframe"),o.src=e,o.style.display="block",o.style.backgroundColor="white",o.style.border="none",o},D=function(e){var o,n,t,r,i,s,a,l,c;if("string"==typeof e[0])c=e.shift(),n="string"==typeof e[0]?e.shift():y(c),s=e.shift()||{},s.files=[{url:c,filename:n}];else{if(s=e.shift(),null==s)throw new Error("Missing arguments. See documentation.");if((null==(a=s.files)||!a.length)&&"function"!=typeof s.files)throw new Error("Missing files. See documentation.");if(null!=s.fetch_urls_fn){if("function"!=typeof s.fetch_urls_fn)throw new Error("fetch_urls_fn must be a function if supplied.  See documentation.");s._fetch_url_on_save=!0}for(l=s.files,t=r=0,i=l.length;r<i;t=++r){if(o=l[t],"function"==typeof o.url&&(s._fetch_url_on_save=!0,s.fetch_urls_fn=o.url,o.url=null,t>0))throw new Error("Old style url as callback is only supported for single files.");o.filename||(o.filename=y(o.url))}}return s},Dropbox.save=function(){var e,o,n,t,r,i,s;if(e=1<=arguments.length?C.call(arguments,0):[],i=D(e),!Dropbox.isBrowserSupported())return void alert(f("Your browser does not support the Dropbox Saver"));if(i._popup=!0,"object"!=typeof i.files||!i.files.length)throw new Error("The object passed in must have a 'files' property that contains a list of objects. See documentation.");if(i.iframe&&!i.windowName)throw new Error("Dropbox.save does not yet support creating its own iframe. windowName must be provided when the iframe option is present.");for(s=i.files,t=0,r=s.length;t<r;t++)if(n=s[t],i._fetch_url_on_save){if(i.fetch_urls_fn){if(null!=n.url)throw new Error("You passed in a 'fetch_urls_fn' option to specify the file URLs.  Don't include individual URLs in each file objects.")}else if("function"!=typeof n.url)throw new Error("File urls should be all urls, or a single file with function. See documentation.")}else if("string"!=typeof n.url)throw new Error("File urls to download incorrectly configured. Each file must have a url. See documentation.");return o=l(352,237),k(c(),o,i)},k=function(e,o,n){var t,r,a,l,c,d;if(a=function(){t.closed||(t.close(),t.postMessage(JSON.stringify({method:"close"}),Dropbox.baseUrl)),Dropbox.removeListener(window,"message",l),clearInterval(d)},l=function(e){e.source!==t&&e.source!==(void 0!==s&&null!==s?s.contentWindow:void 0)||i(e,a,n)},c=function(){(function(){try{return t.closed}catch(e){}})()&&(a(),"function"==typeof n.cancel&&n.cancel())},r=n.iframe?"":o+",resizable,scrollbars",t=window.open(e,n.windowName||"dropbox",r),!t)throw new Error("Failed to open/load the window. Dropbox.choose and Dropbox.save should only be called from within a user-triggered event handler such as a tap or click event.");return t.focus(),d=setInterval(c,100),Dropbox.addListener(window,"message",l),t},N=function(e){var o,n,t,r,i;if(null==e.success&&"undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn("You must provide a success callback to the Chooser to see the files that the user selects"),n=function(){return"undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn("The provided list of extensions or file types is not valid. See Chooser documentation: "+d),"undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn("Available file types are: "+u.join(", ")),delete e.extensions},null!=e.extensions&&null!=Array.isArray)if(Array.isArray(e.extensions))for(i=e.extensions,t=0,r=i.length;t<r;t++)o=i[t],!o.match(/^\.[\.\w$#&+@!()\-'`_~]+$/)&&U.call(u,o)<0&&n();else n();return e},b=function(e){var n,t,r,s,a,c;if(!Dropbox.isBrowserSupported())return void alert(f("Your browser does not support the Dropbox Chooser"));c=640,r=552,e.iframe&&!e.windowName?(a=x(o(e,!0)),a.style.width=c+"px",a.style.height=r+"px",a.style.margin="125px auto 0 auto",a.style.border="1px solid #ACACAC",a.style.boxShadow="rgba(0, 0, 0, .2) 0px 4px 16px",s=document.createElement("div"),s.style.position="fixed",s.style.left=s.style.right=s.style.top=s.style.bottom="0",s.style.zIndex="1000",s.style.backgroundColor="rgba(160, 160, 160, 0.2)",s.appendChild(a),document.body.appendChild(s),t=function(o){o.source===a.contentWindow&&i(o,function(){document.body.removeChild(s),Dropbox.removeListener(window,"message",t)},e)},Dropbox.addListener(window,"message",t)):(n=l(c,r),k(o(e,e.iframe),n,e))},Dropbox.choose=function(e){null==e&&(e={}),e=N(e),b(e)},Dropbox.isBrowserSupported=function(){var e;return e=v(),Dropbox.isBrowserSupported=function(){return e},e},v=function(){var e,o,n,t;for(t=[/IEMobile\/(7|8|9|10)\./,/BB10;/,/CriOS/],o=0,n=t.length;o<n;o++)if(e=t[o],e.test(navigator.userAgent))return!1;return"undefined"!=typeof JSON&&null!==JSON&&null!=window.postMessage&&null!=window.addEventListener},w=function(e){return e.replace(/\/+$/g,"").split("/").pop()},y=function(e){var o;return o=document.createElement("a"),o.href=e,w(o.pathname)},m=function(e,o){var n;return null!=o?o.innerHTML="":(o=document.createElement("a"),o.href="#"),o.className+=" dropbox-dropin-btn",Dropbox.isBrowserSupported()?o.className+=" dropbox-dropin-default":o.className+=" dropbox-dropin-disabled",n=document.createElement("span"),n.className="dropin-btn-status",o.appendChild(n),e=document.createTextNode(e),o.appendChild(e),o},Dropbox.createChooseButton=function(e){var o;return null==e&&(e={}),e=N(e),o=m(f("Choose from Dropbox")),Dropbox.addListener(o,"click",function(n){n.preventDefault(),b({success:function(n){o.className="dropbox-dropin-btn dropbox-dropin-success","function"==typeof e.success&&e.success(n)},cancel:e.cancel,linkType:e.linkType,multiselect:e.multiselect,folderselect:e.folderselect,extensions:e.extensions,iframe:e.iframe,_trigger:"button"})}),o},Dropbox.createSaveButton=function(){var e,o,n;return e=1<=arguments.length?C.call(arguments,0):[],n=D(e),o=e.shift(),o=m(f("Save to Dropbox"),o),Dropbox.addListener(o,"click",function(e){var t;if(e.preventDefault(),o.className.indexOf("dropbox-dropin-error")>=0||o.className.indexOf("dropbox-dropin-default")>=0||o.className.indexOf("dropbox-dropin-disabled")>=0){if(t=("function"==typeof n.files?n.files():void 0)||n.files,!(null!=t?t.length:void 0))return o.className="dropbox-dropin-btn dropbox-dropin-error",void("function"==typeof n.error&&n.error("Missing files"));Dropbox.save({files:t,success:function(){o.className="dropbox-dropin-btn dropbox-dropin-success","function"==typeof n.success&&n.success()},progress:function(e){o.className="dropbox-dropin-btn dropbox-dropin-progress","function"==typeof n.progress&&n.progress(e)},cancel:function(){"function"==typeof n.cancel&&n.cancel()},error:function(e){o.className="dropbox-dropin-btn dropbox-dropin-error","function"==typeof n.error&&n.error(e)}})}}),o},_=function(e,o){return"background: "+e+";\nbackground: -moz-linear-gradient(top, "+e+" 0%, "+o+" 100%);\nbackground: -webkit-linear-gradient(top, "+e+" 0%, "+o+" 100%);\nbackground: linear-gradient(to bottom, "+e+" 0%, "+o+" 100%);\nfilter: progid:DXImageTransform.Microsoft.gradient(startColorstr='"+e+"', endColorstr='"+o+"',GradientType=0);"},h=document.createElement("style"),h.type="text/css",g='@-webkit-keyframes rotate {\n  from  { -webkit-transform: rotate(0deg); }\n  to   { -webkit-transform: rotate(360deg); }\n}\n\n@keyframes rotate {\n  from  { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}\n\n.dropbox-dropin-btn, .dropbox-dropin-btn:link, .dropbox-dropin-btn:hover {\n  display: inline-block;\n  height: 14px;\n  font-family: "Lucida Grande", "Segoe UI", "Tahoma", "Helvetica Neue", "Helvetica", sans-serif;\n  font-size: 11px;\n  font-weight: 600;\n  color: #636363;\n  text-decoration: none;\n  padding: 1px 7px 5px 3px;\n  border: 1px solid #ebebeb;\n  border-radius: 2px;\n  border-bottom-color: #d4d4d4;\n  '+_("#fcfcfc","#f5f5f5")+"\n}\n\n.dropbox-dropin-default:hover, .dropbox-dropin-error:hover {\n  border-color: #dedede;\n  border-bottom-color: #cacaca;\n  "+_("#fdfdfd","#f5f5f5")+"\n}\n\n.dropbox-dropin-default:active, .dropbox-dropin-error:active {\n  border-color: #d1d1d1;\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);\n}\n\n.dropbox-dropin-btn .dropin-btn-status {\n  display: inline-block;\n  width: 15px;\n  height: 14px;\n  vertical-align: bottom;\n  margin: 0 5px 0 2px;\n  background: transparent url('"+Dropbox.baseUrl+"/static/images/widgets/dbx-saver-status.png') no-repeat;\n  position: relative;\n  top: 2px;\n}\n\n.dropbox-dropin-default .dropin-btn-status {\n  background-position: 0px 0px;\n}\n\n.dropbox-dropin-progress .dropin-btn-status {\n  width: 18px;\n  margin: 0 4px 0 0;\n  background: url('"+Dropbox.baseUrl+"/static/images/widgets/dbx-progress.png') no-repeat center center;\n  -webkit-animation-name: rotate;\n  -webkit-animation-duration: 1.7s;\n  -webkit-animation-iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n  animation-name: rotate;\n  animation-duration: 1.7s;\n  animation-iteration-count: infinite;\n  animation-timing-function: linear;\n}\n\n.dropbox-dropin-success .dropin-btn-status {\n  background-position: -15px 0px;\n}\n\n.dropbox-dropin-disabled {\n  background: #e0e0e0;\n  border: 1px #dadada solid;\n  border-bottom: 1px solid #ccc;\n  box-shadow: none;\n}\n\n.dropbox-dropin-disabled .dropin-btn-status {\n  background-position: -30px 0px;\n}\n\n.dropbox-dropin-error .dropin-btn-status {\n  background-position: -45px 0px;\n}\n\n@media only screen and (-webkit-min-device-pixel-ratio: 1.4) {\n  .dropbox-dropin-btn .dropin-btn-status {\n    background-image: url('"+Dropbox.baseUrl+"/static/images/widgets/dbx-saver-status-2x.png');\n    background-size: 60px 14px;\n    -webkit-background-size: 60px 14px;\n  }\n\n  .dropbox-dropin-progress .dropin-btn-status {\n    background: url('"+Dropbox.baseUrl+"/static/images/widgets/dbx-progress-2x.png') no-repeat center center;\n    background-size: 20px 20px;\n    -webkit-background-size: 20px 20px;\n  }\n}\n\n.dropbox-saver:hover, .dropbox-chooser:hover {\n  text-decoration: none;\n  cursor: pointer;\n}\n\n.dropbox-chooser, .dropbox-dropin-btn {\n  line-height: 11px !important;\n  text-decoration: none !important;\n  box-sizing: content-box !important;\n  -webkit-box-sizing: content-box !important;\n  -moz-box-sizing: content-box !important;\n}\n",h.styleSheet?h.styleSheet.cssText=g:h.textContent=g,document.getElementsByTagName("head")[0].appendChild(h),setTimeout(n,0),p=function(){document.removeEventListener?document.removeEventListener("DOMContentLoaded",p,!1):document.detachEvent&&document.detachEvent("onreadystatechange",p),n(),L()},"interactive"===(S=document.readyState)||"complete"===S?setTimeout(p,0):document.addEventListener?document.addEventListener("DOMContentLoaded",p,!1):document.attachEvent("onreadystatechange",p);var L,U=[].indexOf||function(e){for(var o=0,n=this.length;o<n;o++)if(o in this&&this[o]===e)return o;return-1};Dropbox.VERSION="2",L=function(){var e,o,n,t;for(t=document.getElementsByTagName("a"),o=0,n=t.length;o<n;o++)e=t[o],U.call((e.getAttribute("class")||"").split(" "),"dropbox-saver")>=0&&(function(e){Dropbox.createSaveButton({files:function(){return[{url:e.getAttribute("data-url")||e.href,filename:e.getAttribute("data-filename")||w(e.pathname)}]}},e)})(e)}}).call(this);
//# sourceMappingURL=dropins_sdk_v2.min.js.map