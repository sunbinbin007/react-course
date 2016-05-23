
# Redux 在达达

标签（空格分隔）： 前端

---

### 背景
大多数系统在刚启动的时候因为初期业务功能单一以及为了尽快上线的目的，在系统的设计和技术选型上鲜有考虑，特别是前端方向（基本是jQuery + Bootstrap）。当然，达达有很多项目也是这么过来的。随着公司业务的快速发展，以下几个问题越来越严重：

 1. **维护困难**。Javascript的语法比较松散，这也导致全栈工程师在编码时候往往以实现业务功能为第一要点，公用模块没抽离，编写方式不统一，遇到Bug基本都需要重新去梳理代码。
 2. **网页变慢**。随着业务功能的丰富，菜单也会越来越多，在没有使用局部刷新的技术的情况下，每打开一个页面都要去重新请求菜单列表，这部分的耗时居然可以达到2-3分钟。
 3. **技术/样式杂乱**。既然每个参与项目的同学都以实现业务功能优先，那么谁都不想去看别人的代码，也不想自己负责的模块上线之后影响到别的模块，那么采取的方式基本都是你用你的资源，我用我的资源。

因此，我们需要有一种前端技术选型可以尽量地来规避这些问题，编写的代码约束力比较强，在可复用、分治上带来帮助。

### 为什么是 React

目前前端比较热门的框架主要有React、Vue和Angular，鉴于Angular处于1.0停止维护、2.0正式版还没发布的状态，我们暂时不予考虑，剩下的就是比较React和Vue了。

Vue在很多细节方面设计得确实很人性化，比如slot、组件间的通信、清晰的模板语法、一整套的解决方案等等，而且我们在移动端也使用了Vue。也正是因为Vue的灵活，组件间的通信会有多种方式（有的人会通过组件间的引用，有的人会通过事件派发）、影响组件重新渲染的因素有多重、事件绑定不一致（根节点唯一时会自动绑定，），结果仍然是难以维护。

虽然React看起来并不那么灵活，只能通过props来传递属性，最终影响组件的重新渲染。但是其**单向数据流**正是解决我们维护难题的利器。全栈工程师对于数据的流向和操作理解比较深刻，而对于DOM操作的理解是比较浅的，如果全栈工程师主要的编码工作是数据操作，也就避免了在DOM操作上的困扰。所以，在PC端我们选择了React。

组件化选择了React，状态管理自然而然地选择了Redux。相比于Flux，Redux更加简洁易用，本文的重点就是描述Redux是什么。

### 理解React

理解 React 是理解Redux存在的前提，所以在阐述 Redux 是什么之前，我们先来说说 React。

- React 是数据驱动的。任何页面（view）展现形态的变化一定是通过改变数据来触发的，而不是直接操作DOM。
- 触发页面（或者组件）重新渲染的媒介只有有 props 和 state ：state 是**组件内部自行管理**的数据对象；而props决定于父级组件或者顶层数据，是组件之间通信的桥梁，可用来传播数据。此外，React是**单向下发**的，没有向上回溯的能力。
- React组件间的通信。父组件可以很便利地通过props来控制子组件的显示形态，而子组件要想改变父组件的显示形态，只能通过执行父组件**预先提供好的函数props**。那么，如果想改变父组件形态的是曾孙子组件呢？你不会告诉我，把父组件提供的函数一级一级往下传递吧？

鉴于React的这些特性，如果把所有影响组件形态的数据集中起来，统一存放在一个的地方（理解为store吧），并且要改变组件形态只能通过修改store中的数据（数据流向大概是这样的：store => view => store），那么这个东西是不是特别吻合react的单向数据流呢？

### 概述

是的，Flux就是带着这个想法出现的，而Redux则是这个想法的最佳实践。说到Redux，人们可能最先想到的是hot loader或者redux-devtools这类酷炫的开发利器，而本篇文章就是要带你去窥探一下这个只有200多行，却很受欢迎的JavaScript的状态管理容器。
打个可爱的比喻，如果把react比喻成用户软件里上证股市里的K线图，那么redux就类似于上交所的交易系统，用户不能通过软件改变K线图的形状和排列，但可以通过下单去更改交易系统里的数据，进而改变炒股软件里的K线图。


### 核心概念

- view(React)
- action
- reducer
- store

在解释每个概念之前，我们先来捋一捋整体思路。Redux中应该有一个地方（store）用来存放所有可以改变页面（view）形态的数据。如果要改变某一块内容的形态，应该将影响这一块内容的数据(action)发送给store，而action如何与store中的数据合并就是reducer的职责了。

#### store

