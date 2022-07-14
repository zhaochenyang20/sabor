import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Get } from "../../../utils/communication";
import cookie from "react-cookies";
import Card from "@mui/material/Card";
// import Container from "@mui/material/Container";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

function MRs(Issue_id) {
  const [MR_LIST, setMR_LIST] = useState([]);
  const [MR_LOAD, setMR_LOAD] = useState(false);
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const { projectIndex } = useParams();

  function fetch_MRs() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/get-issue-closed-by/" +
      Issue_id.Issue_id;
    const body = {
      id: parseInt(projectIndex),
      issue: Issue_id.Issue_id,
    };
    Get(
      url,
      body,
      (response) => {
        if (response.code === 200) {
          console.log(response.data.length);
          setMR_LIST(response.data);
          setMR_LOAD(true);
        }
      },
      headers
    );
  }

  function get_MRs() {
    if (MR_LIST.length === 0) {
      return [{ id: "暂无", title: "暂无", content: "暂无" }]; //看情况
    } else {
      return MR_LIST;
    }
  }

  function MR_Row({ content }) {
    return (
      <React.Fragment>
        <TableRow>
          <TableCell />
          <TableCell>{content.id}</TableCell>
          <TableCell>{content.title}</TableCell>
          <TableCell>{content.content}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  useEffect(() => {
    if (!MR_LOAD) fetch_MRs();
  });

  return (
    <React.Fragment>
      <Box
        sx={{
          bgcolor: "text.disable",
          color: "primary.main",
          boxShadow: 4,
          borderRadius: 2,
          p: 4,
          m: 4,
          minWidth: 300,
        }}
      >
        <Box sx={{ marginLeft: "7%", marginBottom: 3 }}>
          <Typography color="light-green" variant="h5">
            缺陷在这些合并请求修复
          </Typography>
        </Box>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
              <TableCell />
              <TableCell>序号</TableCell>
              <TableCell>标题</TableCell>
              <TableCell>内容</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {get_MRs().map((content) => {
              return <MR_Row key={content.id} content={content} />;
            })}
          </TableBody>
        </Table>
      </Box>
    </React.Fragment>
  );
}

//show Issue
export default function Issues() {
  const [Issue_LIST, setIssue_LIST] = useState([]);
  const [Issue_LOAD, setIssue_LOAD] = useState(false);
  const headers = { Authorization: "Bearer " + cookie.load("token") };
  const { projectIndex } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function fetch_Issues() {
    const url =
      process.env.REACT_APP_BACKEND_URL +
      "api/projects/" +
      projectIndex +
      "/git/get-issue";
    const body = {
      id: projectIndex,
    };
    console.log(headers);
    Get(
      url,
      body,
      (response) => {
        if (response.code === 200) {
          setIssue_LIST(response.data.content);
          setIssue_LOAD(true);
          console.log(Issue_LIST.length);
        }
      },
      headers
    );
  }

  function get_Issues() {
    if (Issue_LIST === []) {
      return []; //看情况
    } else {
      return Issue_LIST;
    }
  }

  function Issue_Row({ content }) {
    const [open, setopen] = useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell sx={{ width: "60px" }}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setopen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell sx={{ width: "10%" }}>{content.id}</TableCell>
          <TableCell sx={{ width: "30%" }}>{content.title}</TableCell>
          <TableCell sx={{ width: "35%" }}>{content.content}</TableCell>
          <TableCell sx={{ width: "15%" }}>
            {content.state === "closed" ? (
              <Typography color="green">已关闭</Typography>
            ) : (
              <Typography color="red">开启中</Typography>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <MRs Issue_id={content.id} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  useEffect(() => {
    if (!Issue_LOAD) fetch_Issues();
  });

  return (
    <Box>
      {Issue_LIST.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            marginTop: 3,
          }}
        >
          暂时没有缺陷需要处理
        </Box>
      ) : (
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4">缺陷统计</Typography>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Card>
              <TableContainer component={Paper}>
                <Table sx={{ width: 1 }}>
                  <TableHead>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell sx={{ width: "60px" }} />
                      <TableCell sx={{ width: "120px" }}>
                        <Typography variant="h6">缺陷序号</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "180px" }}>
                        <Typography variant="h6">标题</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "180px" }}>
                        <Typography variant="h6">内容</Typography>
                      </TableCell>
                      <TableCell sx={{ width: "60px" }}>
                        <Typography variant="h6">状态</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {get_Issues()
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((content) => {
                        return <Issue_Row key={content.id} content={content} />;
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={Issue_LIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Paper>
        </Paper>
      )}
    </Box>
  );
}
