---
title: "黑历史：在 Flash 里手撕 HTML 与 JSON"
description: "2010 年，还是小学生的我，为了开发更好的 Flash 应用，决定使用一些知名网站的结果，实现我的梦想！  我很早就学会了 JavaScript 的 split 和 join 方法，然而我想用一些替换功能，把 HTML 的一些段落替换掉再拆解。我开动脑洞，发明了这个：  javascript"
pubDate: "2017-04-14T06:09:01.000Z"
---

2010 年，还是小学生的我，为了开发更好的 Flash 应用，决定使用一些知名网站的结果，实现我的梦想！

我很早就学会了 JavaScript 的 `split` 和 `join` 方法，然而我想用一些替换功能，把 HTML 的一些段落替换掉再拆解。我开动脑洞，发明了这个：

```javascript
replace = function (a, b, c) {
  return a.split(b).join(c);
};
```

下面让我介绍一些成功故事（

## 2012：贴吧帖子列表读取

当时我想抓取特定贴吧上的所有帖子，因为一些帖子会被吧务删掉，但我又不会其它语言，就用 Flash 做了一个。结果坑没填完，我放弃了，贴吧页面板式也变了，它失效了。

```javascript
System.useCodepage = true;
function replace(a, b, c) {
	return a.split(b).join(c);
}
function del(a, b, n) {
	return a.split(b)[n];
}
function rdmtxt(num:Number) {
	r = "`1234567890-=\qwertyuiop[]asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+|QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?";
	r = r.split("");
	rr = "";
	for (z=0; z<num; z++) {
		rr += r[random(r.length)];
	}
	return rr;
}
var now:Number = 0;
var dc:Number = 0;
var dddd:String = "";
function readTB(tbn,nn) {
	trace(1);
	var 度娘:LoadVars = new LoadVars();
	度娘.load("http://tieba.baidu.com/f?kw="+escape(tbn)+"&pn="+nn*50+"&"+Math.random());
	度娘.onData = function(dat) {
		ia = '<a href="/p/';
		ib = rdmtxt(20);
		dd = dat;
		trace(dd);
		dd = del(dd, '<div id="thread_list" class="thread_list">', 1);
		dd = replace(dd, "	", "");
		dd = replace(dd, "\n", "");
		dd = replace(dd, "\r", "");
		trace(dd);
		for (i=0; i<256; i++) {
			dd = replace(dd, '</a></td><td nowrap>'+i, ib+""+i);
		}
		dd = replace(dd, '</a></td><td nowrap>', "");
		dd = replace(dd, '</a></td></tr><tr  class="thread_alt" tid="', "");
		dd = replace(dd, '<a href="/i/sys/jump?un=', ib);
		dd = replace(dd, '" target="_blank">', ib);
		for (i=0; i<24; i++) {
			if (i<10) {
				dd = replace(dd, '.*0'+i+':', ".*"+ib);
			} else {
				dd = replace(dd, '.*'+i+':', ".*"+ib);
			}
		}
		dd = replace(dd, '</a>[<span class="red">精品</span>] ', "[精品]");
		dd = replace(dd, '</a>[<span class="red">置顶</span>] ', "[置顶]");
		dd = replace(dd, '[<span class="red">置顶</span>] ', "[置顶]");
		dd = replace(dd, '<img class="ding_icon" src="http://static.tieba.baidu.com/tb/img/frs/icon_ding.gif?v=3"  title="很多人顶" stats-data="fr=tb0_forum&st_mod=frs&st_type=comtip" stats-event="mouseover" />', "[很多人顶]");
		dd = replace(dd, '</td><td nowrap>', "");
		dd = replace(dd, '</a>[<span class="green">投票</span>] ', "[投票]");
		for (i=1; i<13; i++) {
			dd = replace(dd, '.*'+i+'-', ".*"+ib);
		}
		var dd2:Array = dd.split(ia);
		var tieba:Array = new Array();
		dd2.shift();
		dd2.pop();
		for (i=0; i<dd2.length; i++) {
			dd3 = dd2[i].split(ib);
			tieba[i] = new Object({id:dd3[0], threadtitle:dd3[1], louzhu:unescape(dd3[2])});
			trace(tieba[i].id+"|"+tieba[i].threadtitle+"|"+tieba[i].louzhu);
		}
	}
}
readTB("永吧大水库",0);
```

## 2012：手撕百度云实现外链解析

半成品，仅适用于 2012 年内测版本的百度云。过了一段时间这半成品完全废了。

```javascript
function rdmtxt(num:Number) {
    r = "`1234567890-=\qwertyuiop[]asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+|QWERTYUIOP{}ASDFGHJKL:\"ZXCVBNM<>?";
    r = r.split("");
    rr = "";
    for (z=0; z<num; z++) {
        rr += r[random(r.length)];
    }
    return rr;
}
rePlace = function (a, b, c) {
    return a.split(b).join(c);
};
jdglfh = function(){
    var glfh:String = rdmtxt(10);
    var glfh1:String = rdmtxt(10);
    if(glfh == glfh1){//好吧，我承认这种情况发生几乎不可能
        jdglfh();
    }
}
getBaidu = function (aaaa) {
    jdglfh();
    k = new LoadVars();
    k.load("http://pan.baidu.com/netdisk/extractpublic?username="+aaaa);
    trace(aaaa);
    k.onLoad = function(scs) {
        if (!scs) {
            trace("未能连接到度娘网盘");
            parseBaidu = false;
        }
    };
    k.onData = function(aaa) {
        trace("网页部分完成");
        var u0:Array = new Array();
        //trace(aaa);
        asd = rePlace(asd, '\/', '');
        asd = rePlace(asd, '"fs_id":"', glfh);
        asd = rePlace(asd, '}]");/*]]>*/</script>', glfh);
        asd = rePlace(asd, '","s3_handle":"', glfh2);
        asd = rePlace(asd, '","size":', glfh2);
        u0 = asd.split(glfh);
        u0.shift();
        u0.pop();
        trace(u0);
    };
};
getBaidu("tcdw2011");
```

## 2012：手撕 115 JSON 实现外链解析

我没有外链空间又想做 Flash 在线播放器，于是通过解析 115 外链，在 Flash 中实现了播放在 115 网盘分享的 MP3。

然而几个月以后就失效了。

```javascript
// 此段代码略去了若干关于播放器本体的逻辑

