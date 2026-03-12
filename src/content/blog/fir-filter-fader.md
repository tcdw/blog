---
title: 'FIR Filter Fader'
description: 'SNES SPC 引擎不是有个 FIR Filter 选项吗（位于 DSP 寄存器的 $0F $7F），那么我们有时候希望在 AddmusicK 里面加入 FIR 滤镜过渡特效。 由于计算太麻烦，所以我拿 Node.js 写了个代码很渣的 FIR 滤镜过渡计算器，代码如下：      //过渡起点'
pubDate: '2015-06-29T04:31:07.000Z'
---

SNES SPC 引擎不是有个 FIR Filter 选项吗（位于 DSP 寄存器的 $0F - $7F），那么我们有时候希望在 AddmusicK 里面加入 FIR 滤镜过渡特效。
由于计算太麻烦，所以我拿 Node.js 写了个代码很渣的 FIR 滤镜过渡计算器，代码如下：

    //过渡起点
    firRag1 = new Array(0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00);
    //过渡终点
    firRag2 = new Array(0x0c, 0x21, 0x2b, 0x2b, 0x13, 0xfe, 0xf3, 0xf9);
    //演绎次数。第一次完全与起点相同，最后一次完全与终点相同。
    firFadeTime = 10;
    //循环演绎次数
    for(j=0; j<firFadeTime; j++){
        // FIR 滤镜倾向 FIR1 的值，0 完全倾向，1 完全不倾向。
        firRange = j / (firFadeTime - 1);
        //循环 FIR 滤镜的八个值
        for(i=0; i<8; i++){
            //数值格式转换
            firCalc1 = firRag1[i].toString(10);
            (firCalc1 > 127) ? (fir1 = firCalc1 - 256) : (fir1 = firCalc1);
            firCalc2 = firRag2[i].toString(10);
            (firCalc2 > 127) ? (fir2 = firCalc2 - 256) : (fir2 = firCalc2);
            //混合计算
            fir = Math.round(Number(fir1) + (Number(fir2) - Number(fir1)) * firRange);
            //转换成 AddmusicK 标准数值
            (fir < 0) ? (firNew[i] = (fir + 256).toString(16)) : (firNew[i] = fir.toString(16));
            firUK = firNew[i].toUpperCase();
            firNew[i] = (String(firUK).split("").length == 1) ? "$0" + firUK : "$" + firUK;
        }
        //打印演绎结果
        console.log("$F5 " + firNew.join(" "));
    }

把上面的代码保存成 fir.js，在 Shell 下执行，得到下列结果：

    tcdw@tcdw:~$ node fir.js
    $F5 $7F $00 $00 $00 $00 $00 $00 $00
    $F5 $72 $04 $05 $05 $02 $00 $FF $FF
    $F5 $65 $07 $0A $0A $04 $00 $FD $FE
    $F5 $59 $0B $0E $0E $06 $FF $FC $FE
    $F5 $4C $0F $13 $13 $08 $FF $FA $FD
    $F5 $3F $12 $18 $18 $0B $FF $F9 $FC
    $F5 $32 $16 $1D $1D $0D $FF $F7 $FB
    $F5 $26 $1A $21 $21 $0F $FE $F6 $FB
    $F5 $19 $1D $26 $26 $11 $FE $F4 $FA
    $F5 $0C $21 $2B $2B $13 $FE $F3 $F9

然后你只要在中间加上相应的音符，就能实现 FIR 滤镜过渡特效了。

### Update: Jixun 姐姐的改进版本 ###
```javascript
//过渡起点、终点
var firRag1 = [0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
	firRag2 = [0x0c, 0x21, 0x2b, 0x2b, 0x13, 0xfe, 0xf3, 0xf9];

//演绎次数。第一次完全与起点相同，最后一次完全与终点相同。
var firFadeTime = 10;

function toSignedByte (x){
	if (x > 0x7F)
		x -= 0x100
	
	return x;
}

function toUnsignedByte (x) {
	if (x < 0)
		x += 0x100;
	
	return x;
}

function byteToHex (x) {
	return ('0' + x.toString(16)).slice(-2);
}

firRag1 = firRag1.map(toSignedByte);
firRag2 = firRag2.map(toSignedByte);
var firCalc1, firCalc2;

//循环演绎次数
firFadeTime-- ;
var firNew = new Array(8);
for(j=0; j<=firFadeTime; j++){
    // FIR 滤镜倾向 FIR1 的值，0 完全倾向，1 完全不倾向。
    firRange = j / firFadeTime;
    
    // 循环 FIR 滤镜的八个值
    for(i=0; i<8; i++){
        fir1 = firRag1[i];
        fir2 = firRag2[i];
        
        // 混合计算
        fir = Math.round(fir1 + (fir2 - fir1) * firRange);
        
        // 转换成 AddmusicK 标准数值
        firNew[i] = '$' + byteToHex(toUnsignedByte(fir));
    }
    
    // 打印演绎结果
    console.log("$F5 " + firNew.join(" ").toUpperCase());
}
```