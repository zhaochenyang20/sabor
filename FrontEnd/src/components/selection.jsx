import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

export default function Selection({
  originRequireList,
  description,
  id,
  setId,
  required,
}) {
  const handleOriginRequireState = (event) => {
    setId(event.target.value);
  };

  if (originRequireList.length === 0) {
    return (
      <TextField
        margin="normal"
        fullWidth
        select
        id="filled-basic"
        label={description}
        value={id}
        onChange={handleOriginRequireState}
      >
        <MenuItem value={undefined}> 暂无相关选项</MenuItem>
      </TextField>
    );
  }

  return (
    <TextField
      margin="normal"
      fullWidth
      select
      id="filled-basic"
      label={description}
      value={id}
      onChange={handleOriginRequireState}
    >
      {originRequireList.map((requirement) => {
        return (
          <MenuItem value={requirement.id} key={requirement.id}>
            {requirement.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
