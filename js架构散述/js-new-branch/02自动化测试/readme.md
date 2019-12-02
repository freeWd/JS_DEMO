## 单元测试
* 正确性:测试可以验证代码的正确性，在上线前做到心里有底
* 自动化:当然手工也可以测试，通过console可以打印出内部信息，但是这是一次 性的事情，下次测试还需要从头来过，效率不能得到保证。通过编写测试用例，可 以做到一次编写，多次运行
* 解释性:测试用例用于测试接口、模块的重要性，那么在测试用例中就会涉及如何 使用这些API。其他开发人员如果要使用这些API，那阅读测试用例是一种很好地途 径，有时比文档说明更清晰
* 驱动开发，指导设计:代码被测试的前提是代码本身的可测试性，那么要保证代码 的可测试性，就需要在开发中注意API的设计，TDD将测试前移就是起到这么一个 作用
* 保证重构:互联网行业产品迭代速度很快，迭代后必然存在代码重构的过程，那怎
么才能保证重构后代码的质量呢?有测试用例做后盾，就可以大胆的进行重构

目的:单元测试能够让开发者明确知道代码结果
原则:单一职责、接口抽象、层次分离
断言库:保证最小单元是否正常运行检测方法

测试风格：
测试驱动开发(Test-Driven Development,TDD): 关注所有的功能是否被实现(每一个功能都必须有对应的测试用 例)，suite配合test利用assert('tobi' == user.name);

行为驱动开发(Behavior Driven Development,BDD) BDD关注整体行为是否符合整体预期,编写的每一行代码都有目的提 供一个全面的测试用例集。expect/should,describe配合it利用自然语 言expect(1).toEqual(fn())执行结果。


常用测试框架：
chai.js(TDD BDD双模)
Jasmine.js(BDD）

单元测试运行流程：（before -> beforeEach -> it -> after -> afterEach）
1.before单个测试用例(it)开始前 
2.beforeEach每一个测试用例开始前 
3.it定义测试用例 并利用断言库进行 设置chai如:expect(x).to.equal(true); 异步mocha
4.以上专业术语叫mock


自动化单元测试
Karam: 一个简单的工具，可让您在多个实际的浏览器中执行JavaScript代码
Karma的主要目的是使您的测试驱动开发变得容易，快速和有趣。

```s
# Install Karma:
$ npm install karma --save-dev
# Install plugins that your project needs:
$ npm install karma-jasmine karma-chrome-launcher jasmine-core --save-dev
# Install global karma-cli
$ npm install -g karma-cli

# init 生成 karma.conf.js配置文件
karma init 
```
上面的 karam是一个测试集成环境，jasmine是断言库

karma start 运行

也可以生成测试报告，并确认是否有分支没有被覆盖到：
npm install karma-coverage --save-dev


## 用户的真实性测试（e2e）
npm install selenium-webdriver --save-dev
