import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchModel, { baseURL } from "../../lib/fetchModelData";
export default function TopBar({ checkedLogin, setCheckedLogin }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!checkedLogin) return;
    const fetchData = async () => {
      try {
        setUser(await fetchModel("/api/user/" + checkedLogin));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [checkedLogin]);
  const handleLogout = async () => {
    try {
      const response = await fetch(
        baseURL + "/api/loginRegister/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        setCheckedLogin(null);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h6" sx={{ flexShrink: 0 }}>
          Photo Sharing
        </Typography>

        {/* đẩy các nút sang bên phải */}
        <Box sx={{ ml: "auto" }} />

        {/* Khi chưa login */}
        {!checkedLogin && (
          <>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </>
        )}

        {/* Khi đã login */}
        {checkedLogin && (
          <>
            <Typography variant="subtitle1" sx={{ alignSelf: 'center', fontWeight: 500 }}>
              Hi {user && user.first_name}
            </Typography>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate("/users/" + checkedLogin)}
            >
              User List
              
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate("/photos/new")}
            >
              Upload Photo
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
