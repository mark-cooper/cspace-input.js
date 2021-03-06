import React from 'react';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import nestable from '../../../src/enhancers/nestable';

chai.should();

describe('nestable', function suite() {
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

      const EnhancedComponent = nestable(StubComponent);

      EnhancedComponent.propTypes.should.include.keys(Object.keys(StubComponent.propTypes));
    });

    it('should accept a subpath prop', function test() {
      nestable('input').propTypes.should.include.keys(['subpath']);
    });

    it('should not pass the subpath prop to the base component', function test() {
      let propsReceived = null;

      const StubComponent = (props) => {
        propsReceived = props;

        return null;
      };

      const EnhancedComponent = nestable(StubComponent);

      render(<EnhancedComponent name="n" subpath="p" foo="f" />, this.container);

      propsReceived.should.not.include.keys('subpath');
    });
  });
});
