import { CalendarViewDropdownProps } from './CalendarViewDropdown.props';
import { Config } from '../../common/interface';
import { Context, Store } from '../../context/store';
import { EvaIcons } from '../eva-icons';
import { parseCalendarViewToText, parseCssDark } from '../../utils/common';
import { useContext, useState } from 'react';
import ButtonBase from '../buttonBase/ButtonBase';
import ButtonIcon from '../buttonIcon/ButtonIcon';
import HeaderCalendarButtons, {
  isSingleView,
} from '../headerCalendarButtons/HeaderCalendarButtons';

const CalendarViewDropdown = (props: CalendarViewDropdownProps) => {
  const { setViewChanged } = props;

  const [isOpen, setOpen] = useState(false);

  const [store]: [Store] = useContext(Context);
  const { config, isMobile, selectedView, translations } = store;
  const { isDark, disabledViews, disableMobileDropdown } = config as Config;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (isMobile && (disableMobileDropdown || isSingleView(disabledViews))) ||
    isSingleView(disabledViews) ? null : (
    <>
      <div className={'Kalend__CalendarViewDropdown__wrapper'}>
        {isMobile ? (
          <ButtonIcon isDark={isDark} key={'calendar'} onClick={handleOpen}>
            <EvaIcons.More className={parseCssDark('icon-svg', isDark)} />
          </ButtonIcon>
        ) : (
          <ButtonBase
            isDark={isDark}
            className={parseCssDark('Kalend__ButtonBase-border', isDark)}
            onClick={handleOpen}
            text={parseCalendarViewToText(selectedView, translations)}
          />
        )}
        {isOpen ? (
          <div
            className={'Kalend__CalendarViewDropdown__backdrop'}
            onClick={handleClose}
          />
        ) : null}
        {isOpen ? (
          <div
            className={parseCssDark(
              'Kalend__CalendarViewDropdown__container',
              isDark
            )}
          >
            <div
              className={'Kalend__CalendarViewDropdown__container-content'}
              onClick={preventDefault}
            >
              <HeaderCalendarButtons
                disabledViews={disabledViews}
                setViewChanged={setViewChanged}
                handleClose={handleClose}
                isForcedMobile={true}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CalendarViewDropdown;
