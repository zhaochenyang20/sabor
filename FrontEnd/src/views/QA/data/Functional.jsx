import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

export default function Functional({ content, mode }) {
  return (
    <React.Fragment>
      <TableRow key={content.id}>
        {mode === "small" ? (
          <React.Fragment>
            <TableCell component="th" scope="row" sx={{ width: "45%" }}>
              {content.name}
            </TableCell>
            <TableCell sx={{ width: "55%" }}>{content.description}</TableCell>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TableCell component="th" scope="row" sx={{ width: "10%" }} />
            <TableCell sx={{ width: "20%" }}>{content.name}</TableCell>
            <TableCell sx={{ width: "40%" }}>{content.description}</TableCell>
            <TableCell sx={{ width: "30%" }} />
          </React.Fragment>
        )}
      </TableRow>
    </React.Fragment>
  );
}
