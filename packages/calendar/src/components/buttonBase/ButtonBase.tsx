import { ButtonBaseProps } from './ButtonBase.props';
import { parseCssDark } from '../../utils/common';
import { useRef, useState } from 'react';

let timeout: any;

const ButtonBase = (props: ButtonBaseProps) => {
  const {
    id,
    onClick,
    text,
    className,
    style,
    children,
    propagation,
    disabled,
    onClickFromParent,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onTouchEnd,
    isDark,
  } = props;

  const buttonRef: any = useRef(null);

  const [isPressed, setIsPressed] = useState(false);
  const [spanStyle, setSpanStyle] = useState({});

  const onButtonClick = (e: any) => {
    onClick(e);

    if (onClickFromParent) {
      onClickFromParent();
    }
  };

  const animateRipple = (event: any): void => {
    const button: any = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();

    const oneSide: number =
      button.clientWidth > button.clientHeight
        ? button.clientWidth
        : button.clientHeight;

    const touches: any = event.touches ? event.touches[0] : undefined;

    let clickLeft: number;
    let clickTop: number;

    if (touches) {
      clickLeft = touches.clientX - rect.left - oneSide;
      clickTop = touches.clientY - rect.top - oneSide;
    } else {
      clickLeft = event.clientX;
      clickTop = event.clientY;
    }

    const style: any = {
      width: `${oneSide * 2}px`,
      height: `${oneSide * 2}px`,
      left: `${clickLeft}px`,
      top: `${clickTop}px`,
    };

    setSpanStyle(style);

    setIsPressed(true);
  };

  const onTouchStart = (e: any): void => {
    if (!propagation) {
      e.stopPropagation();
    }

    if (props.onTouchStart) {
      props.onTouchStart(e);
    }
    if (isPressed) {
      setIsPressed(false);
    }

    timeout = setTimeout(() => {
      animateRipple(e);
    }, 100);
  };

  // Clear timeout for ripple effect
  const onTouchMove = (e: any): void => {
    if (!propagation) {
      e.stopPropagation();
    }

    if (props.onTouchMove) {
      props.onTouchMove(e);
    }
    clearTimeout(timeout);
  };

  const buttonText: string = text ? text : '';
  const buttonClassName: string = className
    ? `Kalend__button ${className} ${parseCssDark(
        'Kalend__ButtonBase',
        isDark
      )}`
    : `Kalend__button ${parseCssDark('Kalend__ButtonBase', isDark)}`;

  return (
    <button
      id={id}
      ref={buttonRef}
      onClick={onButtonClick}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      // onTouchStart={handleTouchStart}
      // onMouseLeave={handleTouchOff}
      // onTouchEnd={handleTouchOff}
      // onTouchEndCapture={handleTouchCancel}
      className={buttonClassName}
      style={style}
    >
      {children ? children : buttonText}
      {isPressed && !disabled ? (
        <span style={spanStyle} className={'Kalend__ButtonBase__animation'} />
      ) : null}
    </button>
  );
};

export default ButtonBase;
