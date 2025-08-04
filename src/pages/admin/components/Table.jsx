const Table = ({
  columns,
  data,
  emptyMessage = "No data available",
  loading = false,
}) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="overflow-x-auto max-w-full">
      <table className="w-full min-w-[640px]">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-3 sm:py-2 ${
                  column.hideOnMobile ? "hidden sm:table-cell" : ""
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex} className="animate-pulse">
              {columns.map((_, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 sm:px-3 sm:py-2 whitespace-nowrap ${
                    columns[colIndex].hideOnMobile ? "hidden sm:table-cell" : ""
                  }`}
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Show loading skeleton while data is being fetched
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show empty message if no data
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
          <p className="text-gray-400 text-sm mt-1">
            Add your first item to get started
          </p>
        </div>
      </div>
    );
  }

  // Render actual table with data
  return (
    <div className="overflow-x-auto max-w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.hideOnMobile ? "hidden sm:table-cell" : ""
                } sm:px-3`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-2 ${
                    column.hideOnMobile ? "hidden sm:table-cell" : ""
                  } sm:px-3 ${
                    column.key === "photo"
                      ? ""
                      : "whitespace-nowrap overflow-hidden text-ellipsis"
                  } text-sm text-gray-900`}
                >
                  {column.render ? (
                    column.render(item)
                  ) : column.key === "photo" ? (
                    <img
                      src={item[column.key]}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    item[column.key] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
