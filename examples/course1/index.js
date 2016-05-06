import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

var Hello = React.createClass({
    render: function(){
        return <div>Hello {this.props.name}</div>;
    }
});

ReactDOM.render(<Hello name="world" />,
    document.getElementById('root')
)