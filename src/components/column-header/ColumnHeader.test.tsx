import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import ColumnHeader from './ColumnHeader';
import {shallow} from 'enzyme';
import {ResizableBox} from 'react-resizable';

let columns: string[] = [];
let data: any[] = [];
let fn: () => void;

describe('ColumnHeader', () => {
  beforeEach(() => {
    columns = ['prop1', 'prop2'];
    data = [
      {prop1: '1', prop2: '2'},
      {prop1: '3', prop2: '4'},
      {prop1: '5', prop2: '6'}
    ];
    fn = jest.fn();
    jest.clearAllMocks();
  });

  it('should render content', async () => {
    const {getByText} = render(<ColumnHeader width={100} isActive={false} setActive={fn} onResize={fn}>Content</ColumnHeader>);
    expect(await getByText('Content')).toBeInTheDocument();
  });

  it('should have attribute aria-sort to none and not class active', async () => {
    const {getByRole} = render(<ColumnHeader width={100} isActive={false} setActive={fn} onResize={fn}>Content</ColumnHeader>);
    const header = await getByRole('columnheader');
    expect(header).toHaveAttribute('aria-sort', 'none');
    expect(header).toHaveAttribute('class', expect.not.stringContaining('active'));
  });

  it('should have attribute aria-sort to ascending and the class active', async () => {
    const {getByRole} = render(<ColumnHeader width={100} isActive={true} setActive={fn} onResize={fn}>Content</ColumnHeader>);
    const header = await getByRole('columnheader');
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(header).toHaveAttribute('class', expect.stringContaining('active'));
  });

  it('should call setActive', async () => {
    const {getByRole} = render(<ColumnHeader width={100} isActive={true} setActive={fn} onResize={fn}>Content</ColumnHeader>);
    const header = await getByRole('columnheader');
    fireEvent.doubleClick(header);
    expect(fn).toHaveBeenCalled();
  });

  it('should call onResize', async () => {
    const children = <span>Content</span>
    const header = shallow(<ColumnHeader width={100} isActive={true} setActive={fn} onResize={fn}>{children}</ColumnHeader>);
    header.find(ResizableBox).simulate('resize', {persist: jest.fn()}, {node: children, size: {width: 30, height: 30}, handle: 'w'})

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(30);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});