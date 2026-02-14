import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import { Box, Grid } from "@mui/material";

import TopBar from "./components/TopBar";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import Protected from "./components/Protected";
import Register from "./components/Register";
import UploadPhoto from "./components/UploadPhoto";

function App() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/loginRegister/check-login",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUserId(data.userId);
        } else {
          setUserId(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking login status:", error);

      }
    }
    checkLogin();
  }, []);


  return !loading && (
    <Box>
      <Router>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TopBar checkedLogin={userId} setCheckedLogin={setUserId} />
          </Grid>
          <Routes>
            <Route path="/" element={<Navigate to="/users" />} />
            <Route element={<Protected checkLogin={userId} />}>
              <Route
                path="/users"
                element={
                  <>
                    <Grid size={3}>
                      <UserList />
                    </Grid>
                    <Grid size={9}>
                      <Outlet />
                    </Grid>
                  </>
                }
              >
                <Route path=":userId" element={<UserDetail userID={userId} />} />
                <Route path="photos/:userId" element={<UserPhotos userID={userId} />} />
              </Route>
            </Route>
            <Route path="/photos/new" element={<UploadPhoto userID={userId} />} />
            <Route path="/login" element={<Login checkLogin={userId} setCheckedLogin={setUserId} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </Grid>
      </Router>
    </Box>
  );
}

export default App;
