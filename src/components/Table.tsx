import React from "react";

type TableProps<T> = {
  renderRow: (item: T) => React.ReactNode;
  data: T[];
};

const Table = <T extends object>({ renderRow, data }: TableProps<T>) => {
  return <>{data.map((item) => renderRow(item))}</>;
};

export default Table;
