import * as React from "react";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function Copyright(props) {
  return (
    <Typography variant="body2" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit">Scissor Seven</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={{
        p: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Link
            href="https://docs-scissorseven.app.secoder.net/"
            align="center"
          >
            <Typography component="h1" variant="h3">
              用户手册
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Copyright />
        </Grid>
      </Grid>
    </Box>
  );
}
