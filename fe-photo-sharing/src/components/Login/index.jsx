import { useState } from "react";
import { Navigate } from "react-router-dom";
import { TextField, Button, Typography, Card } from "@mui/material";
import {baseURL} from "../../lib/fetchModelData";

export default function Login({ checkLogin, setCheckedLogin }) {
  const [user, setUser] = useState({});
  const [failedLogin, setFailedLogin] = useState(false);
  if (checkLogin) {
    return <Navigate to={"/users/"+checkLogin} />;
  }
  const handleLogin = async () => {
    try {
      const response = await fetch(baseURL+"/api/loginRegister/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      if (!response.ok) {
        setFailedLogin(true);
      } else {
        setFailedLogin(false);
        setCheckedLogin(data.userId);

      }

    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Card sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h6" sx={{ mx: 'auto', textAlign: 'center' }}>
        Login
      </Typography>

      <TextField
        fullWidth
        margin="dense"
        label="Username"
        onChange={(e) =>
          setUser((prev) => ({ ...prev, username: e.target.value }))
        }
      />

      <TextField
        fullWidth
        margin="dense"
        label="Password"
        type="password"
        onChange={(e) =>
          setUser((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      {failedLogin && (
        <Typography color="error" variant="body2">
          Login failed. Please check your username and password.
        </Typography>
      )}
      <Button
        fullWidth
        sx={{ mt: 2 }}
        variant="contained"
        onClick={handleLogin}
      >
        Login
      </Button>
    </Card>
  );
}
