// tslint:disable-next-line:cyclomatic-complexity
const Reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'initialView':
      return {
        ...state,
        initialView: action.payload,
      };
    case 'selectedView':
      return {
        ...state,
        selectedView: action.payload,
      };
    case 'draggingDisabledConditions':
      return {
        ...state,
        draggingDisabledConditions: action.payload,
      };
    case 'resizeDisabledConditions':
      return {
        ...state,
        resizeDisabledConditions: action.payload,
      };
    case 'isMobile':
      return {
        ...state,
        isMobile: action.payload,
      };
    case 'isDark':
      return {
        ...state,
        isDark: action.payload,
      };
    case 'isNewEventOpen':
      return {
        ...state,
        isNewEventOpen: action.payload,
      };
    case 'showWeekNumbers':
      return {
        ...state,
        showWeekNumbers: action.payload,
      };
    case 'translations':
      return {
        ...state,
        translations: action.payload,
      };
    case 'style':
      return {
        ...state,
        style: action.payload,
      };
    case 'direction':
      return {
        ...state,
        direction: action.payload,
      };
    case 'daysViewLayout':
      return {
        ...state,
        daysViewLayout: action.payload,
      };
    case 'config':
      return {
        ...state,
        config: action.payload,
      };
    case 'colors':
      return {
        ...state,
        colors: action.payload,
      };
    case 'headerLayout':
      return {
        ...state,
        headerLayout: action.payload,
      };
    case 'monthLayout':
      return {
        ...state,
        monthLayout: action.payload,
      };
    case 'monthOverflowEvents':
      return {
        ...state,
        monthOverflowEvents: action.payload,
      };
    case 'showMoreEvents':
      return {
        ...state,
        showMoreEvents: action.payload,
      };
    case 'layoutUpdateSequence':
      return {
        ...state,
        layoutUpdateSequence: action.payload,
      };
    case 'events':
      return {
        ...state,
        events: action.payload,
      };
    case 'selectedDate':
      return {
        ...state,
        selectedDate: action.payload,
      };
    case 'calendarDays':
      return {
        ...state,
        calendarDays: action.payload,
      };
    case 'isLoading':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'rawWidth':
      return {
        ...state,
        rawWidth: action.payload,
      };
    case 'width':
      return {
        ...state,
        width: action.payload,
      };
    case 'height':
      return {
        ...state,
        height: action.payload,
      };
    case 'callbacks':
      return {
        ...state,
        callbacks: action.payload,
      };
    case 'headerEventRowsCount':
      return {
        ...state,
        headerEventRowsCount: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
