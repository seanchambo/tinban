import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDnD from 'react-dnd';

class Board extends React.Component {
  render() {
    return this.props.children;
  }
}

export default ReactDnD.DragDropContext(HTML5Backend)(Board);
