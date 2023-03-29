import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const MiniPageControl = ({
  totalItems,
  pageIndex,
  pageSize,
  pageTotal,
  setPageIndex,
}) => {
  return (
    <>
      <div className="app__page-number">
        {totalItems >= pageSize && (
          <>
            <span className="app__page-index">{pageIndex}</span>/
            <span className="app__page-page-total">{pageTotal}</span>
          </>
        )}

        {/* <!--  app__pre-page--disabled --> */}
      </div>
      <div
        onClick={pageIndex <= 1 ? undefined : () => setPageIndex(pageIndex - 1)}
        className={classNames("app__filter-page-item", "app__pre-page", {
          "app__pre-page--disabled": pageIndex <= 1,
        })}
      >
        <i className="app__pre-icon bi bi-chevron-left"></i>
      </div>
      <div
        onClick={
          pageIndex >= pageTotal ? undefined : () => setPageIndex(pageIndex + 1)
        }
        className={classNames("app__filter-page-item", "app__next-page", {
          "app__next-page--disabled": pageIndex >= pageTotal,
        })}
      >
        <i className="app__next-icon bi bi-chevron-right"></i>
      </div>
    </>
  );
};
MiniPageControl.propTypes = {
  totalItems: PropTypes.number,
};

MiniPageControl.defaultProps = {
  totalItems: 0,
};

export default MiniPageControl;
