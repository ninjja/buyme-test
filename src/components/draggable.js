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
    const { props: { width, height, onMove }, state: { relX, relY } } = this;
    onMove({
      x: Math.min(Math.max(e.pageX - relX, 0), window.innerWidth - width),
      y: Math.min(Math.max(e.pageY - relY, 0), window.innerHeight - height),
    });
    e.preventDefault();
  }
  render() {
    const { className, children, width, height, x: left, y: top, resizable, onResize } = this.props;
    return (
      <div className={className}
           style={{resize: (resizable ? 'both' : 'none'), position: 'absolute', left, top, width, height}}>
        <div className="handler" ref={ref => this.handle = ref} onMouseDown={this.onMouseDown} />
        <div className="chart">{children}</div>
        {resizable && <ResizeObserver onResize={onResize} />}
      </div>
    );
  }
}