import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material";

const StyledBox = styled(Box)({
  textAlign: "center",
  fontSize: "1.6rem",
  fontWeight: "600",
  color: "var(--primary-color)",
  padding: "20rem 0",
});

export default function Error() {
  return (
    <>
      <StyledBox>Error 404 - Không tìm thấy trang</StyledBox>
    </>
  );
}