store是**唯一**一个存放了应用中所有的组件状态的数据的地方，但是store **≠** 状态数据对象。它包含一下方法：

 - getState()，一个用于返回状态数据对象的方法。
 - subscribe()，一个用于侦听数据变化的方法。
 - dispatch()，一个用于派发action的方法，这个方法会通知reducer生成一份新的状态数据。

#### action

action是一个描述发生了什么的对象，它作为数据从页面（view）传送到store的载体，是store数据的**唯一来源**。

```
    //用来描述删除一个ID为15的action
    let deleteAction = {
        type: 'DELETE',//必须字段，常量，且唯一
        id: 15 //非必须字段
    };
```

如上例，deleteAction用来描述一类删除操作，这对象中的type是不变的，而id是变化的，所以我们一般通过一个函数（actionCreator）来生成这个action对象。例如：

```
    //根据传入的id生成action
    function deleteRecordById(id){
        return {
            type: 'DELETE',
            id: id
        };
    }

```

#### reducer

action只是描述了有事情发生了这一事实，但是并没有告诉Redux如何更新store中的状态数据（state），这正是reducer的职责。
reducer表现形式上是一个纯函数，大概长这样：
```
    /**
     * reducer样例.
     * @param  {[Object]} previousState [上一个状态]
     * @param  {[Object]} action        [action]
     * @return {[Object]}               [新状态]
     */
    function(previousState, action){
        ...doSomething
        return newState;
    }
```

另外，reducer只是执行数据的合并，要保持纯净，永远不要在reducer中执行类似以下的操作：

 - 修改传入参数
 - 执行有副作用的操作，如 API 请求和路由跳转
 - 调用非纯函数，如 Date.now()

一个比较完整的例子（可以加减的数字控件）如下：
```
//一、========== Counter.js，数字控件组件
class Counter extends Component {
  render() {
    //通过props获得总数、加1函数和减1函数
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

//state提取
function mapStateToProps(state) {
  return {
        counter: state.counter
  };
}

//dispatch绑定到action
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

//绑定state和actionCreator到Counter组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);

//二、========== action.js
//加1actionCreator，返回一个action
export function increment() {
  return {
    type: 'INCREMENT'
  };
}

//减一actionCreator，返回一个action
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

//关联reducer，返回创建的store
export default createStore(rootReducer, null, null);
```
 
了解了以上3个核心概念之后，我们的数据流向变成了：

**view => action => reducer => store(state) => view**

即:
 1. view通过调用一个函数（actionCreator）产生一个action
 2. 通过store.dispatch将action传递给reducer
 3. reducer在已有state数据和action的基础上生成一份新的state
 4. 新的state传递给store保管，并触发了view的更新


### 最佳实践

#### action的type属性应该定义为常量，且唯一

type作为判断action要执行的内容的唯一标志属性，通常定义为常量，推荐以"业务"+"动作"的命名方式。

```
export const SUPPLIER_SHOP_SELECT = "SUPPLIER_SHOP_SELECT";
export const SUPPLIER_SHOP_UPDATE = "SUPPLIER_SHOP_UPDATE";
```

#### 不直接通过store.dispatch来派发action
虽然你可以轻松地在创建store的时候将其引用保存起来，然后直接通过store.dispatch来派发action，但是千万别那么做。
redux在设计的时候引入了**middleware**和**compose**，直接调用store.dispatch的话，就跳过了以上两个步骤，会导致表现方式不一致。

#### 启用ES7 decorators

redux与react的绑定需要通过'react-redux'提供的connect来完成，主要是将redux范畴的actionCreator和store中的state传递给react的组件。

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

#### Ajax/Fetch应该全都放在actionCreator中

所有数据接口请求的发起应该都放在actionCreator中，一来可以明确actionCreator层的职能（与后端的dao层类似），二来能避免组件层堆积太多非显示逻辑的代码。其实这也是react为显示负责，redux为数据负责的核心思想。

#### 所有影响组件渲染的数据尽量都放在store中
在派乐趣商家PC端的项目中，我犯了一个根本性的错误，把Notify组件(操作提示组件)的引用保存在一个工具类中，当需要显示信息时直接通过工具类提供的方法去修改Notify内部的state信息，进而改变Notify的显示和信息。就像是这样子：

```
NotifyUtils.error("操作失败！",'该商品不可删除！');
```

虽然这种方式带来了一定的便利性，但与我们说的数据驱动、显示和数据相分离的思想已经相背离了。正确的做法应该是通过dispatch一个action来决定Notify组件的显示和信息。

#### 放弃jquery，避免直接操作DOM
以我们目前的编码规范，一个简单dom元素的显示与否都需要一个属性来维护，很多人会觉得麻烦，但是随着业务功能越来越丰富，编码规范的重要性就体现出来了。


### 总结

- 单一数据源。
- store中的数据是只读的。要想修改数据，必须派发一个action。
- reducer要么返回原数据，要么生成一个新对象。






