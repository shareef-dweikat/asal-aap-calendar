/* eslint-disable */
import { CarouselProps } from './Carousel.props';
import { EvaIcons } from '../eva-icons';
import { useEffect, useState } from 'react';

const SCREEN_PORTION = 6;

const Carousel = (props: CarouselProps) => {
  const [swipeAnimation, setSwipeAnimation] = useState('');
  const { onPageChange } = props;
  const baseWidth: number = 0;
  const [isSwiping, setSwiping] = useState(0);
  const [initTouchX, setInitTouchX] = useState(0);
  const [initTouchY, setInitTouchY] = useState(0);

  const [touchDiff, setTouchDiff] = useState(0);
  const [yPosition, setYPosition] = useState(0);

  const OFFSET_FOR_TRIGGER: number = baseWidth / SCREEN_PORTION;

  // Scroll to middle screen
  useEffect(() => {
    document.getElementById('Kalend__carousel')?.scrollTo(baseWidth / 2, 0);
  }, []);

  const handleTouchStart = (e: any) => {
    const touchEventX = e.nativeEvent.touches[0].clientX;
    const touchEventY = e.nativeEvent.touches[0].clientY;

    // Set initial touch point
    // setXBase(touchEventX);
    setInitTouchX(touchEventX);
    setInitTouchY(touchEventY);
  };
  const handleTouchEnd = () => {
    // Going forward
    if (touchDiff > OFFSET_FOR_TRIGGER) {
      onPageChange(true);
      setSwipeAnimation('Kalend__carousel-swipe-right');
      // scrollBack();
    } else if (touchDiff * -1 > OFFSET_FOR_TRIGGER) {
      // Going back
      setSwipeAnimation('Kalend__carousel-swipe-left');
      onPageChange(false);
      // scrollBack();
    } else {
      // Revert to base position
      // scrollBack();
    }
    setTouchDiff(0);
    setSwiping(0);
    setYPosition(0);
  };
  const handleMove = (e: any) => {
    // Handle touch events
    const touchEventX: number = e.nativeEvent.touches[0].clientX;
    const touchEventY: number = e.nativeEvent.touches[0].clientY;

    const differenceInTouch: number = initTouchX - touchEventX;

    if (
      (differenceInTouch > 0 && differenceInTouch > 20) ||
      (differenceInTouch < 0 && differenceInTouch < -20)
    ) {
      setTouchDiff(differenceInTouch);
      setSwiping(differenceInTouch);
    }
  };

  const baseStyleRight: any = {
    width: '100%',
    height: '100%',
    zIndex: 9999,
    position: 'fixed',
  };

  return (
    <div
      onTouchMove={handleMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`Kalend__carousel__wrapper ${swipeAnimation}`}
      id={'Kalend__carousel'}
    >
      {props.children}
      {isSwiping > 0 ? (
        <div
          className={'Kalend__carousel__control-right'}
          style={baseStyleRight}
        >
          <EvaIcons.ChevronRight className={'Kalend__svg-icon'} />
        </div>
      ) : null}
      {isSwiping < 0 ? (
        <div
          className={'Kalend__carousel__control-left'}
          style={baseStyleRight}
        >
          <EvaIcons.ChevronLeft
            className={'Kalend__svg-icon'}
            style={{ width: 50, height: 50 }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Carousel;
