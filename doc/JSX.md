# JSX 语法

#### JSX是什么？为什么使用JSX？

1. JSX 是 JavaScript 和XML的混合体，可以在 JS 里混写 XML（类似于HTML），JSX可解析为原生JS。

2.  JSX 在定义类似 HTML 这种树形结构时，十分简单明了。



>使用JSX



    React.render(

        <div>

            <div>

                <div>content</div>

            </div>

        </div>,

        document.getElementById('example')

    );

    

>不使用JSX



    React.render(

        React.createElement('div', null,

            React.createElement('div', null,

                React.createElement('div', null, 'content')

            )

        ),

        document.getElementById('example')

    );



####HTML 标签和 React 组件

渲染 HTML 标签，声明变量采用首字母小写；渲染 React 组件，声明变量采用首字母大写。

>注意：标签的属性class和for，需要写成className和htmlFor。因为两个属性是JavaScript的保留字和关键字。无论你是否使用JSX。



####JS 表达式



表达式用 {} 包起来，不要加引号，加引号就会被当成字符串。



JSX 是 HTML 和 JavaScript 混写的语法，当遇到 <，JSX 就当 HTML 解析，遇到 { 就当 JavaScript 解析。



>属性表达式



    React.render(

        <div className={2>1?'class-a':'class-b'}>content</div>,

        document.body

    );



>子表达式



    React.render(

        <div>

            {2>1?<Nav />:<div>content</div>}

        </div>

    );



####注释

同 JS 注释一样

+ 单行注释 // comments

+ 多行注释 /* comments */

+ 还有一个{/* comments */}



####style属性

在 react 写行内样式时，要用 JSX 表达式加对象的写法，不能采用引号的书写方式。



####render函数

最外层只能有一个根节点。



####与模板引擎的区别

模板引擎本质是对字符串的拼接，而 JSX 是会转译为原生 JS 的。

模板引擎里存在容错，例如 input 标签可以不闭合；JSX 里标签必须闭合，并且可写成自闭合的形式。

####常见语法技巧

1. && 实现 if

var Ifcomponent
2. 三目运算符 ? : 实现 if else
3. map 实现 for 循环
4. 箭头函数 => 实现 function
5. onChange 事件写在标签内 


















