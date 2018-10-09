import ReactDOM from 'react-dom';
import ReactDnD from 'react-dnd';

const LaneSource = {
  beginDrag(props) {
    return {
      id: props.lane.id,
      index: props.index,
    };
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.lane.id;
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
    const dropLaneId = props.lane.id;
    const dragLaneId = monitor.getItem().laneId;
    const item = monitor.getItem().id;

    if (!props.canDropCard) { return true; }

    return props.canDropCard(item, dragLaneId, dropLaneId);
  },
  drop(props, monitor) {
    props.onCardDrop(monitor.getItem().id);
  },
  hover(props, monitor) {
    const item = monitor.getItem();
    const dragIndex = item.laneId;
    const hoverIndex = props.lane.id;

    if (dragIndex !== hoverIndex && monitor.canDrop()) {
      props.onLaneHover(item.id, dragIndex);
      monitor.getItem().laneId = hoverIndex;
      monitor.getItem().index = props.lane.cards.length - 1;
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

const LaneWrapper = ({
  children,
  connectDropTarget,
  connectDragSource,
  connectCardDropTarget,
  isOver,
  isDragging,
}) => {
  const connect = component =>
    connectDragSource(connectDropTarget(connectCardDropTarget(component)));

  return children({ connect, isOver, isDragging });
};

export default ReactDnD.DropTarget('lane', LaneTarget, collectTarget)(ReactDnD.DragSource('lane', LaneSource, collectSource)(ReactDnD.DropTarget('laneItem', LaneCardTarget, collectCardTarget)(LaneWrapper)));
