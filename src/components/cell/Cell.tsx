import React from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import Loader from '../loader/Loader';

/**
 * Properties for Cell component
 */
export interface CellProps {
  /** Column width */
  width: number;

  /** True if the cell should display the loader */
  isOnLoadingRow: boolean

  /** Method to change the column width */
  onResize: (newWidth: number) => void
}

const Cell: React.FC<CellProps> = ({
  width,
  children,
  isOnLoadingRow,
  onResize
} = {
  width: 250,
  isOnLoadingRow: false,
  onResize: (_: number) => {}
}) => {
  return (
    <div role="cell" className='table-cell cell'>
      <ResizableBox axis='x' width={width} height={30} onResize={(_: any, {size}: ResizeCallbackData) => onResize(size.width)}>
        {isOnLoadingRow
          ? <Loader />
          : <span>{children}</span>
        }
      </ResizableBox>
    </div>
  );
}

export default Cell;