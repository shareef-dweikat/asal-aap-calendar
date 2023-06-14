import { Context, Store } from '../context/store';
import { getTableOffset } from '../utils/common';
import { useContext, useEffect } from 'react';

const DimensionsLayoutLayer = (props: { children: any }) => {
  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };
  const { selectedView, headerEventRowsCount, showWeekNumbers } = store;

  useEffect(() => {
    const el = document?.querySelector('.Kalend__Calendar__root');

    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const entryRect = entries[0].contentRect;

      const width = entryRect.width;

      if (width < 750) {
        setContext('isMobile', true);
      } else {
        setContext('isMobile', false);
      }

      setContext('rawWidth', entryRect.width);
      setContext(
        'width',
        entryRect.width - getTableOffset(selectedView, showWeekNumbers)
      );
    });

    resizeObserver.observe(el);
  }, [document?.querySelector('.Kalend__Calendar__root'), selectedView]);

  useEffect(() => {
    const el = document?.querySelector('.Kalend__Calendar__root');

    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const entryRect = entries[0].contentRect;

      const width = entryRect.width;

      if (width < 750) {
        setContext('isMobile', true);
      } else {
        setContext('isMobile', false);
      }

      setContext('rawWidth', entryRect.width);
      setContext(
        'width',
        entryRect.width - getTableOffset(selectedView, showWeekNumbers)
      );
    });

    resizeObserver.observe(el);
  }, []);

  useEffect(() => {
    const el = document?.querySelector('.Kalend__Calendar__table');

    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const entryRect = entries[0].contentRect;

      setContext('height', entryRect.height);
    });

    resizeObserver.observe(el);
  }, [
    document?.querySelector('.Kalend__Calendar__table'),
    selectedView,
    headerEventRowsCount,
  ]);

  useEffect(() => {
    const el = document?.querySelector('.Kalend__Calendar__table');

    if (!el) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      const entryRect = entries[0].contentRect;

      setContext('height', entryRect.height);
    });

    resizeObserver.observe(el);
  }, []);

  return props.children;
};

export default DimensionsLayoutLayer;
