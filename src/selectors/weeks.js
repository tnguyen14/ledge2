export const getVisibleWeeks = (state) =>
  Object.keys(state)
    .filter((weekId) => state[weekId].visible)
    .sort((a, b) => new Date(b) - new Date(a));
