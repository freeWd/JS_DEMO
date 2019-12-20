describe('函数基本的API测试', function() {
    it('add函数是否可用', function() {
        // 对个分支的情况
        expect(window.add(1)).toBe(2);
        expect(window.add(-1)).toBe(-2);
    });
})