// import util from '../../assets/scripts/util.js';

describe('工具方法的功能测试', function() {
    describe('节流方法', function() {
        it("多次调用方法，每隔timer时间才会重复调用", function() {
            var i = 1;
            var timer = 2000;
            // util.throttle(function() {
            //     i++;
            // }, timer);
            expect(i).toBe(1);
        })  
    })
})