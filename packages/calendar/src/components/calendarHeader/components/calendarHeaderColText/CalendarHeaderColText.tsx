import { CalendarHeaderColTextProps } from './CalendarHeaderColText.props';

const CalendarHeaderColText = (props: CalendarHeaderColTextProps) => {
  const { children } = props;

  return (
    <div className={'Kalend__CalendarHeaderColText__container'}>{children}</div>
  );
};

export default CalendarHeaderColText;
