// eslint-disable-next-line @typescript-eslint/no-use-before-define
import React, { useState } from 'react';

import { ButtonIconProps } from './ButtonIcon.props';
import { parseCssDark } from '../../utils/common';

const ButtonIcon = (props: ButtonIconProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const {
    children,
    onClick,
    size,
    disabled,
    isDark,
    iconSize,
    noActive,
    backdropClassName,
    style,
  } = props;

  const handleTouchStart = (): void => setIsPressed(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTouchOff = (e: any): void => setIsPressed(false);

  const containerClassName: string = !size
    ? 'Kalend__ButtonIcon__container'
    : `Kalend__ButtonIcon__container-${size}`;

  const backdropClassNameString: string = backdropClassName
    ? backdropClassName
    : 'Kalend__ButtonIcon__backdrop';

  const buttonClassName: string = noActive
    ? `${
        disabled ? 'Kalend__ButtonIcon__disabled ' : ''
      }Kalend__ButtonIcon-inactive`
    : `${disabled ? 'Kalend__ButtonIcon__disabled ' : ''}Kalend__ButtonIcon`;

  const IconElement: any = React.cloneElement(children, {
    className: parseCssDark(
      `Kalend__ButtonIcon__svg${iconSize ? `-${iconSize}` : '-normal'}`,
      isDark
    ),
  });

  return (
    <div className={containerClassName} style={style}>
      <button
        className={parseCssDark(buttonClassName, isDark)}
        onClick={onClick}
        disabled={disabled}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchOff}
      >
        {IconElement}
        {isPressed ? <div className={backdropClassNameString} /> : null}
      </button>
    </div>
  );
};

export default ButtonIcon;
