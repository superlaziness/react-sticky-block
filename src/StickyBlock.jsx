import React, { PureComponent, PropTypes } from 'react';

const STYLES = {
  default: {position: 'static'},
  sticked: {
    position: 'fixed',
    top: 0,
  }
}

export default class StickyBlock extends PureComponent {
  static propTypes = {
    headerOffset: PropTypes.number,
    footerOffset: PropTypes.number,
    initTimeout: PropTypes.number,
  }

  constructor(props) {
    super(props);

    this.state = {
      sticked: false,
      init: true,
    };

    this.data = {
      behavior: false,
      fixedOffset: 0,
      elOffset: 0,
      scrollOffset: 0,
      lastScrollPosition: 0,
      elWidth: 'auto',
    };
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
    this.initialize();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  initialize = () => {
    const getElementInitialOffset = () => {
      let el = this.sticky;
      let offset = 0;
      do {
        if (!isNaN(el.offsetTop)) offset += el.offsetTop;
      } while(el = el.offsetParent);
      return offset;
    };
    setTimeout(() => {
      this.data = {
        ...this.data,
        scrollOffset: getElementInitialOffset(),
        elWidth: this.sticky.getBoundingClientRect().width,
        parent: this.sticky.offsetParent,
      };
      this.setState({init: false});
    }, this.props.initTimeout);
  }

  handleScroll = () => {
    if (this.state.init) return false;
    const scrollState = this.getScrollState();
    this.setBehaivor(scrollState);
    this.setSticked(scrollState);
  }

  getScrollState = () => {
    const { headerOffset, footerOffset } = this.props;
    const { lastScrollPosition, parent } = this.data;
    const scrollPosition = window.pageYOffset;
    this.data.lastScrollPosition = scrollPosition;
    return {
      rect: this.sticky.getBoundingClientRect(),
      innerZone: window.innerHeight - headerOffset - footerOffset,
      scrollPosition,
      scrollDirection: lastScrollPosition > scrollPosition ? 'up' : 'down',
      parentRect: parent.getBoundingClientRect(),
    }
  }

  setBehaivor = ({ rect, innerZone, scrollPosition, parentRect }) => {
    const { behavior, elOffset, scrollOffset } = this.data;
    const { headerOffset } = this.props;

    let newBehavior;
    if (parentRect.bottom < headerOffset + rect.height) {
      newBehavior = 'overflow';
    } else if (rect.height > innerZone && behavior !== 'slideStick') {
      newBehavior = 'slideStick';
    } else if (rect.height < innerZone) {
      if (rect.top < headerOffset && behavior !== 'stickTop') newBehavior = 'lost';
      else newBehavior = 'stickTop';
    };

    if (newBehavior) this.data.behavior = newBehavior;
  }

  setSticked = ({ rect, scrollPosition, scrollDirection, innerZone }) => {
    const { behavior, elOffset, scrollOffset } = this.data;
    if (!behavior) return false;

    const { headerOffset } = this.props;
    let { sticked } = this.state;
    const data = {};

    const stickedTopOffset = Math.max(0, scrollPosition + headerOffset - scrollOffset);

    switch(scrollDirection) {

      case 'up':

        //handling behaviors on scroll up
        switch(behavior) {
          case 'lost':
          case 'overflow':
            sticked = false;
            break;

          case 'stickTop':
            if (elOffset < stickedTopOffset) {
              sticked = false;
            } else {
              data.elOffset = stickedTopOffset;
              sticked = !!stickedTopOffset;
              data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
            }
            break;

          case 'slideStick':
            if (scrollPosition < elOffset + scrollOffset - headerOffset) {
              data.elOffset = stickedTopOffset;
              data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
              sticked = !!stickedTopOffset;
            } else {
              data.fixedOffset = rect.top;
              sticked = false;
            };
            break;
        };
        break;

      case 'down':

        //handling behaviors on scroll down
        switch(behavior) {
          case 'lost':
            data.elOffset = scrollPosition + this.data.fixedOffset - scrollOffset;
            sticked = true;
            break;

          case 'overflow':
            sticked = false;
            break;

          case 'stickTop':
            data.elOffset = stickedTopOffset;
            sticked = !!stickedTopOffset;
            data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
            break;

          case 'slideStick':
            const windowBottom = scrollPosition + innerZone;
            const stickyBottom = scrollOffset + elOffset - headerOffset + rect.height;
            if (windowBottom > stickyBottom) {
              data.elOffset = scrollPosition - scrollOffset - (rect.height - innerZone - headerOffset);
              data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
              sticked = true;
            } else {
              data.fixedOffset = rect.top;
              sticked = false;
            };
        };
        break;
    };

    this.data = {...this.data, ...data};
    this.setState({ sticked });
  }

  render() {
    const { elOffset, fixedOffset, elWidth } = this.data;
    const { children } = this.props;
    const { sticked } = this.state;

    const offset = sticked ? fixedOffset : elOffset;
    const style = {
      ...(sticked ? STYLES.sticked : STYLES.default),
      transform: `translateY(${offset}px)`,
      width: elWidth,
    };

    return (
      <div style={style} className={className} ref={el => {this.sticky = el}}>
        {children}
      </div>
    )
  }
}