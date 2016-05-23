
# Redux 在达达

标签（空格分隔）： 前端

---

### 背景
大多数系统在刚启动时因为初期业务功能单一并为了尽快上线的目的，在系统的设计和技术选型上鲜有考虑，特别是前端方向（基本是 jQuery + Bootstrap ）。当然，达达有很多项目也是这么过来的。随着公司业务的快速发展，以下几个问题越来越严重：

 1. **维护困难**：JavaScript 的语法比较松散，这也导致全栈工程师在开发时往往以实现业务功能为第一要点，公用模块没抽离，编写方式不统一，遇到 Bug 基本都需要重新去梳理代码。
 2. **网页变慢**：随着业务功能的丰富，菜单也会越来越多，在没有使用局部刷新技术的情况下，每打开一个页面都要去重新请求菜单列表，这部分的耗时居然可以达到 2-3 秒钟。
 3. **技术/样式杂乱**：既然每个参与项目的同学都以实现业务功能优先，那么谁都不想去看别人的代码，也不想自己负责的模块上线之后影响到别的模块，那么采取的方式基本都是你用你的资源，我用我的资源。

因此，我们需要有一种前端技术选型可以尽量地来规避这些问题，编写出约束力比较强的代码，在可复用、分治上带来帮助。

### 为什么是 React

目前前端比较热门的框架主要有 React、Vue 和 Angular，鉴于 Angular 处于 1.0 停止维护、2.0 正式版还没发布的状态，我们暂时不予考虑，剩下的就是比较 React 和 Vue 了。

Vue 在很多细节方面设计得确实很人性化，比如 slot、组件间的通信、清晰的模板语法、一整套的解决方案等等，而且我们在移动端也使用了 Vue。也正是因为 Vue 的灵活，组件间的通信会有多种方式（有的人会通过组件间的引用，有的人会通过事件派发）、影响组件重新渲染的因素有多重、事件绑定不一致（根节点唯一时会自动绑定），结果仍然是难以维护。

虽然 React 看起来并不那么灵活，只能通过 props 来传递属性，最终影响组件的重新渲染。但是其**单向数据流**正是解决我们维护难题的利器。全栈工程师对于数据的流向和操作理解比较深刻，而对于 DOM 操作的理解是比较浅的，如果全栈工程师主要的编码工作是数据操作，也就避免了在 DOM 操作上的困扰。所以，在 PC 端我们选择了 React。

组件化选择了 React，状态管理自然而然地选择了 Redux。相比于 Flux，Redux 更加简洁易用，本文的重点就是描述 Redux 是什么。

### 理解React

理解 React 是理解 Redux 存在的前提，所以在阐述 Redux 是什么之前，我们先来说说 React。

- React 是数据驱动的。任何页面（view）展现形态的变化一定是通过改变数据来触发的，而不是直接操作 DOM。
- 触发页面（或者组件）重新渲染的媒介只有 props 和 state ：state 是**组件内部自行管理**的数据对象；而 props 由父级组件或者顶层数据决定，是组件之间通信的桥梁，可用来传递数据。此外，React 是**单向下发**的，没有向上回溯的能力。
- React 组件间的通信。父组件可以很便利地通过 props 来控制子组件的显示形态，而子组件要想改变父组件的显示形态，只能通过执行父组件**预先提供好的函数 props**。那么，如果想改变父组件形态的是曾孙子组件呢？你不会告诉我，把父组件提供的函数一级一级往下传递吧？

鉴于 React 的这些特性，如果把所有影响组件形态的数据集中起来，统一存放在一个地方（理解为 store 吧），并且要改变组件形态只能通过修改 store 中的数据（数据流向大概是这样的：store => view => store），那么这个东西是不是特别吻合 React 的单向数据流呢？

### 概述

是的，Flux 就是带着这个想法出现的，而 Redux 则是这个想法的最佳实践。说到 Redux，人们可能最先想到的是 hot loader 或者 redux-devtools 这类酷炫的开发利器，而本篇文章就是要带你去窥探一下这个只有 200 多行，却很受欢迎的 JavaScript 的状态管理容器。
打个可爱的比喻，如果把 React 比喻成用户软件里上证股市里的 K线图，那么 redux 就类似于上交所的交易系统，用户不能通过软件改变 K线图 的形状和排列，但可以通过下单去更改交易系统里的数据，进而改变炒股软件里的 K线图。


### 核心概念

- view(React)
- action
- reducer
- store

在解释每个概念之前，我们先来捋一捋整体思路。Redux 中应该有一个地方（store）用来存放所有可以改变页面（view）形态的数据。如果要改变某一块内容的形态，应该将影响这一块内容的数据(action)发送给 store，而 action 如何与 store 中的数据合并就是 reducer 的职责了。

#### store

store 是**唯一**一个存放了应用中所有的组件状态的数据的地方，但是 store **≠** 状态数据对象。它包含一下方法：

 - getState()，一个用于返回状态数据对象的方法。
 - subscribe()，一个用于侦听数据变化的方法。
 - dispatch()，一个用于派发 action 的方法，这个方法会通知 reducer 生成一份新的状态数据。

#### action

action 是一个描述发生了什么的对象，它作为数据从页面（view）传送到 store 的载体，是 store 数据的**唯一来源**。

```
    //用来描述删除一个 ID 为 15 的 action
    let deleteAction = {
        type: 'DELETE',//必须字段，常量，且唯一
        id: 15 //非必须字段
    };
```

