import './setup';

import { shallow } from 'enzyme';

import React from 'react';
import ReactDOM from 'react-dom'

import StickyBlock from '../src';

import test from 'tape';

import { emulateScroll } from './emulate-scroll';


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

  let calculatedData = {...defaultData};

  const scrollHeight = 200;
  const blockHeight = 100;

  const smallBlockScroll = emulateScroll(scrollHeight)(blockHeight);

  const wrapper = shallow(
    <StickyBlock {...smallBlockScroll(0)(calculatedData)} />
  );

  for (let i = 0; i <= 10; i++) {
    

    t.test('-- Scroll iteration '+i, t => {
      const scrollProps = smallBlockScroll(i/10)(calculatedData);
      const scrolledWrapper = wrapper.setProps({ ...scrollProps }).setProps({ ...scrollProps });
      const scroll = scrollProps.testScrollState.scrollPosition;
      const { stuck } = scrolledWrapper.instance().state;
      const { elOffset, fixedOffset, behavior } = scrolledWrapper.instance().data;
      calculatedData = { elOffset, fixedOffset, stuck };
      
      t.test('---- behavior '+expect.behavior, t => {
        t.plan(1);
        t.equal(behavior, expect.behavior);
      });

      t.test(`---- stuck ${expect.stuck(scroll) ? 'true' : 'false'}`, t => {
        t.plan(1);
        t.equal(stuck, expect.stuck(scroll), `${behavior} ${scrolledWrapper.instance().data}`);
      });

      if (stuck) {
        t.test('---- fixed offset '+expect.fixedOffset, t => {
          t.plan(1);
          t.equal(Math.round(fixedOffset), expect.fixedOffset);
        });scrollProps
      } else {
        t.test('---- element offset '+expect.elOffset, t => {
          t.plan(1);
          t.equal(Math.round(elOffset), expect.elOffset);
        });
      }
    })
  };
});