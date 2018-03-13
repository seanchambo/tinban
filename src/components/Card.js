import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactDnD from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.data.id,
      laneId: props.laneId,
      index: props.index,
    };
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.data.id;
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const hoverLaneId = props.laneId;
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.onReorder(hoverLaneId, dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget(),
});

class Card extends React.Component {
  render() {
    const {
      data, connectDragSource, connectDropTarget, isDragging,
    } = this.props;

    return connectDragSource(
      connectDropTarget(
        <div style={this.props.style}>
          <this.props.component data={data} isDragging={isDragging} />
        </div>
      )
    );
  }
}

Card.propTypes = {
  laneId: PropTypes.any.isRequired,
  index: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onReorder: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
};

export default ReactDnD.DropTarget('laneItem', cardTarget, collectTarget)(
  ReactDnD.DragSource('laneItem', cardSource, collectSource)(Card));
