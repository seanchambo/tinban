import React from 'react';
import Box, { VBox, Page } from 'react-layout-components';

import { Board, Lane, Card, moveCard, reorderCard, reorderLane } from 'tinban';

const BoardTest = props => (
  <Box
    fit
    width="100%"
    height="100%"
    justifyContent="space-around"
    alignItems="stretch"
  >
    {props.children}
  </Box >
);

const LaneTest = (props) => {
  let style = {
    width: 200, height: '100%', padding: 20, border: '1px solid #c4c4c4', borderRadius: 5,
  };

  if (props.isOver) {
    style = { ...style, backgroundColor: 'green' };
  }

  if (props.isDragging) {
    style = { ...style, opacity: 0 };
  }

  return (
    <VBox
      style={style}
    >
      <h1>{props.lane.title}<span>({props.lane.cards.length})</span></h1>
      {props.children}
    </VBox>
  );
};

const CardTest = (props) => {
  let style = {
    margin: 10, height: 100, border: '1px solid #c4c4c4', borderRadius: 5,
  };

  if (props.isDragging) {
    style = { ...style, opacity: 0 };
  }

  return (
    <Box
      center
      style={style}
    >
      {props.card.id}
    </Box>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lanes: [{
        id: 1,
        title: 'Draft',
        cards: [{ id: 1 }, { id: 2 }],
      }, {
        id: 2,
        title: 'Proposed',
        cards: [{ id: 3 }, { id: 4 }],
      }],
    };
  }

  render() {
    const { lanes } = this.state;

    return (
      <Page style={{ padding: 20 }}>
        <Board>
          <BoardTest>
            {
              lanes.map((lane, laneIndex) => (
                <Lane
                  key={lane.id}
                  lane={lane}
                  index={laneIndex}
                  canDropCard={() => true}
                  onReorder={(fromIndex, toIndex) => {
                    reorderLane(lanes, fromIndex, toIndex);

                    this.setState({ lanes });
                  }}
                  onCardDrop={(cardId, fromLane) => {
                    moveCard(lanes, cardId, fromLane, lane.id);

                    this.setState({ lanes });
                  }}
                >
                  {({ connect: connectLane, isDraggingLane, isOver }) => connectLane((
                    <div>
                      <LaneTest isDragging={isDraggingLane} isOver={isOver} lane={lane}>
                        {lane.cards.map((card, cardIndex) => (
                          <Card
                            key={card.id}
                            card={card}
                            index={cardIndex}
                            laneId={lane.id}
                            onReorder={(fromIndex, toIndex) => {
                              reorderCard(lanes, lane.id, fromIndex, toIndex);

                              this.setState({ lanes });
                            }}
                          >
                            {({ connect: connectCard, isDraggingCard }) => connectCard((
                              <div>
                                <CardTest isDragging={isDraggingCard} card={card} />
                              </div>
                            ))}
                          </Card>))}
                      </LaneTest>
                    </div>))}
                </Lane>))
            }
          </BoardTest>
        </Board>
      </Page>
    );
  }
}

export default App;
