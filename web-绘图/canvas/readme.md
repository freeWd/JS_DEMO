# Canvas [https://airingursb.gitbooks.io/canvas/10.html]

Canvas是一个H5的标签，提供了一系列的属性和接口用于用于在网页上绘制图形.

在学习前需要注意的一些内容：
- 画东西的时候要将上一屏的内容清除掉，画一帧就要清除上一帧
- 动画不会回头，只能一帧一帧向前走
- 主循环只可以存在一个定时器

Canvas是基于状态的绘制:
```js
// 下面代码绘制的两条线都是【蓝色】的
// 这段代码每次使用stroke()时，它都会把之前设置的状态再绘制一遍。第一次stroke()时，绘制一条红色的折线；第二次stroke()时，会再重新绘制之前的那条红色的折线，但是这个时候的画笔已经被更换成蓝色的了，所以画出的折线全是蓝色的。
context.moveTo(100,100);
context.lineTo(100,500);
context.lineWidth = 5;
context.strokeStyle = "red";
context.stroke();

context.moveTo(300,100);
context.lineTo(300,500);
context.lineWidth = 5;
context.strokeStyle = "blue";
context.stroke();
```
如何解决上面的问题呢？

为了让绘制方法不重复绘制，我们可以在每次绘制之前加上`beginPath()`。代表下次绘制的起始之处为beginPath()之后的代码
```js
context.beginPath();
context.moveTo(100,100);
context.lineTo(100,500);
context.lineWidth = 5;
context.strokeStyle = "red";
context.stroke();

context.beginPath();
context.moveTo(300,100);
context.lineTo(300,500);
context.lineWidth = 5;
context.strokeStyle = "blue";
context.stroke();
```

## Canvas的基本使用

- 使用stroke()描边，画线
- 使用closePath()闭合图形
- 使用rect()方法绘制矩形
- 使用fill()方法填充图形

### 填充渐变形状
> 填充渐变形状分为三步：`添加渐变线`，`为渐变线添加关键色`，`应用渐变`
- 线性渐变
    - 添加渐变线: `var grd = context.createLinearGradient(xstart,ystart,xend,yend)`
    - 为渐变线添加关键色(类似于颜色断点): grd.addColorStop(stop,color);
        - 这里的stop传递的是 0 ~ 1 的浮点数，代表断点到(xstart,ystart)的距离占整个渐变色长度是比例。
    - 应用渐变:
        ```js
        context.fillStyle = grd;
        context.strokeStyle = grd;
        ```

- 径向渐变
    - 添加渐变圆：`var grd = context.createRadialGradient(x0,y0,r0,x1,y1,r1);`
    - 为渐变线添加关键色(类似于颜色断点): `grd.addColorStop(stop,color);`
    - 应用渐变: 
        ```js
        context.fillStyle = grd;
        context.strokeStyle = grd;
        ```

### 绘制矩形的快捷方法
- fillRect(x,y,width,height)
- strokeRect(x,y,width,height)。

这两个函数可以分别看做rect()与fill()以及rect()与stroke()的组合。因为rect()仅仅只是规划路径而已，而这两个方法确实实实在在的绘制。


### 填充样式 `createPattern()简介`
纹理其实就是图案的重复，填充图案通过`createPattern()`函数进行初始化。它需要传进两个参数`createPattern(img,repeat-style)`，第一个是`Image对象实例`，第二个参数是`String类型`，表示在形状中如何显示repeat图案。可以使用这个函数加载图像或者整个画布作为形状的填充图案。
有以下4种图像填充类型：
- 平面上重复：repeat;
- x轴上重复：repeat-x;
- y轴上重复：repeat-y;
- 不使用重复：no-repeat;

**其实createPattern()的第一个参数还可以传入一个canvas对象或者video对象**


### 高级路径
- 标准圆弧：`arc()`
    - `context.arc(x,y,radius,startAngle,endAngle,anticlockwise)`
    - 前面三个参数，分别是圆心坐标与圆半径。startAngle、endAngle使用的是弧度值，不是角度值。弧度的规定是绝对的。（0π - 2π）
    - anticlockwise表示绘制的方法，是顺时针还是逆时针绘制。它传入布尔值，true表示逆时针绘制，false表示顺时针绘制，缺省值为false。

- 复杂圆弧：`arcTo()` （使用切点绘制圆弧）
    - `arcTo(x1,y1,x2,y2,radius)`
    - `arcTo()`方法接收5个参数，分别是两个切点的坐标和圆弧半径。这个方法是依据切线画弧线，即由两个切线确定一条弧线。 具体如下。
    - 这个函数以给定的半径绘制一条弧线，圆弧的起点与当前路径的位置到(x1, y1)点的直线相切，圆弧的终点与(x1, y1)点到(x2, y2)的直线相切。因此其通常配合`moveTo()`或`lineTo()`使用。其能力是可以被更为简单的arc()替代的，其复杂就复杂在绘制方法上使用了切点。

