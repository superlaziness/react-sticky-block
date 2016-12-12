import React, { PureComponent, PropTypes } from 'react';

const STYLES = {
  default: { position: 'static' },
  stuck: {
    position: 'fixed',
    top: 0,
  },
};

export default class StickyBlock extends PureComponent {
  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    initTimeout: PropTypes.number,
    children: PropTypes.oneOfType([
      PropTypes.element.isRequired,
      PropTypes.array.isRequired,
    ]),

    // props only for testing
    testInitData: React.PropTypes.shape({
      scrollOffset: React.PropTypes.number,
      elWidth: React.PropTypes.number,
    }),
    testScrollState: React.PropTypes.shape({
      rect: React.PropTypes.shape({
        height: React.PropTypes.number,
        top: React.PropTypes.number,
      }),
      parentRect: React.PropTypes.shape({
        bottom: React.PropTypes.number,
      }),
      innerZone: React.PropTypes.number,
      scrollPosition: React.PropTypes.number,
      scrollDirection: React.PropTypes.string,
    }),
  }

  constructor(props) {
    super(props);

    this.state = {
      stuck: false,
      init: true,
    };

    this.data = {
      behavior: false,
      fixedOffset: 0,
      elOffset: 0,
      scrollOffset: 0,
      lastScrollPosition: 0,
      elWidth: 'auto',
      parent: false,
    };

    if (props.testInitData) {
      this.data = { ...this.data, ...props.testInitData, parent: 'test parent' };
      this.state.init = false;
    }
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
    if (this.props.testInitData) this.handleScroll();
    else this.initialize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.testInitData) this.handleScroll();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  getScrollState = () => {
    const { topOffset, bottomOffset, testScrollState } = this.props;
    const { lastScrollPosition, parent } = this.data;
    const scrollPosition = window.pageYOffset;
    this.data.lastScrollPosition = scrollPosition;
    return testScrollState || {
      rect: this.sticky.getBoundingClientRect(),
      innerZone: window.innerHeight - topOffset - bottomOffset,
      scrollPosition,
      scrollDirection: lastScrollPosition > scrollPosition ? 'up' : 'down',
      parentRect: parent.getBoundingClientRect(),
    };
  }

  setBehaivor = ({ rect, innerZone, parentRect }) => {
    const { behavior } = this.data;
    const { topOffset } = this.props;

    let newBehavior;
    if (parentRect.bottom < topOffset + rect.height) {
      newBehavior = 'overflow';
    } else if (rect.height > innerZone && behavior !== 'slideStick') {
      newBehavior = 'slideStick';
    } else if (rect.height < innerZone) {
      if (rect.top < topOffset && behavior !== 'stickTop') newBehavior = 'lost';
      else newBehavior = 'stickTop';
    }

    if (newBehavior) this.data.behavior = newBehavior;
  }

  setSticked = ({ rect, scrollPosition, scrollDirection, innerZone }) => {
    const { behavior, elOffset, scrollOffset } = this.data;
    if (!behavior) return false;

    const { topOffset } = this.props;
    let { stuck } = this.state;
    const data = {};

    const stuckTopOffset = Math.max(0, (scrollPosition + topOffset) - scrollOffset);

    switch (scrollDirection) {

      case 'up':

        // handling behaviors on scroll up
        switch (behavior) {
          case 'lost':
          case 'overflow':
            stuck = false;
            break;

          case 'stickTop': {
            if (elOffset < stuckTopOffset) {
              stuck = false;
            } else {
              data.elOffset = stuckTopOffset;
              stuck = !!stuckTopOffset;
              data.fixedOffset = (scrollOffset + data.elOffset) - scrollPosition;
            }
            break;
          }

          case 'slideStick': {
            if (scrollPosition < (elOffset + scrollOffset) - topOffset) {
              data.elOffset = stuckTopOffset;
              data.fixedOffset = (scrollOffset + data.elOffset) - scrollPosition;
              stuck = !!stuckTopOffset;
            } else {
              data.fixedOffset = rect.top;
              stuck = false;
            }
            break;
          }

          default: return false;
        }
        break;

      case 'down':

        // handling behaviors on scroll down
        switch (behavior) {

          case 'lost': {
            data.elOffset = (scrollPosition + this.data.fixedOffset) - scrollOffset;
            stuck = true;
            break;
          }

          case 'overflow': {
            stuck = false;
            break;
          }

          case 'stickTop': {
            data.elOffset = stuckTopOffset;
            stuck = !!stuckTopOffset;
            data.fixedOffset = (scrollOffset + data.elOffset) - scrollPosition;
            break;
          }

          case 'slideStick': {
            const windowBottom = scrollPosition + innerZone;
            const stickyBottom = ((scrollOffset + elOffset) - topOffset) + rect.height;
            if (windowBottom > stickyBottom) {
              data.elOffset = scrollPosition - scrollOffset
                - (rect.height - innerZone - topOffset);
              data.fixedOffset = (scrollOffset + data.elOffset) - scrollPosition;
              stuck = true;
            } else {
              data.fixedOffset = rect.top;
              stuck = false;
            }
            break;
          }

          default: return false;
        }
        break;

      default: return false;
    }

    this.data = { ...this.data, ...data };
    this.setState({ stuck });
    return false;
  }

  handleScroll = () => {
    if (this.state.init) return false;
    const scrollState = this.getScrollState();
    this.setBehaivor(scrollState);
    this.setSticked(scrollState);
    return false;
  }

  initialize = () => {
    /* eslint-disable */
    const getElementInitialOffset = () => {
      let el = this.sticky;
      let offset = 0;
      do {
        if (!isNaN(el.offsetTop)) offset += el.offsetTop;
      } while (el = el.offsetParent);
      return offset;
    };
    /* eslint-enable */

    const initData = {
      scrollOffset: getElementInitialOffset(),
      elWidth: this.sticky.getBoundingClientRect().width,
    };

    setTimeout(() => {
      this.data = {
        ...this.data,
        ...initData,
        parent: this.sticky.offsetParent,
      };
      this.setState({ init: false });
    }, this.props.initTimeout);
  }

  render() {
    const { elOffset, fixedOffset, elWidth } = this.data;
    const { children } = this.props;
    const { stuck } = this.state;

    const offset = stuck ? fixedOffset : elOffset;
    const style = {
      ...(stuck ? STYLES.stuck : STYLES.default),
      transform: `translateY(${offset}px)`,
      width: elWidth,
    };

    return (
      <div style={style} ref={el => { this.sticky = el; }}>
        {children}
      </div>
    );
  }
}
