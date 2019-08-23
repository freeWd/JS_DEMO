<script>
export default {
    name: 'Title',

    // 将组件标记为 functional，这意味它无状态 (没有响应式数据)，也没有实例 (没有 this 上下文)。
    // render函数获取到context上下文的值 否则是undefined
    functional: true,
    props: {
        level: {},
        render: {},
        name: ''
    },
    // render: function(createElement) {
    //     return createElement(
    //         'h' + this.level,
    //         'hello world'
    //     )
    // }
    render: function(createElement, context) {
        return context.props.render(createElement, context.props.name)
    }
}
</script>