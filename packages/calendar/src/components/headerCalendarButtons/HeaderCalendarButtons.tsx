import { CALENDAR_VIEW } from '../../common/enums';
import { Context, Store } from '../../context/store';
import { HeaderCalendarButtonProps } from './HeaderCalendarButtons.props';
import { parseClassName } from '../../utils/common';
import { useContext } from 'react';
import ButtonBase from '../buttonBase/ButtonBase';

const HeaderCalendarButton = (props: HeaderCalendarButtonProps) => {
  const { buttonData, setViewChanged, handleClose, isForcedMobile } = props;

  const [store]: [Store] = useContext(Context);
  const { isDark, selectedView, isMobile } = store;

  const isSelected: boolean = buttonData.value === selectedView;
  const buttonClassName = `Kalend__header_calendar_button${
    isSelected ? '-selected' : ''
  }`;
  const textClassName = `Kalend__text Kalend__header_calendar_button-text${
    isSelected ? '-selected' : ''
  }`;

  const navigateFunction = (): void => {
    if (handleClose) {
      handleClose();
    }
    setViewChanged(buttonData.value);
  };

  return (
    <ButtonBase
      className={parseClassName(
        buttonClassName,
        isMobile || isForcedMobile,
        isDark
      )}
      isDark={isDark}
      onClick={navigateFunction}
    >
      <p className={parseClassName(textClassName, isMobile, isDark)}>
        {buttonData.label}
      </p>
    </ButtonBase>
  );
};

export const isSingleView = (disabledViews?: CALENDAR_VIEW[]): boolean => {
  if (
    !disabledViews ||
    (disabledViews &&
      disabledViews?.length + 1 !== Object.values(CALENDAR_VIEW).length)
  ) {
    return false;
  }

  return true;
};

interface HeaderCalendarButtonsProps {
  disabledViews?: CALENDAR_VIEW[];
  setViewChanged: any;
  handleClose?: any;
  isForcedMobile?: boolean; // force mobile layout for dropdown
}
/**
 * Buttons for switching calendar view in desktop layout
 * @constructor
 */
const HeaderCalendarButtons = (props: HeaderCalendarButtonsProps) => {
  const { setViewChanged, handleClose, isForcedMobile } = props;
  const [store]: [Store] = useContext(Context);

  const { isDark, isMobile, translations, config } = store;
  const { disabledViews } = config;

  return isSingleView(disabledViews) ? null : (
    <div
      className={parseClassName(
        'Kalend__header_calendar_buttons__container',
        !!(isMobile || isForcedMobile),
        isDark
      )}
    >
      {!disabledViews?.includes(CALENDAR_VIEW.AGENDA) ? (
        <HeaderCalendarButton
          buttonData={{
            label: translations['buttons']['agenda'],
            value: CALENDAR_VIEW.AGENDA,
          }}
          setViewChanged={setViewChanged}
          handleClose={handleClose}
          isForcedMobile={isForcedMobile}
        />
      ) : null}
      {!disabledViews?.includes(CALENDAR_VIEW.DAY) ? (
        <HeaderCalendarButton
          buttonData={{
            label: translations['buttons']['day'],
            value: CALENDAR_VIEW.DAY,
          }}
          setViewChanged={setViewChanged}
          handleClose={handleClose}
          isForcedMobile={isForcedMobile}
        />
      ) : null}
      {!disabledViews?.includes(CALENDAR_VIEW.THREE_DAYS) ? (
        <HeaderCalendarButton
          buttonData={{
            label: translations['buttons']['threeDays'],
            value: CALENDAR_VIEW.THREE_DAYS,
          }}
          setViewChanged={setViewChanged}
          handleClose={handleClose}
          isForcedMobile={isForcedMobile}
        />
      ) : null}
      {!disabledViews?.includes(CALENDAR_VIEW.WEEK) ? (
        <HeaderCalendarButton
          buttonData={{
            label: translations['buttons']['week'],
            value: CALENDAR_VIEW.WEEK,
          }}
          setViewChanged={setViewChanged}
          handleClose={handleClose}
          isForcedMobile={isForcedMobile}
        />
      ) : null}
      {!disabledViews?.includes(CALENDAR_VIEW.MONTH) ? (
        <HeaderCalendarButton
          buttonData={{
            label: translations['buttons']['month'],
            value: CALENDAR_VIEW.MONTH,
          }}
          setViewChanged={setViewChanged}
          handleClose={handleClose}
          isForcedMobile={isForcedMobile}
        />
      ) : null}
    </div>
  );
};

export default HeaderCalendarButtons;
