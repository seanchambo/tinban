import ReactDOM from 'react-dom';
import ReactDnD from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    this.originalLane = props.laneId;
    return {
      id: props.card.id,
      laneId: props.laneId,
      index: props.index,
    };
  },
  endDrag(props, monitor) {
    if (monitor.getDropResult() || !this.originalLane) return;
    props.onDragCancelled(monitor.getItem().id, this.originalLane);
    delete this.originalLane;
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.card.id;
  },
};

const cardTarget = {
  hover(props, monitor, component) {
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

    props.onReorder(dragIndex, hoverIndex);
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

const CardWrapper = ({
  children,
  connectDragSource,
  connectDropTarget,
  isDragging,
}) => {
  const connect = component =>
    connectDragSource(connectDropTarget(component));

  return children({ connect, isDragging });
};

export default ReactDnD.DropTarget('laneItem', cardTarget, collectTarget)(ReactDnD.DragSource('laneItem', cardSource, collectSource)(CardWrapper));
