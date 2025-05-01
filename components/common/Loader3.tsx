import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Loader3() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="10px"
      justifyContent="center"
      height="10vh" // Adjust the height as needed
    >
      <CircularProgress disableShrink />
      <Typography variant="body1" color="textSecondary">
        Please wait...
      </Typography>
    </Box>
  );
}