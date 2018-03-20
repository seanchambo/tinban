import React from 'react';
import Box, { VBox, Page } from 'react-layout-components';

import { Board as Tinban } from 'tinban';

const Lane = (props) => {
  let style = { width: 200, height: '100%', padding: 20, border: '1px solid #c4c4c4', borderRadius: 5 };

  if (props.isOver) {
    style = { ...style, backgroundColor: 'green' };
  }

  if (!props.canDrop) {
    style = { ...style, backgroundColor: 'red' };
  }

  if (props.isDragging) {
    style = { ...style, opacity: 0 };
  }

  return (
    <VBox
      style={style}>
      <h1>{props.data.title}<span>({props.data.items.length})</span></h1>
      {props.children}
    </VBox>
  )
}

const Board = (props) => {
  return (
    <Box
      fit
      width="100%"
      height="100%"
      justifyContent="space-around"
      alignItems="stretch">
      {props.children}
    </Box>
  );
}

const Card = (props) => {
  let style = { margin: 10, height: 100, border: '1px solid #c4c4c4', borderRadius: 5};

  if (props.isDragging) {
    style = { ...style, opacity: 0 };
  }

  return (
    <Box
      center
      style={style}>
      {props.data.id}
    </Box>
  );
}

const App = () => {
  return (
    <Page style={{ padding: 20 }}>
      <Tinban
        boardComponent={Board}
        laneComponent={Lane}
        cardComponent={Card}
        lanes={[{
          id: 1,
          title: 'Todo',
          items: [{ id: 1 }],
          canDrop: (itemId, prevLaneId, newLaneId) => {
            return prevLaneId !== 2;
          }
        }, {
           id: 2,
           title: 'Done',
           items: [{ id: 2 }, { id: 3 }]
         }
       ]} />
    </Page>
  );
}

export default App;
