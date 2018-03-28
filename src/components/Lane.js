import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactDnD from 'react-dnd';
import ReactMotion from 'react-motion';

import Card from './Card';

const LaneSource = {
  beginDrag(props) {
    return {
      id: props.data.id,
      index: props.index,
    };
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.data.id;
  },
};

const LaneTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }

    props.onReorder(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

const LaneCardTarget = {
  canDrop(props, monitor, component) {
    const dropLaneId = props.data.id;
    const dragLaneId = monitor.getItem().laneId;
    const item = monitor.getItem().id;

    if (!props.dropValidation) { return true; }

    return props.dropValidation(item, dragLaneId, dropLaneId);
  },
  hover(props, monitor, component) {
    const item = monitor.getItem();
    const dragIndex = item.laneId;
    const hoverIndex = props.data.id;

    if (dragIndex !== hoverIndex && monitor.canDrop()) {
      props.onDrop(item.id, dragIndex, hoverIndex);
      monitor.getItem().laneId = hoverIndex;
      monitor.getItem().index = props.items.length;
    }
  },
};

const collectCardTarget = (connect, monitor) => ({
  connectCardDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isDroppable: monitor.canDrop(),
});

const collectSource = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

const collectTarget = connect => ({
  connectDropTarget: connect.dropTarget(),
});

class Lane extends React.Component {
  render() {
    const {
      data,
      items,
      cardComponent,
      connectDropTarget,
      connectDragSource,
      connectCardDropTarget,
      isOver,
      isDragging,
      isDroppable,
    } = this.props;

    return connectDragSource(connectDropTarget(connectCardDropTarget(<div>
      <this.props.component data={data} isOver={isOver} isDragging={isDragging} isDroppable={isDroppable}>
        {items.map((item, index) =>
          (<ReactMotion.Motion
            key={item.id}
            style={{
              y: ReactMotion.spring(index * 1, {
                stiffness: 100,
                damping: 18,
                precision: 0.05,
              }),
            }}
          >
            {({ y }) => (<Card
              laneId={this.props.data.id}
              style={{ transform: `translate3d(0, ${y}px, 0)` }}
              index={index}
              data={{ ...item }}
              onReorder={this.props.onCardReorder}
              component={cardComponent}
            />)}
           </ReactMotion.Motion>))}
        {this.props.addComponent && <this.props.addComponent laneId={this.props.data.id} />}
      </this.props.component>
    </div>)));
  }
}

Lane.propTypes = {
  data: PropTypes.object.isRequired,
  items: PropTypes.array,
  component: PropTypes.func.isRequired,
  cardComponent: PropTypes.func.isRequired,
  connectCardDropTarget: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onCardReorder: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  dropValidation: PropTypes.func,
  isDroppable: PropTypes.bool.isRequired,
  addComponent: PropTypes.func,
};

Lane.defaultProps = {
  items: [],
  dropValidation: () => true,
};

export default ReactDnD.DropTarget('lane', LaneTarget, collectTarget)(
  ReactDnD.DragSource('lane', LaneSource, collectSource)(
    ReactDnD.DropTarget('laneItem', LaneCardTarget, collectCardTarget)(Lane)));