rr = function (a, b, c) {
  return a.split(b).join(c);
};
get115link = function (aaaa) {
  k = new LoadVars();
  k.load("http://115.com/file/" + aaaa);
  trace(aaaa);
  k.onData = function (aaa) {
    trace("网页部分完成");
    asd = aaa;
    asd = rr(asd, ' url: "', glfh);
    asd = rr(asd, '",', glfh);
    u0 = asd.split(glfh);
    grl("http://115.com" + u0[1]);
  };
};
grl = function (kk) {
  asd = "";
  r = new LoadVars();
  r.load(kk);
  r.onData = function (aaa) {
    asd = aaa;
    trace("读地址部分完成");
    asd = rr(asd, ',"url":"', glfh);
    asd = rr(asd, '","desc":"', glfh2);
    asd = rr(asd, '","weight":', glfh);
    asd = rr(asd, "\/", "/");
    asd = rr(asd, "//", "/");
    u0 = asd.split(glfh);
    asdasd0 = u0[1].split(glfh2)[0];
    asdasd1 = u0[3].split(glfh2)[0];
    trace(asdasd0);
    trace(asdasd1);
    my_sound = new Sound();
    my_sound.loadSound(asdasd0, true);
    my_sound.start(0, 1);
    // 后略
  };
};
```

## 2011：手撕 QQ 空间背景音乐列表

我很久以前就 [公开发布过](https://www.tcdw.net/read-bgm-list-qzone)，不过还没有考虑拿去做完整的 Flash 播放器，因为有防盗链限制。

## 2010：手撕 soso 音乐 HTML 搜索结果

也是为了制作播放器。

### 第一帧

```javascript
stop();
//按 Unicode 进行编码
System.useCodepage = true;
var aa:String = "";
//临时记录搜索结果
var mp3Data:String;
var maxSearch:Number = 20;
var str:String = "";
//记录搜索所得的歌曲数量
var now:Number = 1;

