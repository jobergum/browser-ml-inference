import './App.css';
import React from 'react';
import inference from './inference.js';


class TextInputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Enter text (english only) to classify emotion',
      emoji: 'Unknown 🙈',
      score: 100
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {  
    inference(event.target.value).then( result => {
      this.setState({
        text : event.target.value,
        emoji: result[0],
        score:result[1]
      });
    });
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <p>Predicted emotion:&nbsp; {this.state.emoji},&nbsp;Confidence {this.state.score}%</p>  
        <textarea rows="8" cols="24" className="App-textarea" name="message" 
          placeholder={this.state.text} autoFocus onChange={this.handleChange}>
        </textarea> 
      </header>
    </div>   
    );
  }
}
export default TextInputArea;
