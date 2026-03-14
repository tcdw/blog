---
title: "通过甲 JS 加载乙 JS"
description: "以前我想通过某个 JavaScript 脚本来加载另一个 JavaScript 脚本，我会这样写：      document.write('');   虽然它确实能用，但这方法并不算最好，[トトロ][1]的 QQ 群某人教给我这种方法：    [1]: http://i.mouto.org"
pubDate: "2015-04-16T06:51:00.000Z"
---

以前我想通过某个 JavaScript 脚本来加载另一个 JavaScript 脚本，我会这样写：

    document.write('<script src="example.js"></script>');

虽然它*确实能用*，但这方法并不算最好，[トトロ][1]的 QQ 群某人教给我这种方法：<blockquote>

## 加载新 JS

    newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = '/path/to/js/file';
    document.getElementsByTagName('head')[0].appendChild(newScript);

## 假如单单是要调用一个 JS 在另一个 JS 里

    var imported = document.createElement('script');
    imported.src = '/path/to/imported/script';
    document.head.appendChild(imported);

## jQuery 方式

    $.getScript('/path/to/imported/script.js', function()
    {
        // 运行
        // 这里写你的JS
    });

</blockquote>

[1]: http://i.mouto.org
