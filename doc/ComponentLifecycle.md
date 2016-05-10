# React 组件生命周期

###生命周期的三个过程
1. Mounted
>React Components 被 render 解析生成对应的 DOM 节点并被插入浏览器 DOM 结构的一个过程
2. Update
>一个 mounted 的 React Components 被重新 render 的过程
3. Unmounted
>一个 mounted 的 React Components 对应的 DOM 节点被从 DOM 结构中移除的这样一个过程


###每个状态 React 都封装了对应的 hook 函数
1. 挂载（Mounting）

    1. getDefaultProps()
    2. getInitialState()
    3. componentWillMount
    4. render
    5. componentDidMount

2. 更新（Updating）

    1. componentWillReceiveProps
    2. shouldComponentUpdate
    3. componentWillUpdate
    4. render
    5. componentDidUpdate

3. 移除（Unmounting）

    1. componentWillUnmount

