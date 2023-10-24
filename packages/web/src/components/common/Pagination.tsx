interface PaginationProps {
  setPage: (_: number) => void;
  page: number;
  lastPage: number;
  className?: string;
}
export const Pagination = ({
  className = 'flex w-full justify-center gap-2 px-6 py-4 ',
  setPage,
  page,
  lastPage,
}: PaginationProps) => {
  return (
    <div className={className}>
      <button
        onClick={() => {
          setPage(1);
        }}
        disabled={page === 1}
        className={`${
          page === 1 || lastPage <= 2 ? 'hidden' : 'block'
        } bg-secondary rounded-lg p-1 px-2 text-lg text-white`}
      >
        First
      </button>
      <button
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={page === 1}
        className={`${page === 1 ? 'bg-lavander' : 'bg-secondary'} rounded-lg p-1 px-2 text-lg text-white`}
      >
        Prev
      </button>
      <button
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={page === lastPage}
        className={`${page === lastPage ? 'bg-lavander' : 'bg-secondary'} rounded-lg p-1 px-2 text-lg text-white`}
      >
        Next
      </button>
      <button
        onClick={() => {
          setPage(lastPage);
        }}
        disabled={page === lastPage}
        className={`${
          page === lastPage || lastPage <= 2 ? 'hidden' : 'block'
        } bg-secondary rounded-lg p-1 px-2 text-lg text-white`}
      >
        Last
      </button>
    </div>
  );
};
