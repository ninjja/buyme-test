import React, { Component } from 'react';
import { render } from 'react-dom';
import ResizeObserver from 'react-resize-observer';
import Chart from './components/chart';
import Draggable from './components/draggable';
import './style.css';

class App extends Component {
  constructor() {
    super();
    const chartSize = window.localStorage.getItem('chartSize');
    const chartPosition = window.localStorage.getItem('chartPosition');
    const dimentsions = chartSize ? JSON.parse(chartSize) : ({ width: 600, height: 320 });
    const position = chartPosition ? JSON.parse(chartPosition) : ({ x: 0, y: 0 });
    this.state = {
      width: dimentsions.width, 
      height: dimentsions.height,
      x: position.x,
      y: position.y,
    };
  }

  handleResize = (rect) => {
    const { width, height } = rect;
    const dimentsions = { width, height };
    localStorage.setItem('chartSize', JSON.stringify(dimentsions));
    this.setState(dimentsions);
  }

  handleMove = (pos) => {
    const { x, y  } = pos;
    const position = { x, y };
    localStorage.setItem('chartPosition', JSON.stringify(position));
    this.setState(position);
  }

  render() {
    const { width, height, x, y } = this.state;
    return (
      <Draggable className="chart-wrapper"
                 width={width}
                 height={height}
                 x={x} y={y}
                 onMove={this.handleMove}
                 onResize={this.handleResize}>
        <Chart style={{width, height}} />
      </Draggable>
    );
  }
}


render(<App />, document.getElementById('root'));
