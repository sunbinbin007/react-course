import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

var LikeButton = React.createClass({
    getInitialState: function() {
        return {
            liked: false
        };
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle.
            </p>
        );
    }
});

var TodoRow = React.createClass({
    getInitialState: function(){
        return {done: this.props.done}
    },
    handleClick: function(e){
        this.setState({done: !this.state.done});
    },
    render: function(){
        var textStyle = this.state.done ? {textDecoration: 'line-through'} : null;
        return (
            <li onClick={this.handleClick} style={textStyle}>
                {this.props.content}
            </li>
        );
    }
});

var TodoList = React.createClass({
    render: function(){
        var rows = [];
        this.props.items.map(function(item){
            rows.push(<TodoRow key={item.content} content={item.content} done={item.done} />)
        });
        return (
            <ul>{rows}</ul>
        );
    }
});

var ITEMS = [
    {content: '买菜', done: true},
    {content: '做饭', done: false},
    {content: '刷锅', done: true},
    {content: '跑步', done: false},
    {content: '睡觉', done: false}
];

ReactDOM.render(
    <div>
        <LikeButton />
        <TodoList items={ITEMS} />
    </div>,
    document.getElementById('root')
)