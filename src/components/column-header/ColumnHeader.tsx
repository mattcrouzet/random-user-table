import React, { useMemo } from 'react';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';

/**
 * Properties for ColumnHeader component
 */
export interface ColumnHeaderProps {
  /** True if it is the header of the sorted column */
  isActive: boolean;

  /** Column width */
  width: number;

  /** Method to change the active column */
  setActive: () => void

  /** Method to change the column width */
  onResize: (newWidth: number) => void
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  isActive,
  width,
  children,
  setActive,
  onResize
} = {
  isActive: false,
  width: 250,
  setActive: () => {},
  onResize: (_: number) => {}
}) => {
  const classes = useMemo(() => 'table-header-cell cell' + (isActive ? ' active' : ''), [isActive]);
  const ariaSort = useMemo(() => isActive ? 'ascending' : 'none', [isActive]);

  return (
    <div role="columnheader" aria-sort={ariaSort} className={classes} onDoubleClick={setActive}>
      <ResizableBox axis='x' width={width} height={30} onResize={(_: any, {size}: ResizeCallbackData) => onResize(size.width)}>
        <span>{children}</span>
      </ResizableBox>
    </div>
  );
}

export default ColumnHeader;