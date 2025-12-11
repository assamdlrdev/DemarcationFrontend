import React from 'react';
import './style.scss';

interface Column {
  header: string;
  accessor?: string;
  render?: (row: any, index: number) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  className?: string;
  title?: string;
}

const Table: React.FC<TableProps> = ({ 
  columns, 
  data, 
  emptyMessage = 'No data available',
  className = '',
  title
}) => {
  return (
    <div className={`custom-table-container ${className}`}>
      {title && (
        <div className="custom-table-title">
          {title}
        </div>
      )}
      <table className="custom-table">
        <thead className="custom-table-head">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="custom-table-header-cell">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="custom-table-body">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="custom-table-row">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="custom-table-cell">
                    {column.render
                      ? column.render(row, rowIndex)
                      : column.accessor
                      ? row[column.accessor]
                      : ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="custom-table-cell empty-table-cell"
              >
                <div className="error-message"></div>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

