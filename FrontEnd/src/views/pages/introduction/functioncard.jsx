import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function FunctionCard({ img, title, info }) {
  return (
    <Card variant="outlined" sx={{ width: 260 }}>
      <CardMedia
        component="img"
        image={img}
        alt="green iguana"
        fullwidth={true}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ p: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
          {info}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
