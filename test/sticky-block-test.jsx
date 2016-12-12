import React from 'react';
import test from 'tape';
import { shallow } from 'enzyme';

import './setup';

import StickyBlock from '../src';
import emulateScroll from './emulate-scroll';

const defaultData = {
  elOffset: 0,
  fixedOffset: 0,
  stuck: false,
};

test('StickyBlock: stickTop behavoir', t => {
  const expect = {
    behavior: 'stickTop',
    stuck: x => (x > 50),
    fixedOffset: 50,
    elOffset: 0,
  };

  let calculatedData = { ...defaultData };

  const scrollHeight = 200;
  const blockHeight = 100;

  const smallBlockScroll = emulateScroll(scrollHeight)(blockHeight);

  const wrapper = shallow(
    <StickyBlock {...smallBlockScroll(0)(calculatedData)} />,
  );

  const testScrollIteration = i => {
    t.test(`-- Scroll iteration ${i}`, s => {
      const scrollProps = smallBlockScroll(i / 10)(calculatedData);
      const scrolledWrapper = wrapper.setProps({ ...scrollProps }).setProps({ ...scrollProps });
      const scroll = scrollProps.testScrollState.scrollPosition;
      const { stuck } = scrolledWrapper.instance().state;
      const { elOffset, fixedOffset, behavior } = scrolledWrapper.instance().data;
      calculatedData = { elOffset, fixedOffset, stuck };

      s.test(`---- behavior ${expect.behavior}`, b => {
        b.plan(1);
        b.equal(behavior, expect.behavior);
      });

      s.test(`---- stuck ${expect.stuck(scroll) ? 'true' : 'false'}`, st => {
        st.plan(1);
        st.equal(stuck, expect.stuck(scroll), `${behavior} ${scrolledWrapper.instance().data}`);
      });

      if (stuck) {
        s.test(`---- fixed offset ${expect.fixedOffset}`, f => {
          f.plan(1);
          f.equal(Math.round(fixedOffset), expect.fixedOffset);
        });
      } else {
        s.test(`---- element offset ${expect.elOffset}`, e => {
          e.plan(1);
          e.equal(Math.round(elOffset), expect.elOffset);
        });
      }
    });
  };

  for (let i = 0; i <= 10; i++) {
    testScrollIteration(i);
  }
});
