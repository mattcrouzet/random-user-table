import './Table.css';

import React, {useEffect, useMemo, useRef, useState} from 'react';

import {
  compareFn,
  getNewWidths,
  getScrollableParent,
  insertDataIntoSortedArray,
  shouldLoadMoreData
} from '../../utils/Utils';
import Cell from '../cell/Cell';
import ColumnHeader from '../column-header/ColumnHeader';

/**
 * Properties for Table component
 */
export interface TableProps {
  /** List of columns to display */
  columns: string[];
  /** List of data to display */
  data: any[];
  /** Method that should be called when table requires more data */
  loadMoreData: () => Promise<any[]>
}

/**
 * Table
 * @param props Table props
 */
const Table: React.FC<TableProps> = ({
  columns,
  data,
  loadMoreData
} = {
  columns: [],
  data: [],
  loadMoreData: () => Promise.resolve([])
}) => {
  const elementRef = useRef<HTMLTableElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [active, setActive] = useState<number>(0);
  const [lastLoad, setLastLoad] = useState<number>(new Date().getTime());
  const [widths, setWidths] = useState<number[]>(new Array((columns || []).length).fill(250));
  const [step, setStep] = useState<'didMount' | 'didUnMount' | undefined>(undefined);
  const [listener, setListener] = useState<EventListenerOrEventListenerObject | null>(null);
  const [dataToInsert, setDataToInsert] = useState<any[]>([]);
  const [sortedData, setSortedData] = useState<any[]>([]);

  const loadingRows = useMemo(() => isLoading ? new Array(50).fill(0) : [], [isLoading]);
  const notEmpty = useMemo(() => (columns.length > 0 && data.length > 0), [columns.length, data.length]);

  useEffect(() => {
    if (dataToInsert.length) {
      setSortedData(insertDataIntoSortedArray(sortedData, dataToInsert, columns[active]));
    }
  }, [dataToInsert]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (sortedData.length) {
      setSortedData([...sortedData.sort(compareFn(columns[active]))]);
    }
  }, [columns, active]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (data.length) {
      setSortedData([...data.sort(compareFn(columns[active]))]);
    }
  }, [data]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setStep(step ? 'didUnMount' : 'didMount'), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const container = getScrollableParent(elementRef.current);
    const target = container && container !== document.firstElementChild ? container : document;
    if (step === 'didMount') {
      if (!listener) {
        const fn: EventListenerOrEventListenerObject = async () => {
          if (shouldLoadMoreData(container, elementRef.current, lastLoad)) {
            setIsLoading(true);
            setLastLoad(new Date().getTime());
            setDataToInsert(await loadMoreData());
            setIsLoading(false);
          }
        };
        target.addEventListener('scroll', fn);
        setListener(fn);
      }
    } else if (listener) {
      target.removeEventListener('scroll', listener);
    }
  }, [step, elementRef]);  // eslint-disable-line react-hooks/exhaustive-deps

  return notEmpty
    ? (
      <div role="table" className='table' ref={elementRef}>
        <div role="rowgroup" className='table-header'>
          <div role="row" className='table-row-header row'>
            {columns.map((label, i) => 
              <ColumnHeader
                key={i} 
                isActive={i === active} 
                width={widths[i]} 
                setActive={() => setActive(i)}
                onResize={(newWidth) => setWidths(getNewWidths(widths, i, newWidth))}>
                {label}
              </ColumnHeader>
            )}
          </div>
        </div>
        <div role="rowgroup" className='table-body'>
          {sortedData.concat(loadingRows).map((rowData, i) => 
            <div role="row" key={i} className='table-row row'>
              {columns.map((column, j) => 
                <Cell
                  key={j} 
                  isOnLoadingRow={i > sortedData.length - 1}
                  width={widths[j]}
                  onResize={(newWidth) => setWidths(getNewWidths(widths, j, newWidth))}>
                  {rowData[column]}
                </Cell>
              )}
            </div>
          )}
        </div>
      </div>
    )
    : (
      <p>Empty table</p>
    )
  ;
};

export default Table;
