// import { useEffect, useState } from 'react';
//
// export const getWidth = () => {
//   const rootEl = document.querySelector('.Kalend__Calendar__root');
//
//   if (rootEl) {
//     return rootEl.clientWidth;
//   }
//
//   return 0;
// };
//
// export const useWidth = () => {
//   const [width, setWidth] = useState(getWidth());
//
//   useEffect(() => {
//     const el = document?.querySelector('.Kalend__Calendar__root');
//     if (el) {
//       setWidth(el.clientWidth);
//     }
//   }, [document?.querySelector('.Kalend__Calendar__root')?.clientWidth]);
//
//   return width;
// };
//
// export const getHeight = () => {
//   const rootEl = document.querySelector('.Kalend__Calendar__table');
//   if (rootEl) {
//     return rootEl.clientHeight;
//   }
//
//   return 0;
// };
//
// /**
//  * Get height on resize
//  */
// export const useHeight = () => {
//   const [height, setHeight] = useState(getHeight());
//
//   // Get height on init
//   useEffect(() => {
//     getHeight();
//   }, []);
//
//   useEffect(() => {
//     const listenToResizeEvent = () => {
//       setHeight(getHeight());
//     };
//
//     window.addEventListener('resize', listenToResizeEvent);
//
//     return () => {
//       window.removeEventListener('resize', listenToResizeEvent);
//     };
//   }, []);
//
//   return height;
// };

export default {};
