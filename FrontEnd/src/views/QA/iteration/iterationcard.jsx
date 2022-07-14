import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import cookie from "react-cookies";
import axios from "axios";
import Typography from "@mui/material/Typography";
import StateCard from "./state";
import RequirementDialog from "./requirementdialog";
import Grid from "@mui/material/Grid";

export default function IterationCard({ iteration }) {
  let { projectIndex } = useParams();
  let token = cookie.load("token");
  const headers = { Authorization: "Bearer " + token };
  const [dialogOpen, setDialogOpen] = useState(false);
  let deadline = new Date(parseInt(iteration.deadline)).toLocaleString();
  const [functionalRequirements, setFunctionalRequirements] = useState([]);
  const [load, setLoad] = useState(false);

  function getFunctionalRequirements() {
    setLoad(true);
    Promise.allSettled(
      iteration.functionalRequirementIds.map((index) => {
        const url =
          process.env.REACT_APP_BACKEND_URL +
          "api/projects/" +
          projectIndex +
          "/find-one-func-require/" +
          index;
        return axios.get(url, { headers });
      })
    ).then((responses) => {
      let tempFunctionalRequirements = [];
      for (let index in responses) {
        tempFunctionalRequirements.push(responses[index].value.data.data);
      }
      setFunctionalRequirements(tempFunctionalRequirements);
    });
  }

  useEffect(() => {
    if (!load) {
      getFunctionalRequirements();
    }
  });

  return (
    <Card>
      <CardHeader title={iteration.name} subheader={"截止时间：" + deadline} />
      <CardContent>
        <StateCard functionalRequirements={functionalRequirements} />
      </CardContent>
      <CardActions disableSpacing>
        <Grid container>
          <Grid item xs={10}>
            <Typography
              align="center"
              variant="body2"
              sx={{ p: 2 }}
              color="text.secondary"
            >
              展开查看详细需求交付情况
            </Typography>
          </Grid>
          <Grid xs={2} sx={{ p: 1.5 }}>
            <ViewListIcon
              onClick={() => {
                setDialogOpen(true);
              }}
            />
          </Grid>
        </Grid>

        <RequirementDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          iteration={iteration}
          functionalRequirements={functionalRequirements}
        />
      </CardActions>
    </Card>
  );
}
