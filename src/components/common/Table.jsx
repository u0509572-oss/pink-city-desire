import React from "react";

const Table = ({
  columns,
  dataSource,
  className = "",
  tableClassName = "",
  headClassName = "",
  rowClassName = "",
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className={`min-w-full text-sm border-separate border-spacing-y-1 ${tableClassName}`}
      >
        {/* header */}
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.dataIndex}
                style={{ width: col.width }}
                className={`bg-[var(--primary-color)] text-white px-4 py-3 text-center whitespace-nowrap text-sm md:text-base lg:text-lg font-medium} ${headClassName}`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        {/* body */}
        <tbody>
          {dataSource.map((row, rowIndex) => (
            <tr
              key={row.key || rowIndex}
              className={"bg-[var(--white-color)]/10"}
            >
              {columns.map((col) => {
                const cellContent = col.render
                  ? col.render(row[col.dataIndex], row, rowIndex)
                  : row[col.dataIndex];

                return (
                  <td
                    key={col.key || col.dataIndex}
                    style={{ width: col.width }}
                    className={`px-4 py-2 whitespace-nowrap text-sm md:text-base lg:text-lg text-center font-medium ${rowClassName}`}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
