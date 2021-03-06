/* global document */

import React from 'react';
import { Simulate } from 'react-addons-test-utils';
import { render } from 'react-dom';

import createTestContainer from '../../helpers/createTestContainer';

import isInput from '../../../src/helpers/isInput';
import DropdownMenuInput from '../../../src/components/DropdownMenuInput';

const expect = chai.expect;

chai.should();

const expectedClassName = 'cspace-input-DropdownInput--common cspace-input-DropdownMenuInput--common cspace-input-Input--common';

describe('DropdownMenuInput', function suite() {
  beforeEach(function before() {
    this.container = createTestContainer(this);
  });

  it('should be considered an input by isInput()', function test() {
    isInput(<DropdownMenuInput />).should.equal(true);
  });

  it('should render as a DropdownInput', function test() {
    render(<DropdownMenuInput />, this.container);

    this.container.firstElementChild.should
      .equal(this.container.querySelector('div.cspace-input-DropdownInput--common'));
  });

  it('should render with correct class', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(<DropdownMenuInput options={options} />, this.container);

    this.container.firstElementChild.className.should.equal(expectedClassName);
  });

  it('should focus the menu when focusMenu is called', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    const component = render(<DropdownMenuInput options={options} />, this.container);
    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const ul = this.container.querySelector('ul');

    ul.should.not.equal(document.activeElement);

    component.focusMenu();

    ul.should.equal(document.activeElement);
  });

  it('should do nothing if focusMenu is called when the menu is not open', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    const component = render(<DropdownMenuInput options={options} />, this.container);

    component.focusMenu();

    this.container.contains(document.activeElement).should.equal(false);
  });

  it('should show the selected option\'s label in the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 2');
  });

  it('should update the input when a new value is passed via props', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 2');

    render(
      <DropdownMenuInput
        options={options}
        value="value1"
      />, this.container);

    input.value.should.equal('Value 1');
  });

  it('should allow an empty label', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: '' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('');
  });

  it('should display the valueLabel prop in the input when no option has the value', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value99"
        valueLabel="Value 99"
        blankable={false}
      />, this.container);

    const input = this.container.querySelector('input');

    input.value.should.equal('Value 99');
  });

  it('should prefer the valueLabel prop if it is supplied, but differs from the label of the option that has the value', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
        valueLabel="Some other label"
        blankable={false}
      />, this.container);

    this.container.querySelector('input').value.should.equal('Some other label');

    render(
      <DropdownMenuInput
        options={options}
        value="value3"
        valueLabel="Another differing label"
        blankable={false}
      />, this.container);

    this.container.querySelector('input').value.should.equal('Another differing label');
  });

  it('should open the popup on mouse down on the the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('li').should.not.equal(null);
  });

  it('should open the popup when the down arrow is depressed', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    this.container.querySelector('li').should.not.equal(null);
  });

  it('should call onOpen when the popup is opened', function test() {
    let handlerCalled = false;

    const handleOpen = () => {
      handlerCalled = true;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
        onOpen={handleOpen}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.focus(input);
    Simulate.keyDown(input, { key: 'ArrowDown' });

    handlerCalled.should.equal(true);
  });

  it('should close the popup when escape is depressed in the input', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('li').should.not.equal(null);

    Simulate.keyDown(input, { key: 'Escape' });

    expect(this.container.querySelector('li')).to.equal(null);
  });

  it('should close the popup when escape is depressed in the popup', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const popup = this.container.querySelector('.cspace-input-Popup--common');

    popup.should.not.equal(null);

    Simulate.focus(popup);
    Simulate.keyDown(popup, { key: 'Escape' });

    expect(this.container.querySelector('li')).to.equal(null);
  });

  it('should close the popup when a menu item is selected', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
      { value: 'value4', label: 'Value 4' },
      { value: 'value5', label: 'Value 5' },
      { value: 'value6', label: 'Value 6' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(3));

    expect(this.container.querySelector('li')).to.equal(null);
  });

  it('should call onClose when the popup is closed', function test() {
    let handlerCalled = false;

    const handleClose = () => {
      handlerCalled = true;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
        onClose={handleClose}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const popup = this.container.querySelector('.cspace-input-Popup--common');

    popup.should.not.equal(null);

    Simulate.focus(popup);
    Simulate.keyDown(popup, { key: 'Escape' });

    handlerCalled.should.equal(true);
  });

  it('should update the input value when a menu item is selected', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        value="value2"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(2));

    input.value.should.equal('Value 3');
  });

  it('should call onCommit when a menu item is selected', function test() {
    let committedPath = null;
    let committedValue = null;

    const handleCommit = (path, value) => {
      committedPath = path;
      committedValue = value;
    };

    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        name="color"
        options={options}
        value="value2"
        onCommit={handleCommit}
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    const items = this.container.querySelectorAll('li');

    Simulate.click(items.item(2));

    committedPath.should.deep.equal(['color']);
    committedValue.should.equal('value3');
  });

  it('should render a header if content is supplied', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        menuHeader="header content"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('header').textContent.should.equal('header content');
  });

  it('should render a footer if content is supplied', function test() {
    const options = [
      { value: 'value1', label: 'Value 1' },
      { value: 'value2', label: 'Value 2' },
      { value: 'value3', label: 'Value 3' },
    ];

    render(
      <DropdownMenuInput
        options={options}
        menuFooter="footer content"
      />, this.container);

    const input = this.container.querySelector('input');

    Simulate.mouseDown(input);

    this.container.querySelector('footer').textContent.should.equal('footer content');
  });
});
