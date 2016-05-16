import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

var LikeButton = React.createClass({
    getDefaultProps: function() {
        alert('getDefaultProps');
        return {
            title: 'This is a default props!!!',
        };
    },
    getInitialState: function() {
        alert('getInitialState');
        return {
            liked: false
        };
    },
    componentWillMount: function() {
        this.setState({
            liked: true
        })
        alert('componentWillMount');
    },
    componentDidMount: function() {
        alert('componentDidMount');
        window.setTimeout(function(){
            this.setState({
                liked: true,
            })
        }.bind(this),2000);
    },
    componentWillReceiveProps: function(nextProps) {
        alert('componentWillReceiveProps');
    },
    componentWillUpdate: function(nextProps, nextState) {
        alert('componentWillUpdate');
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        alert('shouldComponentUpdate');
        return true;
    },
    componentDidUpdate: function(prevProps, prevState) {
        alert('componentDidUpdate');
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        alert('render');
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
                {this.props.title} You {text} this Click to toggle.
            </p>
        );
    },
});
var LikeButtonBox = React.createClass({
    getInitialState: function() {
        return {
            data: 'parent date',
        };
    },
    componentDidMount: function() {
        window.setTimeout(function(){
            this.setState({
                date: 'changed',
            })
        }.bind(this),3000);
    },
    render: function(){
        return (
            <LikeButton title={this.state.data}></LikeButton>
        )
    }
})
ReactDOM.render(
    <div>
        <LikeButtonBox />
    </div>,
    document.getElementById('root')
)