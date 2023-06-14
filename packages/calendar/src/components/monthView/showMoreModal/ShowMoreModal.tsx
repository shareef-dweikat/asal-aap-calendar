import { Context, Store } from '../../../context/store';
import { EVENT_TYPE } from '../../../common/enums';
import { useContext } from 'react';
import EventButton from '../../eventButton/EventButton';

const ShowMoreModal = () => {
  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { showMoreEvents } = store;

  const renderMoreEvents = () => {
    if (!showMoreEvents) {
      return [];
    }

    return showMoreEvents.events.map((event: any) => {
      return (
        <EventButton
          key={`${event.id}${event.internalID ? event.internalID : ''}`}
          item={{ event }}
          type={EVENT_TYPE.SHOW_MORE_MONTH}
        />
      );
    });
  };

  const events: any = renderMoreEvents();

  const handleClose = () => {
    setContext('showMoreEvents', null);
  };

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={'Kalend__ShowMoreModal__wrapper'} onClick={handleClose}>
      <div
        className={'Kalend__ShowMoreModal__container'}
        onClick={preventDefault}
      >
        <h6
          style={{
            fontSize: 16,
            padding: 0,
            margin: 4,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          {showMoreEvents?.day.toFormat('dd. MMM')}
        </h6>
        {events}
      </div>
    </div>
  );
};

export default ShowMoreModal;
