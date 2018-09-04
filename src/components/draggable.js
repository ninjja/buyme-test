import React, { Component } from 'react';
import ResizeObserver from 'react-resize-observer';

export default class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      relX: 0,
      relY: 0
    };
  }

  onMouseDown = (e) => {
    if (e.button !== 0) return;
    const ref = this.handle;
    const body = document.body;
    const box = ref.getBoundingClientRect();
    this.setState({
      relX: e.pageX - (box.left + body.scrollLeft - body.clientLeft),
      relY: e.pageY - (box.top + body.scrollTop - body.clientTop)
    });
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    e.preventDefault();
  }
  onMouseUp = (e) => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    e.preventDefault();
  }
  onMouseMove = (e) => {
    this.props.onMove({
      x: Math.min(Math.max(e.pageX - this.state.relX, 0), window.innerWidth-this.props.width),
      y: Math.min(Math.max(e.pageY - this.state.relY, 0), window.innerHeight-this.props.height),
    });
    e.preventDefault();
  }
  render() {
    return (<span><div
    className={this.props.className}
          style={{
            position: 'absolute',
            left: this.props.x,
            top: this.props.y,
            width: this.props.width,
            height: this.props.height
          }}>
          <div className="handler" ref={ref => this.handle = ref} onMouseDown={this.onMouseDown} />
          <div className="chart">{this.props.children}</div>
          <ResizeObserver onResize={this.props.onResize} /></div></span>);
  }
}