function 找内容(str1, str2) {
    var _l3 = str1.length;
    var _l2 = mp3Data.indexOf(str1, 0)+_l3;
    var _l1 = mp3Data.indexOf(str2, _l2);
    var _l4 = mp3Data.slice(_l2, _l1);
    return (_l4);
}
function 转换为数字(cont) {
    var _l2 = cont.indexOf("约", 0);
    if (_l2>=0) {
        var _l1 = cont.slice(1);
    }
    _l1 = _l1.split(",").join("");
    return (Number(_l1));
}
function qieChu(s:String, k:String, j:String):String {
    var nK:Number = s.indexOf(k);
    var sK:String = s.substr(nK+k.length);
    var nJ:Number = sK.indexOf(j);
    mp3Data = sK.substr(nJ+j.length);
    return (sK.substr(0, nJ));
}
function replace(a, b, c) {
    d = a.split(b).join(c);
    return d;
}
function searchMp3(sPost:String, page:Number):Void {
    str = "";
    now = 1;
    searchData.text = "";
    mp3Data = "";
    aa = sPost;
    var my_lv = new LoadVars();
    //发送URL请求
    my_lv.load("http://cgi.music.soso.com/fcgi-bin/m.q?w="+sPost+"&p="+page+"&source=1&t=0");
    //当数据加载成功时
    onEnterFrame = function () {
        load1 = int(my_lv.getBytesLoaded()/my_lv.getBytesTotal()*100);
        searchData.text = "数据下载"+load1+"%";
    };
    my_lv.onData = function(soso_html:String):Void  {
        delete onEnterFrame;
        searchData.text = "下载完毕，正在分析...";
        //转义十六进制序列字符串。将搜索结果转为小写，便于提取。
        var s:String = soso_html.toLowerCase();
        trace(soso_html);
        //解析加载的数据
        mp3Data = s;
        gotoAndPlay(2);
    };
}
```

### 第二帧

```javascript
if (mp3Data.indexOf(aa) == -1) {
 searchData.text = "没有找到与 ["+aa+"] 相关的歌曲信息！";
 stop();
}
var mp3Str:String = qieChu(mp3Data, '<td class="data">', '</td>');
//str += mp3Str + "\r\n";
var a:Array = mp3Str.split("@@");
var b:Array = new Array();
for(i = 0; i < a.length; i++){
    if(a[i] == ""){
        b.push("无");
    } else {
        b.push(a[i]);
    }
}
mp3Name = b[1];
mp3Album = b[2];
mp3Singer = b[3];
//提取MP3地址，这是最难的
//删除垃圾
b[8] = replace(b[8], "fi", "");
b[8] = replace(b[8], ";;|si", "==");
b[8] = replace(b[8], ";;", "==");
b[8] = replace(b[8], ";", "==");
b[8] = replace(b[8], ";|qq", "==");
b[8] = replace(b[8], "|qq", "==");
b[8] = replace(b[8], "|an", "==");
b[8] = replace(b[8], "====", "==");
b[8] = replace(b[8], "==|||", "==");
b[8] = replace(b[8], "====", "==");
b[8] = replace(b[8], "==|==", "==");
b[8] = replace(b[8], "?httpd%", "==");
b[8] = replace(b[8], "==|", "==");
b[8] = replace(b[8], "?httpd", "");
b[8] = replace(b[8], "si", "");
//清除空白数组
var c:Array = b[8].split("==");
var d:Array = new Array();
for(i = 0; i < c.length; i++){
    if(c[i] == ""){
    } else {
        d.push(c[i]);
    }
}
//清除非MP3地址
var e:Array = new Array();
for(i = 0; i < d.length; i++){
    if(d[i].indexOf(".mp3") == -1 || d[i].indexOf(".MP3") == -1){
    } else {
        e.push(d[i]);
    }
}
//清除没有“http://”的地址
var mp3URL:Array = new Array();
for(i = 0; i < e.length; i++){
    if(e[i].indexOf("http://", 0) == -1){
    } else {
        mp3URL.push(e[i]);
    }
}
//大功告成！
str += "歌曲名：" + mp3Name + "\n";
str += "专辑：" + mp3Album + "\n";
str += "歌手：" + mp3Singer + "\n";
str += "地址组：" + mp3URL.join("|") + "\r\n";
```

## 野心

制作一个带音乐搜索、LRC 展示、高级管理功能的 Flash 音乐盒，震撼闪吧人。

然后这个坑一直推了下去，直到 Flash 没落。

rofl
