import * as React from "react";
import { Card, Typography, Stack } from "@mui/material";
import Button from "@mui/material/Button";

function CharacterButton({ projectIndex, character }) {
  let characterName = "";
  if (character === "manager") characterName = "管理员";
  if (character === "systemEngineers") characterName = "系统工程师";
  if (character === "developmentEngineers") characterName = "开发工程师";
  if (character === "qualityAssuranceEngineers")
    characterName = "质量保证工程师";
  function handleClick() {
    if (character === "manager")
      window.location.href = "/dashboard/admin/project" + projectIndex;
    if (character === "systemEngineers")
      window.location.href = "/dashboard/system/project" + projectIndex;
    if (character === "developmentEngineers")
      window.location.href = "/dashboard/develop/project" + projectIndex;
    if (character === "qualityAssuranceEngineers")
      window.location.href = "/dashboard/QA/project" + projectIndex;
  }
  return (
    <Button onClick={handleClick} variant="outlined">
      {characterName}界面
    </Button>
  );
}

export default function ProjectCard({ project }) {
  if (project.role)
    return (
      <Card sx={{ height: 360, p: 2 }}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Typography variant="h4" align="center" noWrap>
            {project.name}
          </Typography>
          <Typography variant="body1" align="center" noWrap>
            管理员：{project.manager}
          </Typography>
          {project.role.map((character) => (
            <CharacterButton
              key={character}
              projectIndex={project.index}
              character={character}
            />
          ))}
        </Stack>
      </Card>
    );
  else return <Card></Card>;
}
