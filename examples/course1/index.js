import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

var Hello = React.createClass({
    getDefaultProps: function() {
        return {
            name: 'world'
        };
    },
    propTypes: {
        name: React.PropTypes.string
    },
    render: function(){
        return <div className="test">Hello {this.props.name}</div>;
        // return React.createElement('div', {}, 'Hello ',this.props.name);
    }
});

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

ReactDOM.render(
    <div>
        <Hello name={"world"} />
        <LikeButton />
    </div>,
    
    // React.createElement(Hello, {name: "world"}),
    document.getElementById('root')
)