如上例，deleteAction 用来描述一类删除操作，这对象中的 type 是不变的，而 id 是变化的，所以我们一般通过一个函数（actionCreator）来生成这个 action 对象。例如：

```
    //根据传入的 id 生成 action
    function deleteRecordById(id){
        return {
            type: 'DELETE',
            id: id
        };
    }

```

#### reducer

action 只是描述了有事情发生了这一事实，但是并没有告诉 Redux 如何更新 store 中的状态数据（state），这正是 reducer 的职责。
reducer 表现形式上是一个纯函数，大概长这样：
```
    /**
     * reducer 样例.
     * @param  {[Object]} previousState [上一个状态]
     * @param  {[Object]} action        [action]
     * @return {[Object]}               [新状态]
     */
    function(previousState, action){
        ...doSomething
        return newState;
    }
```

另外，reducer 只是执行数据的合并，要保持纯净，永远不要在 reducer 中执行类似以下的操作：

 - 修改传入参数
 - 执行有副作用的操作，如 API 请求和路由跳转
 - 调用非纯函数，如 Date.now()

一个比较完整的例子（可以加减的数字控件）如下：
```
//一、========== Counter.js，数字控件组件
class Counter extends Component {
  render() {
    //通过 props 获得总数、加1函数和减1函数
    const { increment, decrement, counter } = this.props;
    return (
      <p>
        Clicked: {counter} times
        <button onClick={increment}>+</button>
        <button onClick={decrement}>-</button>
      </p>
    );
  }
}

//state 提取
function mapStateToProps(state) {
  return {
        counter: state.counter
  };
}

//dispatch 绑定到 action
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

//绑定 state 和 actionCreator 到 Counter 组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

//二、========== action.js
//加一 actionCreator，返回一个 action
export function increment() {
  return {
    type: 'INCREMENT'
  };
}

//减一 actionCreator，返回一个 action
export function decrement() {
  return {
    type: 'DECREMENT'
  };
}

//三、========== reducer.js
export default function counter(state = 0, action) {
  switch (action.type) {
  //加1数据处理
  case 'INCREMENT':
    return state + 1;
  //减1数据处理
  case 'DECREMENT':
    return state - 1;
  //非预设类型，返回原值
  default:
    return state;
  }
}

//四、========== store.js
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

//关联 reducer，返回创建的 store
export default createStore(rootReducer, null, null);
```
 
了解了以上3个核心概念之后，我们的数据流向变成了：

**view => action => reducer => store(state) => view**

即:
 1. view 通过调用一个函数（actionCreator）产生一个 action
 2. 通过 store.dispatch 将 action 传递给 reducer
 3. reducer 在已有 state 数据和 action 的基础上生成一份新的 state
 4. 新的 state 传递给 store 保管，并触发了 view的更新


### 最佳实践

#### action 的 type 属性应该定义为常量，且唯一

type 作为判断 action 要执行的内容的唯一标志属性，通常定义为常量，推荐以「业务」+「动作」的命名方式。

```
export const SUPPLIER_SHOP_SELECT = "SUPPLIER_SHOP_SELECT";
export const SUPPLIER_SHOP_UPDATE = "SUPPLIER_SHOP_UPDATE";
```

#### 不直接通过 store.dispatch 来派发 action
虽然你可以轻松地在创建 store 的时候将其引用保存起来，然后直接通过 store.dispatch 来派发 action，但是千万别那么做。
redux 在设计的时候引入了**middleware**和**compose**，直接调用 store.dispatch 的话，就跳过了以上两个步骤，会导致表现方式不一致。

#### 启用 ES7 decorators

redux 与 react 的绑定需要通过 react-redux 提供的 connect 来完成，主要是将 redux 范畴的 actionCreator 和 store 中的 state 传递给 react 的组件。

```
//注解方式
@connect(state => ({
    counter: state.counter
}), actions)
export default class Counter extends Component {
    ...doSomethiing()
}
```

很显然，通过注解的方式既可减少代码量，也能让逻辑更加简洁清晰。

#### Ajax/Fetch 应该全都放在 actionCreator 中

所有数据接口请求的发起应该都放在 actionCreator 中，一来可以明确 actionCreator 层的职能（与后端的dao层类似），二来能避免组件层堆积太多非显示逻辑的代码。其实这也是 react 为显示负责，redux 为数据负责的核心思想。

#### 所有影响组件渲染的数据尽量都放在 store 中
在派乐趣商家PC端的项目中，我犯了一个根本性的错误，把 Notify 组件(操作提示组件)的引用保存在一个工具类中，当需要显示信息时直接通过工具类提供的方法去修改 Notify 内部的 state 信息，进而改变 Notify 的显示和信息。就像是这样子：

```
NotifyUtils.error("操作失败！",'该商品不可删除！');
```

虽然这种方式带来了一定的便利性，但与我们说的数据驱动、显示和数据相分离的思想已经相背离了。正确的做法应该是通过 dispatch 一个 action 来决定 Notify 组件的显示和信息。

#### 放弃jquery，避免直接操作DOM
以我们目前的编码规范，一个简单 DOM 元素的显示与否都需要一个属性来维护，很多人会觉得麻烦，但是随着业务功能越来越丰富，编码规范的重要性就体现出来了。


### 总结

- 单一数据源。
- store 中的数据是只读的。要想修改数据，必须派发一个 action。
- reducer 要么返回原数据，要么生成一个新对象。






