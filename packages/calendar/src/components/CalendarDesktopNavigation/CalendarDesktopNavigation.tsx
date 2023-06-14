import { CALENDAR_NAVIGATION_DIRECTION } from '../../common/enums';
import { CalendarDesktopNavigationProps } from './CalendarDesktopNavigation.props';
import { Context, Store } from '../../context/store';
import { EvaIcons } from '../eva-icons';
import {
  getCurrentTime,
  parseClassName,
  parseCssDark,
} from '../../utils/common';
import {
  getNewCalendarDays,
  navigateToToday,
} from '../../utils/getCalendarDays';
import { parseToDateTime } from '../../utils/dateTimeParser';
import { useContext, useEffect, useState } from 'react';
import ButtonBase from '../buttonBase/ButtonBase';
import ButtonIcon from '../buttonIcon/ButtonIcon';
import CalendarViewDropdown from '../calendarViewDropdown/CalendarViewDropdown';
import DesktopLayout from '../desktopLayout/DesktopLayout';
import HeaderCalendarButtons from '../headerCalendarButtons/HeaderCalendarButtons';
import HeaderCalendarTitle from '../headerCalendarTitle/HeaderCalendarTitle';
import MobileLayout from '../mobileLayout/MobileLayout';

/**
 * Title with calendar navigation buttons for desktop layout
 * @param props
 * @constructor
 */
const CalendarDesktopNavigation = (props: CalendarDesktopNavigationProps) => {
  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };
  console.log(props, "buttonnsschild")

  const {
    config,
    calendarDays,
    selectedView,
    selectedDate,
    isMobile,
    width,
    translations,
  } = store;
  const { weekDayStart, isDark } = config;

  const [isFullNavigationHidden, setIsFullNavigationHidden] = useState(true);

  const titleDate = parseToDateTime(selectedDate, config.timezone);
  const title = `${translations['months'][`${titleDate.toFormat('MMMM').toLowerCase()}`]
    } ${titleDate.toFormat('yyyy')}`;

  const navigateBackwards = async () => {
    setContext('calendarContent', null);

    setContext('direction', CALENDAR_NAVIGATION_DIRECTION.BACKWARDS);

    getNewCalendarDays(
      calendarDays,
      selectedView,
      CALENDAR_NAVIGATION_DIRECTION.BACKWARDS,
      weekDayStart,
      setContext
    );
  };

  const navigateForward = async () => {
    setContext('calendarContent', null);

    setContext('direction', CALENDAR_NAVIGATION_DIRECTION.FORWARD);

    getNewCalendarDays(
      calendarDays,
      selectedView,
      CALENDAR_NAVIGATION_DIRECTION.FORWARD,
      weekDayStart,
      setContext
    );
  };

  const navigateToTodayDate = async (): Promise<void> => {
    setContext('calendarContent', null);

    setContext('direction', CALENDAR_NAVIGATION_DIRECTION.TODAY);

    await navigateToToday(
      selectedView,
      setContext,
      weekDayStart,
      getCurrentTime(config.timezone)
    );
  };

  // handle showing  full desktop navigation panel or dropdown for
  // different screen size
  useEffect(() => {
    const element: any = document.querySelector(
      parseCssDark('.Kalend__CalendarDesktopNavigation__container', isDark)
    );

    if (element) {
      if (element) {
        if (element.getBoundingClientRect().width <= 950) {
          setIsFullNavigationHidden(true);
        } else {
          setIsFullNavigationHidden(false);
        }
      }
    }
  }, [width]);

  // add funcs to ref
  useEffect(() => {
    if (props.kalendRef) {
      props.kalendRef.current = {
        navigateToTodayDate,
        navigateForward,
        navigateBackwards,
      };
    }
  }, []);
  useEffect(() => {
    if (props.kalendRef) {
      props.kalendRef.current = {
        navigateToTodayDate,
        navigateForward,
        navigateBackwards,
      };
    }
  }, [selectedView, calendarDays[0].toString()]);

  return props.kalendRef ? null : (
    <div
      className={parseClassName(
        'Kalend__CalendarDesktopNavigation__container',
        isMobile,
        isDark
      )}
      style={{ height: 'auto', maxHeight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: isMobile ? '100%' : 'auto',
        }}
      >

        <div style={{ display: 'flex', justifyContent: "space-around" }} className='headerCont'>
          {props.children}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }} className='headerCont'>
              <div className={'Kalend__CalendarDesktopNavigation__buttons'}>
                <>
                  <ButtonIcon
                    isDark={isDark}
                    key={'left'}
                    onClick={navigateBackwards}
                  >
                    <EvaIcons.ChevronLeft
                      className={parseCssDark('Kalend__icon-svg', isDark)}
                    />
                  </ButtonIcon>
                  <HeaderCalendarTitle title={title} />
                  <ButtonIcon
                    isDark={isDark}
                    key={'right'}
                    onClick={navigateForward}
                  >
                    <EvaIcons.ChevronRight
                      className={parseCssDark('Kalend__icon-svg', isDark)}
                    />
                  </ButtonIcon>
                </>
              </div>
              <div style={{ color: props.vacationDaysTextColor, fontSize: 18, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>03</div>
                <div>Vacation</div>
                <div>Days</div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flex: 'auto',
        }}
      >
        <DesktopLayout>
          <HeaderCalendarButtons
            disabledViews={props.disabledViews}
            setViewChanged={props.setViewChanged}
          />
        </DesktopLayout>
      </div>
    </div >
  );
};

export default CalendarDesktopNavigation;
