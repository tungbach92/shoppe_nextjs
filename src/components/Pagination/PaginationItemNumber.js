import React from "react";
import classNames from "classnames";

export default function PaginationItemNumber({
  pageIndex,
  setPageIndex,
  pageTotal,
}) {
  const numOfPageShowing = 5;
  const numberOfPageHiddingFromStart = 3;
  const numberOfPageHiddingFromEnd = 3;
  let arrayOfPageIndexElements = [];
  for (let index = numberOfPageHiddingFromStart; index <= pageTotal; index++) {
    //show pages from index to ... of pagination bar
    if (pageIndex <= numOfPageShowing && index <= numOfPageShowing) {
      arrayOfPageIndexElements.push(
        <li
          key={index}
          onClick={() => setPageIndex(index)}
          className={classNames("pagination-number", {
            "pagination-number--active": pageIndex === index,
          })}
        >
          <div className="pagination-item__link">{index}</div>
        </li>
      );
    }

    //show pages between ... and ... of pagination bar
    else if (
      pageIndex >= numOfPageShowing &&
      index < pageIndex + numberOfPageHiddingFromEnd &&
      index > pageIndex - numberOfPageHiddingFromStart
    ) {
      arrayOfPageIndexElements.push(
        <li
          key={index}
          onClick={() => setPageIndex(index)}
          className={classNames("pagination-number", {
            "pagination-number--active": pageIndex === index,
          })}
        >
          <div className="pagination-item__link">{index}</div>
        </li>
      );
    }

    //show pages from ... to the end of pagination bar
    else if (
      pageIndex > pageTotal - numberOfPageHiddingFromEnd &&
      index > pageTotal - numOfPageShowing
    ) {
      arrayOfPageIndexElements.push(
        <li
          key={index}
          onClick={() => setPageIndex(index)}
          className={classNames("pagination-number", {
            "pagination-number--active": pageIndex === index,
          })}
        >
          <div className="pagination-item__link">{index}</div>
        </li>
      );
    }
  }

  return (
    <>
      <li
        onClick={() => setPageIndex(1)}
        className={classNames("pagination-number", {
          "pagination-number--active": pageIndex === 1,
        })}
      >
        <div className="pagination-item__link">1</div>
      </li>
      <li
        onClick={() => setPageIndex(2)}
        className={classNames("pagination-number", {
          "pagination-number--active": pageIndex === 2,
        })}
      >
        <div className="pagination-item__link">2</div>
      </li>
      {/* Show ... from the start of pagination bar  */}
      {pageIndex > numOfPageShowing && (
        <li className="pagination-item pagination-item--non-click">
          <div className="pagination-item__link">...</div>
        </li>
      )}
      {arrayOfPageIndexElements}
      {/* show ... from the ending of pagination bar*/}
      {pageTotal > numOfPageShowing &&
        pageIndex <= pageTotal - numberOfPageHiddingFromEnd && (
          <li className="pagination-item pagination-item--non-click">
            <div className="pageTotalpagination-item__link">...</div>
          </li>
        )}
    </>
  );
}
