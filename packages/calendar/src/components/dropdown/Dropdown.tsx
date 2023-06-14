import { Context, Store } from '../../context/store';
import { parseCssDark } from '../../utils/common';
import { useContext, useLayoutEffect, useState } from 'react';
import ButtonBase from '../buttonBase/ButtonBase';

const Dropdown = (props: any) => {
  const [store]: [Store] = useContext(Context);

  const { translations, height } = store;

  const [isVisible, setVisible] = useState(false);
  const [layout, setLayout] = useState<any>({ x: null, y: null });

  const handleClick = (e: any) => {
    const { x, y } = e.nativeEvent;

    setLayout({ x, y });
    setVisible(true);
  };

  const getStyle = () => {
    if (layout.x) {
      return {
        left: layout.x,
        top: layout.y,
        maxWidth: 300,
        maxHeight: height - 24,
        minWidth: 120,
        height: 'auto',
        overflowX: 'hidden',
        overflowY: 'auto',
      };
    }
  };

  // Correct layout
  useLayoutEffect(() => {
    if (isVisible) {
      const element: any = document.getElementById(
        'Kalend__Dropdown__container'
      );
      if (element) {
        let newX = layout.x;
        let newY = layout.y;

        if (element.offsetHeight + layout.y > window.innerHeight) {
          newY = layout.y - element.offsetHeight;
        }
        if (element.offsetWidth + layout.x > window.innerWidth) {
          newX = layout.x - element.offsetWidth;
        }

        setLayout({
          x: newX,
          y: newY,
        });
      }
    }
  }, [
    isVisible,
    document.getElementsByClassName('Kalend__Dropdown__container'),
  ]);

  const style: any = getStyle();

  return (
    <>
      <ButtonBase
        className={parseCssDark('Kalend__Monthview_Event', store.isDark)}
        style={{
          width: props.width,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 20,
        }}
        onClick={handleClick}
        isDark={store.isDark}
      >
        <p
          className={parseCssDark('Kalend__text', !store.isDark)}
          style={{ fontSize: 11 }}
        >
          {translations['buttons']['showMore']}
        </p>
      </ButtonBase>
      {isVisible ? (
        <div
          className={'Kalend__Dropdown__backdrop'}
          onClick={() => setVisible(false)}
        >
          <div
            className={parseCssDark(
              'Kalend__Dropdown__container',
              store.isDark
            )}
            id="Kalend__Dropdown__container"
            style={style}
          >
            {props.children}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Dropdown;
