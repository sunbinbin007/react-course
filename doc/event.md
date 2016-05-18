#React 事件
###事件处理器的绑定

给组件添加一个事件处理器，就像添加一个普通属性一样。事件命名与原生DOM事件名一致且会在相同情景下被触发，并使用驼峰形式表示，如：'onChange'、'onClick'等。

1. JSX 中：

    JSX语法中绑定事件处理器的语法与HTML语法非常类似。如，为按钮添加一个点击事件：

        <button class="btn btn-save" onClick={this.handleSaveClicked}>保存</button>

2. 常见事件：

        键盘事件：onKeyDown、onKeyPress、onKeyUp
        焦点事件：onFocus、onBlur
        表单事件：onChange、onInput、onSubmit
        鼠标事件：onClick、onDrag、onMouseMove...
        触摸事件：（为了使触摸事件生效，在渲染所有组件之前调用React.initializeTouchEvents(true)）onTouchStart...

    **事件处理器将会传入虚拟事件对象的实例**，一个对浏览器本地事件的跨浏览器封装。它有和浏览器本地事件相同的属性和方法，包括 stopPropagation() 和 preventDefault()，但是没有浏览器兼容问题。

###事件处理与参数传递

1. 事件处理的使用

        class LikeButton2 extends React.Component {
          constructor(props) {
            super(props);
            this.state = {liked: false};
          }
          handleClick(e) {
            this.setState({ liked: !this.state.liked });
            console.log(e);
          }
          render() {
            const text = this.state.liked ? '喜欢' : '不喜欢';
            return (
                <div>
                    <p onClick={this.handleClick.bind(this)}>
                        你<strong>{text}</strong>这个，点击更改。
                    </p>
                </div>
            );
          }
        }

    在上例中，我们在使用 ES6 Class 语法定义了 LikeButton 组件。在组件的 handleClick 处理函数中修改了组件 this.state.liked 状态。组件的 state 改变后，会自动触发组件的 render() 方法重新渲染组件。

    > 注意，在上例中我们使用bind(this)显式的绑定了事件处理函数的运行上下文，当使用ES6 Class语法定义组件时，这是必须的操作。

2. 参数传递

    通过 `() => this.handleClick(arg1,arg2,...)` 的形式传递。

3. Refs：

    是一种给指定的子组件实例发送消息的很好的方式，从某种程度上来看，通过 props 和 state 来做这件事倒显得不太方便。

4. ReactDOM.findDOMNode()

    获取真实的DOM节点


