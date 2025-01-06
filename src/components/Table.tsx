const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { key: string; label: string; className?: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderRow: (item: any) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}) => {
  return (
    <table className="w-full mt-4 border-separate border-spacing-y-3">
      <thead className="border-separate border-spacing-y-10">
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.key} className={col.className}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  );
};

export default Table;