- 二次贝塞尔曲线：`quadraticCurveTo()`
    - 贝塞尔曲线是一条由起始点、终止点和控制点所确定的曲线就行了。而n阶贝塞尔曲线就有n-1个控制点
    - `context.quadraticCurveTo(cpx,cpy,x,y);`
    - P1(cpx, cpy)是控制点，P2(x, y)是终止点
    - http://blogs.sitepointstatic.com/examples/tech/canvas-curves/quadratic-curve.html

- 三次贝塞尔曲线：`bezierCurveTo()`
    - `context.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y)`
    - 这个方法可谓是绘制波浪线的神器
    - 三次贝塞尔曲线有1个起始点、1个终止点、2个控制点。因此传入的6个参数分别为控制点cp1 (cp1x, cp1y)，控制点cp2 (cp2x, cp2y)，与终止点 (x, y)。
    - 这个方法也是不用大家去掌握参数具体是怎么填的，只要知道参数的意义就行
    - http://blogs.sitepointstatic.com/examples/tech/canvas-curves/bezier-curve.html


### 图形变换
1. 平移变换：translate(x,y) - 平移变换实质就是在平移坐标系
2. 旋转变换：rotate(deg) - 传入的参数是弧度，不是角度，和画圆弧一样 同时需要注意的是，这个的旋转是以坐标系的原点（0，0）为圆心进行的顺时针旋转
3. 缩放变换：scale(sx,sy) - 传入两个参数，分别是水平方向和垂直方向上对象的缩放倍数
    - 缩放时，图像左上角坐标的位置也会对应缩放。
    - 缩放时，图像线条的粗细也会对应缩放。
    比如对于最小的那个原始矩形，它左上角的坐标是（50，50），线条宽度是5px，但是放大2倍后，左上角坐标变成了（100，100），线条宽度变成了10px。这就是缩放变换的副作用。
    - 究其根本,平移变换、旋转变换、缩放变换都属于`坐标变换`

其实坐标变形的本质是变换矩阵，所以在最后谈一谈一个万能的变换方法——`矩阵变换transform()`
当我们想对一个图形进行变换的时候，只要对变换矩阵相应的参数进行操作，操作之后，对图形的各个定点的坐标分别乘以这个矩阵，就能得到新的定点的坐标
`context.transform(a,b,c,d,e,f)`
- a 水平缩放(1)
- b 水平倾斜(0)
- c 垂直倾斜(0)
- d 垂直缩放(1)
- e 水平位移(0)
- f 垂直位移(0)



`setTransform` - 相对于transform更好用，它每次并不是基于上一步的状态，不会相对于其他变换来发生行为. 每次都重置


### 状态的保存和重新导入
`save()`和`restore()`, canvas是基于状态的绘制。
- save方法用于临时保存画布坐标系统的状态，调用以下函数：`context.save();`
- restore方法可以用来恢复save之后设置的状态:  `context.restore();`
- save和restore方法必须是配对使用的，restore方法前必须有save方法，不然会报Underflow in restore错误

可以简单理解为调用restore之后，restore方法前调用的rotate/translate/scale方法全部就还原了，画布的坐标系统恢复到save方法之前，但是这里要注意的是，restore方法的调用只影响restore之后绘制的内容，对restore之前已经绘制到屏幕上的图形不会产生任何影响。


### 文本 API 简介  （Canvas上的文本不能使用CSS样式，虽然font属性与CSS的属性相似，但是却不能够交换使用。）
**属性:**
- font 设置或返回文本内容的当前字体属性 （font属性与CSS的设置字体格式是一样的）
```js
context.font = "[font-style] [font-variant] [font-weight] [font-size/line-height] [font-family]"
// font-style: normal, italic, oblique
// font-variant: normal, small-caps (浏览器会显示小型大写字母的字体)
// font-weight: normal, bold, bolder, lighter, 100 - 900数字取值
// font-size
// line-height
// font-family
```

- textAlign 设置或返回文本内容的当前对齐方式
- textBaseline 设置或返回在绘制文本时使用的当前文本基线

**方法**
- fillText() 在画布上绘制“被填充的”文本
- strokeText() 在画布上绘制文本（无填充）
- measureText()  返回包含指定文本对象的宽度

