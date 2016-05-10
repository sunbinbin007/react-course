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

var JSXComponent = React.createClass({
    render: function(){
        return (
            <div>
                <div>
                    <viv>JSXContent</viv>
                </div>
            </div>
        )
    }
})

var JSComponent = React.createClass({
    render: function(){
        return (
            React.createElement('div', null, 
                React.createElement('div', null, 
                    React.createElement('div', null, 
                        'JSContent'
                    )
                )
            )
        )
    }
})

var IfComponent = React.createClass({
    getInitialState: function(){
        return {
            show: true,
        }
    },
    handleClick: function(event){
        this.setState({
            show: !this.state.show,
        })
    },
    render: function(){
        return (
            <div>
                <button onClick={this.handleClick}>显示|隐藏</button>
                {this.state.show && <span>Hello</span>}
            </div>
        )
    }
});

var MapComponent = React.createClass({
    render: function(){
        return(
            <ul>
                {this.props.items.map(item => <li key={item}>{item}</li>)}
            </ul>
        )
    }
});

ReactDOM.render(
    <div>
        <Hello name={"world"} />
        <LikeButton />
        <IfComponent />
        <MapComponent items={[1,2,3,4]} />
        <JSXComponent />
        <JSComponent />
    </div>,
    
    // React.createElement(Hello, {name: "world"}),
    document.getElementById('root')
)