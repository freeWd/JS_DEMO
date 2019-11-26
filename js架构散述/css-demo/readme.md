## BFC | IFC | GFC | FFC
Block Formating Context
Inline Formating Context
Grid Formating Context
Flex Formating Context

Box 是 CSS 布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类 型的 Box， 会参与不同的 Formatting Context(一个决定如何渲染文档的容 器)，因此Box内的元素会以不同的方式渲染

Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲 染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他 元素的关系和相互作用。

如何会产生BFC:
* 根元素
* float不为none
* position为absolute/fixed
* display为inline-block/table-cell/table-caption/flex/inline-flex
* overview不为visible

BFC自身的一些规则：
* BFC区域不会和其他float box重叠，BFC之间相互独立
* 属于同一个BFC内的两个相邻Box的margin会发生重叠
* BFC的高度计算也会将浮动的元素算入


## CSS绘制的高级技巧
border && border-radius 造就万千可能

- border-radius产生圆角
如果在圆角矩形外产生一个非圆角的矩形包裹住圆角矩形，可以无需多使用一个div，而是使用属性：outline: 10px solid red 配合 box-shadow的外阴影来实现




