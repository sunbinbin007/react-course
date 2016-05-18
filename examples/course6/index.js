import 'babel-polyfill'
import React from 'react'
import ReactDOM,{ render } from 'react-dom'

class InputComponent1 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: 'test1',
        };
    }
    changeHandle(e){
        this.setState({
            value: e.target.value
        });
        console.log(this.state.value);
        window.setTimeout(()=>console.log(this.state.value),100);
    }
    render(){
        return(
            <div>
                <input type="text" value={this.state.value} onChange={this.changeHandle.bind(this)}/>
            </div>
        )
    }
}

class InputComponent2 extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: 'test1',
        };
    }
    changeHandle(e){
        console.log(e.target.value);
    }
    render(){
        return(
            <div>
                <input type="text" defaultValue='test2' onChange={this.changeHandle.bind(this)}/>
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <InputComponent1></InputComponent1>
        <br/><br/><br/>
        <InputComponent2></InputComponent2>
    </div>,
    document.getElementById('root')
)