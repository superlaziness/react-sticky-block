import {
  WINDOW_HEIGHT,
  CONTAINER_HEIGHT,
  SCROLL_OFFSET,
  OFFSETS,
} from './constants';

const emulateScroll =
  scrollHeight => block => progress => component => {
    const scrollDirection = progress <= 0.5 ? 'down' : 'up';
    const scrollPosition = scrollHeight - ((Math.abs(progress - 0.5) / 0.5) * scrollHeight);
    const { elOffset, fixedOffset, stuck } = component;
    return {
      testInitData: {
        scrollOffset: SCROLL_OFFSET,
        elWidth: 200,
      },
      testScrollState: {
        rect: {
          height: block,
          top: stuck && fixedOffset ? fixedOffset : (SCROLL_OFFSET - scrollPosition) + elOffset,
        },
        parentRect: {
          bottom: (CONTAINER_HEIGHT + SCROLL_OFFSET) - (scrollPosition - WINDOW_HEIGHT),
        },
        innerZone: WINDOW_HEIGHT - SCROLL_OFFSET,
        scrollPosition,
        scrollDirection,
      },
      topOffset: OFFSETS.topOffset,
      bottomOffset: OFFSETS.bottomOffset,
    };
  };

export default emulateScroll;
