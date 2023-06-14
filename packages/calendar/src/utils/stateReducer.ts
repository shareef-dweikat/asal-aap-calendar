const StateReducer: any = (state: any, action: any): any => {
  // Replace whole state
  if (!action.payload) {
    return { ...state, ...action };
  }

  const { stateName, type, data } = action.payload;

  switch (type) {
    default:
      return {
        ...state,
        [stateName]: data,
      };
  }
};

export default StateReducer;