`fillText()`与`strokeText()`的参数表是一样的，接受4个参数，分别是`String，x，y与maxlen`，其中`String是指要显示的字符串`，之后`x与y是指显示的坐标`，最后一个maxlen是可以缺省的数值型参数，代表显示的最大宽度，单位是像素。如果文本的长度超过了这个maxlen，Canvas就会将显示文本横向压缩。通常为了保证字体的美观，我们不设置maxlen。



文本对齐: textAlign
```js
context.textAlign="center|end|left|right|start";
```

垂直对齐textBaseline
```js
context.textBaseline="alphabetic|top|hanging|middle|ideographic|bottom";
```

文本度量使用measureText()方法实现 [这个api在换行显示判断中会有奇效]



### 全局阴影与图像合成
**阴影效果**

创建阴影效果需要操作以下4个属性：
- context.shadowColor：阴影颜色。
- context.shadowOffsetX：阴影x轴位移。正值向右，负值向左。
- context.shadowOffsetY：阴影y轴位移。正值向下，负值向上。
- context.shadowBlur：阴影模糊滤镜。数据越大，扩散程度越大。

这四个属性只要设置了第一个和剩下三个中的任意一个就有阴影效果。不过通常情况下，四个属性都要设置。

**全局透明globalAlpha**

这个也是很简单的一个属性，默认值为1.0，代表完全不透明，取值范围是0.0（完全透明）~1.0。这个属性与阴影设置是一样的，如果不想针对全局设置不透明度，就得在下次绘制前重置globalAlpha

**图像合成 globalCompositeOperation**

两个图像重合的时候，就涉及到了对这两个图像的合成处理。globalCompositeOperation属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上。
- 源图像 = 您打算放置到画布上的绘图
- 目标图像 = 您已经放置在画布上的绘图。

- source-over 默认。在目标图像上显示源图像
- source-atop 在目标图像顶部显示源图像。源图像位于目标图像之外的部分是不可见的。
- source-in 在目标图像中显示源图像。只有目标图像内的源图像部分会显示，目标图像是透明的
- source-out 在目标图像之外显示源图像。只会显示目标图像之外源图像部分，目标图像是透明的
- destination-over 在源图像上方显示目标图像
- destination-atop 在源图像顶部显示目标图像。源图像之外的目标图像部分不会被显示
- destination-in 在源图像中显示目标图像。只有源图像内的目标图像部分会被显示，源图像是透明的
- destination-out 在源图像外显示目标图像。只有源图像外的目标图像部分会被显示，源图像是透明的
- lighter 显示源图像 + 目标图像
- copy 显示源图像。忽略目标图像
- xor 使用异或操作对源图像与目标图像进行组合



## 裁剪和绘制图像
裁剪区域clip()
Canvas API的图像裁剪功能是指，在画布内使用路径，只绘制该路径内所包含区域的图像，不绘制路径外的图像。这有点像Flash中的图层遮罩。
裁剪是对画布进行的，裁切后的画布不能恢复到原来的大小,要想保证最后仍然能在canvas最初定义的大小下绘图需要注意save()和restore()。画布是先裁切完了再进行绘图。并不一定非要是图片，路径也可以放进去

绘制图像drawImage()
drawImage()是一个很关键的方法，它可以引入图像、画布、视频，并对其进行缩放或裁剪。
一共有三种表现形式：
- 三参数：context.drawImage(img,x,y)
- 五参数：context.drawImage(img,x,y,width,height)
- 九参数：context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)

字段 | 含义
---|---
img | 规定要使用的图像、画布或视频
sx | 可选。开始剪切的 x 坐标位置
sy | 可选。开始剪切的 y 坐标位置。
swidth | 可选。被剪切图像的宽度。
sheight | 可选。被剪切图像的高度。
x | 在画布上放置图像的 x 坐标位置。
y | 在画布上放置图像的 y 坐标位置。
width | 可选。要使用的图像的宽度。（伸展或缩小图像）
height | 可选。要使用的图像的高度。（伸展或缩小图像）




### 非零环绕原则
路径方向与非零环绕原则

非零环绕原则，来判断哪块区域是里面，哪块区域是外面

平时我们画的图形都是规规矩矩的，那么如果我们用线条画了个抽象派作品，就像下面这图一样，童鞋们知道怎么用fill()染色呢



### 最后的API：
橡皮擦`clearRect()`

清空指定矩形上的画布上的像素。它接受四个参数，和其他绘制矩形的方法一样
`context.clearRect(x,y,w,h)`

交互性很强的API—— `isPointInPath()`
这个方法接收两个参数，就是一个点的坐标值，用来判断指定的点是否在当前路径中。若是，则返回true