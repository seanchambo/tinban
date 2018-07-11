export const moveCard = (lanes, itemId, dragIndex, hoverIndex) => {
  const oldLane = lanes.find(lane => lane.id === dragIndex);
  const newLane = lanes.find(lane => lane.id === hoverIndex);

  const item = oldLane.cards.find(i => i.id === itemId);
  newLane.cards = [...newLane.cards, item];
  oldLane.cards = oldLane.cards.filter(i => i.id !== itemId);
};

export const reorderCard = (lanes, laneId, dragIndex, hoverIndex) => {
  const lane = lanes.find(l => l.id === laneId);
  const dupItems = [...lane.cards];

  dupItems.splice(hoverIndex, 0, dupItems.splice(dragIndex, 1)[0]);
  lane.cards = dupItems;
};

export const reorderLane = (lanes, dragIndex, hoverIndex) => {
  lanes.splice(hoverIndex, 0, lanes.splice(dragIndex, 1)[0]);
};
