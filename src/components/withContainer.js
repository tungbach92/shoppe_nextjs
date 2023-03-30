import React from "react";

const withContainer = (WrappedContainer, IsBackgroundColorChange) => {
  return (props) => {
    return (
      <div
        className="container"
        style={{ background: IsBackgroundColorChange === true && "#f5f5f5" }}
      >
        <WrappedContainer {...props} />
      </div>
    );
  };
};

export default withContainer;
