import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

var TestLifeComponents = React.createClass({
    getInitialState() {
        alert("init");
        return {
            color: "black",
            fontSize: "12px"  
        };
    },
    componentWillMount() {
        alert("will");
    },
    componentDidMount() {
        alert("did");
        window.setTimeout(function(){
            this.setState({
                color: "red",
                fontSize: "30px"
            });
        }.bind(this),1000);
    },
    componentWillUpdate(nextProps, nextState) {
        alert("update");
    },
    componentDidUpdate(prevProps, prevState) {
        alert("didupdate");  
    },
    render: function() {
        return <div style={this.state}>{this.props.text}</div>
    },
});

var TestClickComponents = React.createClass({
    handleClick: function(event) {
        var tipE = ReactDOM.findDOMNode(this.refs.tip);
        if(tipE.style.display == "inline"){
            tipE.style.display = "none";
        }else{
            tipE.style.display = "inline";
        }
        event.preventDefault();
    },
    render: function() {
        return (
            <div>
                <button onClick={this.handleClick}>显示|隐藏</button>
                <span ref="tip">测试内容</span>
            </div>
        )
    },
});

var TestInputComponents = React.createClass({
    getInitialState: function() {
        return {
            inputContent: ''
        };
    },
    handleChange: function(event) {
        this.setState({
            inputContent: event.target.value,
        })
    },
    render: function() {
        return (
            <div>
                <input onChange={this.handleChange} type="text"/>
                <span>{this.state.inputContent}</span>
            </div>
        )
    },
});

ReactDOM.render(
    <div>
        {/*<TestLifeComponents text="this is a react component"/>*/}
        <TestClickComponents />
        <TestInputComponents />
    </div>,
    document.getElementById('root')
)

