import { TextField, Button, Card, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../lib/fetchModelData";
export default function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const handleRegister = async () => {
        try {
            const response = await fetch(baseURL+"/api/loginRegister/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (response.ok) {
                alert("Register successful! Please login.");
                setError(null);
                navigate("/login");
            } else {
                alert("Register failed: " + data.message);
                setError("Username already exists. Please choose another one.");
            }
        } catch (error) {
            console.error("Error during register:", error);
        }
    };
    const isFormValid = () => {
        return (
            user.first_name &&
            user.last_name &&
            user.username &&
            user.password &&
            user.confirmPassword &&
            user.occupation &&
            user.location &&
            user.description &&
            user.password === user.confirmPassword
        );
    };

    return (
        <Card sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mx: 'auto', textAlign: 'center' }}>
                Register
            </Typography>

            <TextField fullWidth label="First Name" margin="dense" onChange={(e) => setUser({ ...user, first_name: e.target.value })} />
            <TextField fullWidth label="Last Name" margin="dense" onChange={(e) => setUser({ ...user, last_name: e.target.value })} />
            <TextField fullWidth label="Username" margin="dense" onChange={(e) => setUser({ ...user, username: e.target.value })} />
            {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
            <TextField fullWidth label="Password" type="password" margin="dense" onChange={(e) => setUser({ ...user, password: e.target.value })} />
            <TextField fullWidth label="Confirm Password" type="password" margin="dense" onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })} />
            <TextField fullWidth label="Occupation" margin="dense" onChange={(e) => setUser({ ...user, occupation: e.target.value })} />
            <TextField fullWidth label="Location" margin="dense" onChange={(e) => setUser({ ...user, location: e.target.value })} />
            <TextField fullWidth label="Description" margin="dense" multiline rows={3} onChange={(e) => setUser({ ...user, description: e.target.value })} />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleRegister} disabled={!isFormValid()}>
                Register
            </Button>
        </Card>
    );
}