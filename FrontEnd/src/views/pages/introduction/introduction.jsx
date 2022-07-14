import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Footer from "./footer";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import FunctionCard from "./functioncard";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";

export default function Introduction() {
  let navigate = useNavigate();

  return (
    <Box
      minHeight="100%"
      minWidth="100%"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        pt: 4,
        pb: 4,
        pl: 4,
        pr: 4,
        flexDirection: "column",
        display: "flex",
        backgroundColor: "0xffffff",
      }}
    >
      <Card variant="outlined" sx={{ width: 1000 }}>
        <CardMedia
          component="img"
          image="/static/background.png"
          fullwidth={true}
        />
      </Card>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box component="form" sx={{ pt: 4, pb: 2, width: 1000 }} noValidate>
          <Grid container direction="row" spacing={10}>
            <Grid item xs={6}>
              <Button
                fullWidth
                type="submit"
                variant="outlined"
                sx={{
                  height: 50,
                }}
                onClick={() => {
                  navigate("/register");
                }}
              >
                注册
                <HowToRegIcon />
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                type="submit"
                variant="outlined"
                sx={{ height: 50 }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                登录 <LoginIcon />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/*
      一站式需求管理
      分角色协同开发
      多平台信息关联
      全维度交付评价
      */}
      <Grid container sx={{ width: 1030, pt: 2, pb: 2 }} spacing={6}>
        <Grid item xs={4} align="left">
          <FunctionCard
            img={"/static/system.png"}
            title={"系统工程师"}
            info={"需求管理/服务管理/迭代管理"}
          />
        </Grid>
        <Grid item xs={4} align="center">
          <FunctionCard
            img={"/static/develop.png"}
            title={"开发工程师"}
            info={"迭代完成/需求交付"}
          />
        </Grid>
        <Grid item xs={4} align="right">
          <FunctionCard
            img={"/static/quality.png"}
            title={"质量保证工程师"}
            info={"交付评价/GIT管理/能力评价"}
          />
        </Grid>
      </Grid>
      <Divider sx={{ width: 1000, p: 1 }}></Divider>
      <Box sx={{ width: 400, mt: 4, mb: 4 }}>
        <CardMedia component="img" image="/static/title.svg" fullwidth={true} />
      </Box>
      <Card variant="outlined" sx={{ width: 1000, mt: 4, mb: 4, p: 2 }}>
        <CardMedia
          component="img"
          image="/static/one-stationed.svg"
          fullwidth={true}
        />
      </Card>
      <Card variant="outlined" sx={{ width: 1000, mt: 4, mb: 4, p: 2 }}>
        <CardMedia
          component="img"
          image="/static/multirole.svg"
          fullwidth={true}
        />
      </Card>
      <Card variant="outlined" sx={{ width: 1000, mt: 4, mb: 4, p: 2 }}>
        <CardMedia
          component="img"
          image="/static/mixed-platform.svg"
          fullwidth={true}
        />
      </Card>
      <Card variant="outlined" sx={{ width: 1000, mt: 4, mb: 4, p: 2 }}>
        <CardMedia
          component="img"
          image="/static/overall-perspect.svg"
          fullwidth={true}
        />
      </Card>
      <Divider sx={{ width: 1000, p: 1 }}></Divider>
      <Card variant="outlined" sx={{ width: 1000, mt: 4, mb: 4, p: 2 }}>
        <CardMedia component="img" image="/static/info.png" fullwidth={true} />
      </Card>
      <Footer />
    </Box>
  );
}
