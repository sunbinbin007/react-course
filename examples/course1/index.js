import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

var Hello = React.createClass({
    render: function(){
        return <div>Hello {this.props.name}</div>;
        // return React.createElement('div', {}, 'Hello ',this.props.name);
    }
});

ReactDOM.render(
    <Hello name="world" />,
    // React.createElement(Hello, {name: "world"}),
    document.getElementById('root')
)