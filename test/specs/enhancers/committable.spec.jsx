import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import committable from '../../../src/enhancers/committable';

chai.should();

describe('committable', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  context('enhanced component', function context() {
    it('should lift propTypes from the base component', function test() {
      const StubComponent = () => null;

      StubComponent.propTypes = {
        name: null,
        value: null,
      };

      const EnhancedComponent = committable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept an onCommit prop', function test() {
      committable('input').propTypes.should.include.keys(['onCommit']);
    });

    it('should accept an onBlur prop', function test() {
      committable('input').propTypes.should.include.keys(['onBlur']);
    });

    it('should call onCommit when the base component loses focus', function test() {
      const EnhancedComponent = committable('input');

      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(
        <EnhancedComponent
          name="input"
          onCommit={handleCommit}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');
      const newValue = input.value = 'new';

      Simulate.blur(input);

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });

    it('should call onBlur when the base component loses focus', function test() {
      const EnhancedComponent = committable('input');

      let handlerCalled = false;

      const handleBlur = () => {
        handlerCalled = true;
      };

      render(
        <EnhancedComponent
          name="input"
          onBlur={handleBlur}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');

      Simulate.blur(input);

      handlerCalled.should.equal(true);
    });

    it('should call onCommit when enter is pressed in the base component', function test() {
      const EnhancedComponent = committable('input');

      let committedPath = null;
      let committedValue = null;

      const handleCommit = (path, value) => {
        committedPath = path;
        committedValue = value;
      };

      render(
        <EnhancedComponent
          name="input"
          onCommit={handleCommit}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');
      const newValue = input.value = 'new';

      Simulate.keyPress(input, { key: 'Enter' });

      committedPath.should.deep.equal(['input']);
      committedValue.should.equal(newValue);
    });

    it('should call not call onCommit when other keys are pressed in the base component', function test() {
      const EnhancedComponent = committable('input');

      let handlerCalled = false;

      const handleCommit = () => {
        handlerCalled = true;
      };

      render(
        <EnhancedComponent
          name="input"
          onCommit={handleCommit}
          defaultValue="hello"
        />, this.container);

      const input = this.container.querySelector('input');

      Simulate.keyPress(input, { key: 'a' });

      handlerCalled.should.equal(false);
    });
  });
});
