function Pagination({
  // total pages
  total,
  // current page of the component
  current,
  // event handler when button is clicked,
  // changePage accepts the new page in number
  changePage
}) {
  // fix code here
  let pages = new Array(total).fill(0).map((el, i) => (
    <button
      key={el.id}
      data-testid="page-btn"
      onClick={() => changePage(Number(i + 1))}
      disabled={current === i + 1}
    >
      {i + 1}
    </button>
  ));
  return <div>{pages}</div>;
}

export default Pagination;
