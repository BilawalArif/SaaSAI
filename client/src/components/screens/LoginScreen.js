import {
  Alert,
  Box,
  Button,
  Collapse,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginScreen = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const config = {
    headers: "Content-Type: application/json",
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        config
      );
      if (data.token.accessToken) {
        localStorage.setItem("authToken", true);
        navigate("/");
        window.location.reload();
      }
      navigate("/");
    } catch (err) {
      console.log(err);
      if (err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Box
      width={isNonMobile ? "40%" : "80%"}
      p="2rem"
      m="2rem auto"
      borderRadius={5}
      backgroundColor={theme.palette.background.alt}
      sx={{ boxShadow: 5 }}
    >
      <Collapse in={error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>
      <form onSubmit={loginHandler}>
        <Typography variant="h3">Login</Typography>
        <TextField
          required
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></TextField>
        <TextField
          required
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></TextField>
        <Button
          fullWidth
          size="large"
          variant="contained"
          type="submit"
          sx={{ color: "white", mt: 2 }}
        >
          Login
        </Button>
      </form>
      <Typography mt={2}>
        Don't have an account? <Link href="/register">Sign Up</Link>
      </Typography>
    </Box>
  );
};

export default LoginScreen;
