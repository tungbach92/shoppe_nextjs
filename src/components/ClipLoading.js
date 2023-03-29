import { Box } from "@mui/material";
import React from "react";
import { ClipLoader } from "react-spinners";

export const ClipLoading = () => {
  return (
    <Box
      sx={{
        flex: 1,
        textAlign: "center",
        padding: "14.5rem",
        fontSize: "1.6rem",
        color: "var(--primary-color)",
        fontWeight: "600",
      }}
    >
      <ClipLoader color="var(--primary-color)" />
    </Box>
  );
};
