import './App.css';

import React from 'react';
import {inference} from './inference.js';
import {columnNames} from './inference.js';
import {modelDownloadInProgress} from './inference.js';
import Chart from "react-google-charts";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

class TextInputArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Enter text to classify emotion, model trained on English text',
      data:columnNames,
      latency:0.0,
      downloading:modelDownloadInProgress()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.checkModelStatus(),
      2000
    );
  }

  checkModelStatus() {
    this.setState({
      downloading: modelDownloadInProgress(),
    });
    if (!this.state.downloading) {
      this.timerID = setInterval(
        () => this.checkModelStatus,
        5000000
      );
    }
  }

  handleChange(event) {  
    inference(event.target.value).then( result => {
      this.setState({
        text : event.target.value,
        data:result[1],
        latency:result[0],
      });
    });
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">   
      <em>In-Browser NLP Inference</em>
      <Chart  
        width={'500px'}
        height={'350px'}
        chartType="BarChart"
        data={this.state.data}
        options={{
          chartArea: { width: '55%'},
          colors: ['purple'],
          backgroundColor: '#282c34',
          legend: { 
            textStyle: {color: 'white', fontSize: 10},
            labels: {fontColor:'white'}
          },
          vAxis: {
            textStyle: {
            color: 'white',
            fontSize: 13
          }
          },
          hAxis: {
            minValue: 5,
            maxValue: 50,
            textStyle: {
              color: 'white'
            }
          }
      }}
      />  
      
      {this.state.downloading && 
        <div><font size="2">Downloading model from CDN to browser..</font>
        <Box sx={{ width: '400px' }}>
        <LinearProgress />
        </Box> 
        <p></p>
        </div>
      }
      <textarea rows="8" cols="24" className="App-textarea" name="message" 
       placeholder={this.state.text} autoFocus onChange={this.handleChange}>
      </textarea>
       <div><font size="3">Inference Latency {this.state.latency} ms</font></div>
      <div><font size="3"><a href="https://github.com/jobergum/browser-ml-inference">Github browser-ml-inference </a></font></div>
      </header>
    </div>   
    );
  }
}
export default TextInputArea;
