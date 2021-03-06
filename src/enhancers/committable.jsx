import React, { Component, PropTypes } from 'react';
import { getPath } from '../helpers/pathHelpers';

/**
 * Returns an enhanced component that detects that a change to the value of the base component has
 * been committed, and executes a callback with the new value. A change is considered to be
 * committed when the base component loses focus, or the enter key is pressed while it has focus.
 * @param {string|function} BaseComponent - The component to enhance. This component must accept
 * onBlur and onKeyPress props.
 * @returns {function} The enhanced component, which accepts an onCommit prop containing a function
 * to be called with the path to the input, and its new value.
 */
export default function committable(BaseComponent) {
  const baseComponentName = BaseComponent.displayName
    || BaseComponent.name
    || 'Component';

  const propTypes = {
    ...BaseComponent.propTypes,
    onBlur: PropTypes.func,
    onCommit: PropTypes.func,
  };

  class Committable extends Component {
    constructor(props) {
      super(props);

      this.handleBlur = this.handleBlur.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleBlur(event) {
      const {
        onBlur,
      } = this.props;

      const value = event.target.value;

      if (onBlur) {
        onBlur(event);
      }

      this.commit(value);
    }

    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.commit(event.target.value);
      }
    }

    commit(value) {
      const {
        onCommit,
      } = this.props;

      if (onCommit) {
        onCommit(getPath(this.props), value);
      }
    }

    render() {
      const {
        onCommit, // eslint-disable-line no-unused-vars
        ...remainingProps
      } = this.props;

      return (
        <BaseComponent
          {...remainingProps}
          onBlur={this.handleBlur}
          onKeyPress={this.handleKeyPress}
        />
      );
    }
  }

  Committable.propTypes = propTypes;
  Committable.displayName = `committable(${baseComponentName})`;

  return Committable;
}
