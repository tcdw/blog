---
title: '我写的一言轮播脚本（2018 更新）'
description: '看到很多 ACG 博客都用上了一言，但我觉得在同一个页面只显示一条内容未免有些单调，所以想让它定时轮播，而且采用较好的切换效果。  我后来在 WNJXYK 上看到了我想要的轮播效果，但那是基于 jQuery 制作的。  因为对于我这种讨厌为一个小功能放上大型前端库的人来说不能忍，所以我用原生 JS 写了一个。'
pubDate: '2018-04-13T03:36:16.000Z'
---

看到很多 ACG 博客都用上了一言，但我觉得在同一个页面只显示一条内容未免有些单调，所以想让它定时轮播，而且采用较好的切换效果。

我后来在 [WNJXYK](http://wnjxyk.cn) 上看到了我想要的轮播效果，但那是基于 jQuery 制作的。

因为对于我这种讨厌为一个小功能放上大型前端库的人来说不能忍，所以我用原生 JS 写了一个。

2018 年，为了获得更佳的性能和稳定性，我把这个脚本进行了重写，从 JavaScript 动画更改为 CSS 渐变，并改掉了一些不科学的地方。

下面是实际效果：

<blockquote><span id="hitokoto">如果你在使用 RSS 阅读器，请访问原文查看效果。</span></blockquote>

### HTML 部分 ###

    <span id="hitokoto"></span>

### JavaScript 部分 ###

```javascript
(function() {
    var server = 'https://api.lwl12.com/hitokoto/v1';
    var target = document.getElementById('hitokoto');
    var fadeDur = 1;
    var waitDur = 10;
    var errorMsg = '加载出现了问题！';
    /* -=-=-=-=-=-=-=-=-=-=-=- 你的配置部分结束 -=-=-=-=-=-=-=-=-=-=-=- */
    var first = true;
    var present = '';
    target.style.opacity = 0;
    target.style.transition = 'opacity ' + fadeDur + 's';
    function loadData() {
        var connect = new XMLHttpRequest();
        connect.open('GET', server, true);
        connect.onload = function() {
            if (connect.status >= 200 && connect.status < 400) {
                present = connect.responseText;
                if (first) {
                    first = false;
                    target.textContent = present;
                    fadeIn();
                } else {
                    fadeOut();
                }
            } else {
                  target.style.opacity = 1;
                  target.textContent = errorMsg;
                  setTimeout(loadData, (fadeDur + waitDur) * 1000);
            }
        }
        connect.onerror = function() {
            target.textContent = errorMsg;
            setTimeout(loadData, (fadeDur + waitDur) * 1000);
        }
        connect.send();
    }
    function fadeOut() {
        target.style.opacity = 0;
        setTimeout(function() {
            target.textContent = present;
            fadeIn();
        }, fadeDur * 1000);
    }
    function fadeIn() {
        target.style.opacity = 1;
        setTimeout(loadData, (fadeDur + waitDur) * 1000);
    }
    loadData();
})();
```

<script>!function(){var t="https://api.lwl12.com/hitokoto/v1",e=document.getElementById("hitokoto"),o=1,n=10,i="加载出现了问题！",s=!0,u="";function c(){var y=new XMLHttpRequest;y.open("GET",t,!0),y.onload=function(){y.status>=200&&y.status<400?(u=y.responseText,s?(s=!1,e.textContent=u,a()):(e.style.opacity=0,setTimeout(function(){e.textContent=u,a()},1e3*o))):(e.style.opacity=1,e.textContent=i,setTimeout(c,1e3*(o+n)))},y.onerror=function(){e.textContent=i,setTimeout(c,1e3*(o+n))},y.send()}function a(){e.style.opacity=1,setTimeout(c,1e3*(o+n))}e.style.opacity=0,e.style.transition="opacity "+o+"s",c()}();</script>