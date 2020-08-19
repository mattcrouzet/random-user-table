import React from 'react';
import {render} from '@testing-library/react';
import Cell from './Cell';
import {shallow} from 'enzyme';
import {ResizableBox} from 'react-resizable';

jest.mock('../loader/Loader', () => () => (<div>Loader</div>));

describe('Cell', () => {
  let columns: string[] = [];
  let data: any[] = [];
  let fn: () => void;

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
    const {getByText} = render(<Cell width={100} isOnLoadingRow={false} onResize={fn}>Content</Cell>);
    expect(await getByText('Content')).toBeInTheDocument();
  });

  it('should render a loader', async () => {
    const {getByText} = render(<Cell width={100} isOnLoadingRow={true} onResize={fn}>Content</Cell>);
    expect(await getByText('Loader')).toBeInTheDocument();
  });

  it('should call onResize', async () => {
    const children = <span>Content</span>
    const header = shallow(<Cell width={50} isOnLoadingRow={true} onResize={fn}>Content</Cell>);
    header.find(ResizableBox).simulate('resize', {persist: jest.fn()}, {node: children, size: {width: 30, height: 30}, handle: 'w'})

    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveBeenCalledWith(30);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});