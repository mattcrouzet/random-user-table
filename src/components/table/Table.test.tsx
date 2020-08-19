import React from 'react';
import {render} from '@testing-library/react';
import {shallow} from 'enzyme';
import Table from './Table';
import Cell from '../cell/Cell';

describe('Table', () => {
  let columns: string[] = [];
  let data: any[] = [];
  let fn: () => Promise<any[]>;

  beforeEach(() => {
    columns = ['prop1', 'prop2'];
    data = [
      {prop1: '1', prop2: '2'},
      {prop1: '3', prop2: '4'},
      {prop1: '5', prop2: '6'}
    ];
    fn = jest.fn(() => Promise.resolve([]));
    jest.clearAllMocks();
  });

  it('should render empty table', async () => {
    const {getByText} = render(<Table columns={[]} data={[]} loadMoreData={fn}/>);
    expect(await getByText('Empty table')).toBeInTheDocument();
  });

  it('should render Table with 2 columns and 4 rows', async () => {
    const {findAllByRole} = render(<Table columns={columns} data={data} loadMoreData={fn}/>);
    expect((await findAllByRole('row')).length).toBe(4);
    expect((await findAllByRole('columnheader')).length).toBe(2);
    expect((await findAllByRole('cell')).length).toBe(6);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});