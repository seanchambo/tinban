import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDnD from 'react-dnd';

import Lane from './Lane';

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lanes: this.props.lanes,
    };

    this.moveCard = this.moveCard.bind(this);
    this.reorderCard = this.reorderCard.bind(this);
    this.reorderLane = this.reorderLane.bind(this);
  }

  moveCard(itemId, dragIndex, hoverIndex) {
    const { lanes } = this.state;
    const dupLanes = [...lanes];
    const oldLane = dupLanes.find(lane => lane.id === dragIndex);
    const newLane = dupLanes.find(lane => lane.id === hoverIndex);

    const item = oldLane.items.find(i => i.id === itemId);
    newLane.items = [...newLane.items, item];
    oldLane.items = oldLane.items.filter(i => i.id !== itemId);

    this.setState({
      ...this.state,
      lanes: dupLanes,
    });

    this.props.onMoveCard(itemId, dragIndex, hoverIndex);
  }

  reorderCard(laneId, dragIndex, hoverIndex) {
    const { lanes } = this.state;
    const dupLanes = [...lanes];
    const lane = dupLanes.find(l => l.id === laneId);
    const dupItems = [...lane.items];

    dupItems.splice(hoverIndex, 0, dupItems.splice(dragIndex, 1)[0]);
    lane.items = dupItems;

    this.setState({
      ...this.state,
      lanes: dupLanes,
    });

    this.props.onReorderCard(laneId, dragIndex, hoverIndex);
  }

  reorderLane(dragIndex, hoverIndex) {
    const { lanes } = this.state;
    const dupLanes = [...lanes];

    dupLanes.splice(hoverIndex, 0, dupLanes.splice(dragIndex, 1)[0]);

    this.setState({
      ...this.state,
      lanes: dupLanes,
    });

    this.props.onReorderLane(dragIndex, hoverIndex);
  }

  render() {
    const { laneComponent, cardComponent } = this.props;
    const { lanes } = this.state;

    return (
      <this.props.boardComponent>
        {lanes.map((lane, index) => (
          <Lane
            key={lane.id}
            index={index}
            data={{ ...lane }}
            dropValidation={lane.canDrop}
            items={lane.items}
            component={laneComponent}
            cardComponent={cardComponent}
            onDrop={this.moveCard}
            onReorder={this.reorderLane}
            onCardReorder={this.reorderCard}
          />
          ))}
      </this.props.boardComponent>
    );
  }
}

Board.propTypes = {
  lanes: PropTypes.array.isRequired,
  boardComponent: PropTypes.func.isRequired,
  cardComponent: PropTypes.func.isRequired,
  laneComponent: PropTypes.func.isRequired,
  onReorderLane: PropTypes.func,
  onReorderCard: PropTypes.func,
  onMoveCard: PropTypes.func,
};

Board.defaultProps = {
  onReorderLane: () => {},
  onReorderCard: () => {},
  onMoveCard: () => {},
};

export default ReactDnD.DragDropContext(HTML5Backend)(Board);
