(function(a){a.fn.quicksand=function(y,r,t){var b={duration:750,easing:"swing",attribute:"data-id",adjustHeight:"auto",useScaling:true,enhancement:function(){},selector:"> *"};a.extend(b,r);if(a.browser.msie||typeof a.fn.scale=="undefined")b.useScaling=false;var o;if(typeof r=="function")o=r;else if(typeof(t=="function"))o=t;return this.each(function(k){var m,i=[],l=a(y).clone(),g=a(this);k=a(this).css("height");var p,u=false,v=a(g).offset(),s=[],n=a(this).find(b.selector);if(a.browser.msie&&a.browser.version.substr(0,
1)<7)g.html("").append(l);else{var w=0,z=function(){if(!w){g.html(j.html());typeof o=="function"&&o.call(this);u&&g.css("height",p);b.enhancement(g);w=1}},c=g.offsetParent(),e=c.offset();if(c.css("position")=="relative"){if(c.get(0).nodeName.toLowerCase()!="body"){e.top+=parseFloat(c.css("border-top-width"));e.left+=parseFloat(c.css("border-left-width"))}}else{e.top-=parseFloat(c.css("border-top-width"));e.left-=parseFloat(c.css("border-left-width"));e.top-=parseFloat(c.css("margin-top"));e.left-=
parseFloat(c.css("margin-left"))}g.css("height",a(this).height());n.each(function(f){s[f]=a(this).offset()});a(this).stop();n.each(function(f){a(this).stop();var h=a(this).get(0);h.style.position="absolute";h.style.margin="0";h.style.top=s[f].top-parseFloat(h.style.marginTop)-e.top+"px";h.style.left=s[f].left-parseFloat(h.style.marginLeft)-e.left+"px"});var j=a(g).clone();c=j.get(0);c.innerHTML="";c.setAttribute("id","");c.style.height="auto";c.style.width=g.width()+"px";j.append(l);j.insertBefore(g);
j.css("opacity",0);c.style.zIndex=-1;c.style.margin="0";c.style.position="absolute";c.style.top=v.top-e.top+"px";c.style.left=v.left-e.left+"px";if(b.adjustHeight==="dynamic")g.animate({height:j.height()},b.duration,b.easing);else if(b.adjustHeight==="auto"){p=j.height();if(parseFloat(k)<parseFloat(p))g.css("height",p);else u=true}n.each(function(){var f=[];if(typeof b.attribute=="function"){m=b.attribute(a(this));l.each(function(){if(b.attribute(this)==m){f=a(this);return false}})}else f=l.filter("["+
b.attribute+"="+a(this).attr(b.attribute)+"]");if(f.length)b.useScaling?i.push({element:a(this),animation:{top:f.offset().top-e.top,left:f.offset().left-e.left,opacity:1,scale:"1.0"}}):i.push({element:a(this),animation:{top:f.offset().top-e.top,left:f.offset().left-e.left,opacity:1}});else b.useScaling?i.push({element:a(this),animation:{opacity:"0.0",scale:"0.0"}}):i.push({element:a(this),animation:{opacity:"0.0"}})});l.each(function(){var f=[],h=[];if(typeof b.attribute=="function"){m=b.attribute(a(this));
n.each(function(){if(b.attribute(this)==m){f=a(this);return false}});l.each(function(){if(b.attribute(this)==m){h=a(this);return false}})}else{f=n.filter("["+b.attribute+"="+a(this).attr(b.attribute)+"]");h=l.filter("["+b.attribute+"="+a(this).attr(b.attribute)+"]")}var x;if(f.length===0){x=b.useScaling?{opacity:"1.0",scale:"1.0"}:{opacity:"1.0"};d=h.clone();var q=d.get(0);q.style.position="absolute";q.style.margin="0";q.style.top=h.offset().top-e.top+"px";q.style.left=h.offset().left-e.left+"px";
d.css("opacity",0);b.useScaling&&d.css("transform","scale(0.0)");d.appendTo(g);i.push({element:a(d),animation:x})}});j.remove();b.enhancement(g);for(k=0;k<i.length;k++)i[k].element.animate(i[k].animation,b.duration,b.easing,z)}})}})(jQuery);

jQuery.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};