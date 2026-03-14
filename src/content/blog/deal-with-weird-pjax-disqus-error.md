---
title: "Disqus + PJAX 后的小错误修复"
description: "自从我在我的博客同时使用 Disqus 评论框和 PJAX 成功后，那叫一个酸爽！  然而细心的访客会发现，如果访问网站首页，打开浏览器控制台，会出现以下错误：      Uncaught TypeError: Cannot read property 'appendChild' of null"
pubDate: "2015-10-20T06:42:35.000Z"
---

自从我在我的博客同时使用 Disqus 评论框和 PJAX 成功后，那叫一个酸爽！

然而细心的访客会发现，如果访问网站首页，打开浏览器控制台，会出现以下错误：

    Uncaught TypeError: Cannot read property 'appendChild' of null

尽管这并不影响博客功能，但看上去太令人不爽了！

## 解决它

经过排查，发现是因为 Disqus 脚本在没有评论框的网站首页被运行了，而由于找不到评论框，就会出现上述错误。

于是我想到了解决方案：视网页的状态智能决定加载 Disqus 评论框脚本。

首先把原有的 Disqus 加载脚本中站点名称下面的代码删除，然后加入以下新脚本：

    recheckDQ = function () {
        if($('#disqus_thread').length) {
    	    if(window.DISQUS) {
                DISQUS.reset({
                reload: true
                });
            } else {
                var dsq = document.createElement('script');
                dsq.type = 'text/javascript';
                dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            }
        }
    }
    $(document).ready(recheckDQ);

pjax complete 环节的代码也要修改：

    $(document).on('pjax:complete', function() {
        recheckDQ();
        // blah blah
    });

代码的变量名等写的很清楚了，就不多注释了。

修改完成之后，重启 ghost，再从首页进入博客，错误消失。
