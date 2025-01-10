import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    if (totalPages <= 7) {
      return pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2 rounded-sm ${page === currentPage ? "bg-lamaGreen" : ""}`}
        >
          {page}
        </button>
      ));
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages].map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-2 rounded-sm ${page === currentPage ? "bg-lamaSky" : ""}`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2">
            ...
          </span>
        ),
      );
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages].map(
        (page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-2 rounded-sm ${page === currentPage ? "bg-lamaSky" : ""}`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2">
              ...
            </span>
          ),
      );
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ].map((page, index) =>
      typeof page === "number" ? (
        <button
          key={index}
          onClick={() => onPageChange(page)}
          className={`px-2 rounded-sm ${page === currentPage ? "bg-lamaSky" : ""}`}
        >
          {page}
        </button>
      ) : (
        <span key={index} className="px-2">
          ...
        </span>
      ),
    );
  };

  return (
    <div className="p-4 flex items-center justify-center text-gray-500">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="py-2 px-4 mx-2 rounded-md bg-slate-200 text-xs font-semibold hover:bg-lamaGreenLight disabled:opacity-50 disabled:cursor-not-allowed "
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {renderPageNumbers()}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="py-2 px-4 mx-2 rounded-md bg-slate-200 text-xs font-semibold hover:bg-lamaGreenLight disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
