'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STYLES = {
  default: { position: 'static' },
  stuck: {
    position: 'fixed',
    top: 0
  }
};

var StickyBlock = function (_PureComponent) {
  _inherits(StickyBlock, _PureComponent);

  function StickyBlock(props) {
    _classCallCheck(this, StickyBlock);

    var _this = _possibleConstructorReturn(this, (StickyBlock.__proto__ || Object.getPrototypeOf(StickyBlock)).call(this, props));

    _this.getScrollState = function () {
      var _this$props = _this.props,
          topOffset = _this$props.topOffset,
          bottomOffset = _this$props.bottomOffset,
          testScrollState = _this$props.testScrollState;
      var _this$data = _this.data,
          lastScrollPosition = _this$data.lastScrollPosition,
          parent = _this$data.parent;

      var scrollPosition = window.pageYOffset;
      _this.data.lastScrollPosition = scrollPosition;
      return testScrollState || {
        rect: _this.sticky.getBoundingClientRect(),
        innerZone: window.innerHeight - topOffset - bottomOffset,
        scrollPosition: scrollPosition,
        scrollDirection: lastScrollPosition > scrollPosition ? 'up' : 'down',
        parentRect: parent.getBoundingClientRect()
      };
    };

    _this.setBehaivor = function (_ref) {
      var rect = _ref.rect,
          innerZone = _ref.innerZone,
          parentRect = _ref.parentRect;
      var behavior = _this.data.behavior;
      var _this$props2 = _this.props,
          topOffset = _this$props2.topOffset,
          _this$props2$bottomOf = _this$props2.bottomOffset,
          bottomOffset = _this$props2$bottomOf === undefined ? 0 : _this$props2$bottomOf;


      var newBehavior = void 0;
      if (behavior === 'slideStick' && parentRect.bottom < window.innerHeight - bottomOffset) newBehavior = 'overflow';
      if (behavior !== 'slideStick' && parentRect.bottom < topOffset + rect.height) {
        newBehavior = 'overflow';
      } else if (rect.height > innerZone && behavior !== 'slideStick') {
        newBehavior = 'slideStick';
      } else if (rect.height < innerZone) {
        if (rect.top < topOffset && behavior !== 'stickTop') newBehavior = 'lost';else newBehavior = 'stickTop';
      }

      if (newBehavior) _this.data.behavior = newBehavior;
    };

    _this.setSticked = function (_ref2) {
      var rect = _ref2.rect,
          scrollPosition = _ref2.scrollPosition,
          scrollDirection = _ref2.scrollDirection,
          innerZone = _ref2.innerZone;
      var _this$data2 = _this.data,
          behavior = _this$data2.behavior,
          elOffset = _this$data2.elOffset,
          scrollOffset = _this$data2.scrollOffset;

      if (!behavior) return false;

      var topOffset = _this.props.topOffset;
      var stuck = _this.state.stuck;

      var data = {};

      var stuckTopOffset = Math.max(0, scrollPosition + topOffset - scrollOffset);

      switch (scrollDirection) {

        case 'up':

          // handling behaviors on scroll up
          switch (behavior) {
            case 'lost':
            case 'overflow':
              stuck = false;
              break;

            case 'stickTop':
              {
                if (elOffset < stuckTopOffset) {
                  stuck = false;
                } else {
                  data.elOffset = stuckTopOffset;
                  stuck = !!stuckTopOffset;
                  data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
                }
                break;
              }

            case 'slideStick':
              {
                if (scrollPosition < elOffset + scrollOffset - topOffset) {
                  data.elOffset = stuckTopOffset;
                  data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
                  stuck = !!stuckTopOffset;
                } else {
                  data.fixedOffset = rect.top;
                  stuck = false;
                }
                break;
              }

            default:
              return false;
          }
          break;

        case 'down':

          // handling behaviors on scroll down
          switch (behavior) {

            case 'lost':
              {
                data.elOffset = scrollPosition + _this.data.fixedOffset - scrollOffset;
                stuck = true;
                break;
              }

            case 'overflow':
              {
                stuck = false;
                break;
              }

            case 'stickTop':
              {
                data.elOffset = stuckTopOffset;
                stuck = !!stuckTopOffset;
                data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
                break;
              }

            case 'slideStick':
              {
                var windowBottom = scrollPosition + innerZone;
                var stickyBottom = scrollOffset + elOffset - topOffset + rect.height;
                if (windowBottom > stickyBottom) {
                  data.elOffset = scrollPosition - scrollOffset - (rect.height - innerZone - topOffset);
                  data.fixedOffset = scrollOffset + data.elOffset - scrollPosition;
                  stuck = true;
                } else {
                  data.fixedOffset = rect.top;
                  stuck = false;
                }
                break;
              }

            default:
              return false;
          }
          break;

        default:
          return false;
      }

      _this.data = _extends({}, _this.data, data);
      _this.setState({ stuck: stuck });
      return false;
    };

    _this.handleScroll = function () {
      if (_this.state.init) return false;
      var scrollState = _this.getScrollState();
      requestAnimationFrame(function () {
        _this.setBehaivor(scrollState);
        _this.setSticked(scrollState);
      });
      return false;
    };

    _this.initialize = function () {
      /* eslint-disable */
      var getElementInitialOffset = function getElementInitialOffset() {
        var el = _this.sticky;
        var offset = 0;
        do {
          if (!isNaN(el.offsetTop)) offset += el.offsetTop;
        } while (el = el.offsetParent);
        return offset;
      };
      /* eslint-enable */

      var initData = {
        scrollOffset: getElementInitialOffset(),
        elWidth: _this.sticky.getBoundingClientRect().width
      };

      setTimeout(function () {
        _this.data = _extends({}, _this.data, initData, {
          parent: _this.sticky.offsetParent
        });
        _this.setState({ init: false });
      }, _this.props.initTimeout);
    };

    _this.state = {
      stuck: false,
      init: true
    };

    _this.data = {
      behavior: false,
      fixedOffset: 0,
      elOffset: 0,
      scrollOffset: 0,
      lastScrollPosition: 0,
      elWidth: 'auto',
      parent: false
    };

    if (props.testInitData) {
      _this.data = _extends({}, _this.data, props.testInitData, { parent: 'test parent' });
      _this.state.init = false;
    }
    return _this;
  }

  _createClass(StickyBlock, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('scroll', this.handleScroll);
      if (this.props.testInitData) this.handleScroll();else this.initialize();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.testInitData) this.handleScroll();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _data = this.data,
          elOffset = _data.elOffset,
          fixedOffset = _data.fixedOffset,
          elWidth = _data.elWidth;
      var children = this.props.children;
      var stuck = this.state.stuck;


      var offset = stuck ? fixedOffset : elOffset;
      var style = _extends({}, stuck ? STYLES.stuck : STYLES.default, {
        transform: 'translateY(' + offset + 'px)',
        width: elWidth
      });

      var stuckStyle = _extends({}, STYLES.stuck, {
        opacity: stuck ? 1 : 0,
        transform: 'translate3d(0, ' + fixedOffset + 'px, 0)',
        width: elWidth
      });

      var defStyle = _extends({}, STYLES.default, {
        transform: 'translate3d(0, ' + elOffset + 'px, 0)',
        opacity: stuck ? 0 : 1
      });

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { style: defStyle, ref: function ref(el) {
              _this2.sticky = el;
            } },
          children
        ),
        _react2.default.createElement(
          'div',
          { style: stuckStyle },
          children
        )
      );
    }
  }]);

  return StickyBlock;
}(_react.PureComponent);

StickyBlock.defaultProps = {
  topOffset: 0,
  bottomOffset: 0
};
exports.default = StickyBlock;
process.env.NODE_ENV !== "production" ? StickyBlock.propTypes = {
  topOffset: _react.PropTypes.number,
  bottomOffset: _react.PropTypes.number,
  initTimeout: _react.PropTypes.number,
  children: _react.PropTypes.oneOfType([_react.PropTypes.element.isRequired, _react.PropTypes.array.isRequired]),

  // props only for testing
  testInitData: _react2.default.PropTypes.shape({
    scrollOffset: _react2.default.PropTypes.number,
    elWidth: _react2.default.PropTypes.number
  }),
  testScrollState: _react2.default.PropTypes.shape({
    rect: _react2.default.PropTypes.shape({
      height: _react2.default.PropTypes.number,
      top: _react2.default.PropTypes.number
    }),
    parentRect: _react2.default.PropTypes.shape({
      bottom: _react2.default.PropTypes.number
    }),
    innerZone: _react2.default.PropTypes.number,
    scrollPosition: _react2.default.PropTypes.number,
    scrollDirection: _react2.default.PropTypes.string
  })
} : void 0;