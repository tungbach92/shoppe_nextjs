import React from "react";

const Grid = ({ col, mdCol, smCol, gap, children }) => {
  const gridCol = col ? `grid-col-${col}` : "";
  const gridMdCol = mdCol ? `grid-col-md-${mdCol}` : "";
  const gridSmCol = smCol ? `grid-col-sm-${smCol}` : "";
  return (
    <div
      className={`grid  ${gridCol} ${gridMdCol} ${gridSmCol}`}
      style={{ gap: `${gap}rem` }}
    >
      {children}
    </div>
  );
};

export default Grid;
