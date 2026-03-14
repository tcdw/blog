---
title: "用 Flash 实现读取 QQ 空间背景音乐列表"
description: "代码如下：  javascript System.useCodepage=true; var singer:Array=new Array(); var songname:Array=new Array(); var songurl:Array=new Array(); function a(a, b, c) {"
pubDate: "2011-08-30T10:03:00.000Z"
---

代码如下：

```javascript
System.useCodepage=true;
var singer:Array=new Array();
var songname:Array=new Array();
var songurl:Array=new Array();
function a(a, b, c) {
    return a.split(b).join(c);
}
function rdmtxt(num:Number){
    r="`1234567890-=\qwertyuiop[]asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+|QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?";
    r=r.split("");
    rr="";
    for(z=0;z<num;z++){
        rr+=r[random(r.length)];
    }
    return rr;
}
function qzoneMusic(uin) {
    my_lv = new LoadVars();
    my_lv.load("http://qzone-music.qq.com/fcg-bin/cgi_playlist_xml.fcg?json=1&uin="+uin);
    singer=new Array();
    songname=new Array();
    songurl=new Array();
    gl=rdmtxt(20);
    my_lv.onData = function(d) {
        e=d;
        e=a(e,"jsonCallback({qqmusic:{curtime:","");
        e=a(e,",issmarter:","");
        e=a(e,",systemtime:","");
        e=a(e,",xmusicnum:","");
        e=a(e,",playlist:{song:[",gl);
        e=a(e,"]}}})",",");
        f=e.split(gl);
        g=f[1];
        g=g.split("},");
        for(i=0;i<(g.length-1);i++){
            h=g[i];
            h=a(h,",xsong_name:\"",gl);
            h=a(h,"\",xsinger_id:",gl);
            h=a(h,",xsinger_name:\"",gl);
            h=a(h,"\",xsong_url:'",gl);
            h=a(h,"',xsong_dissid:",gl);
            ii=h.split(gl);
            songname.push(ii[1]);
            singer.push(ii[3]);
            songurl.push(ii[4]);
            trace(songname[i]+"|"+singer[i]+"|"+songurl[i]);
        }
    };
}
qzoneMusic(576135687);
```

把这些代码拷到 Flash 里，然后把最后一行括号中的 QQ 号码换成要查询的 QQ 号码，然后测试，不一会，就会输出查询结果了。

**下次再也不去那个查询网站了！**

至于那是什么网站，你懂得。
