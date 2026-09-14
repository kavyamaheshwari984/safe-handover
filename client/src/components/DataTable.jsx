import React from 'react';

const DataTable = ({ columns, data, keyField = 'id', emptyMessage = 'No records found' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="data-table-wrapper" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row[keyField] || rowIdx}>
              {columns.map((col, colIdx) => (
                <td key={colIdx}>
                  {col.cell ? col.cell(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
