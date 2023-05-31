import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Alert from "@mui/material/Alert";
import {
  Button,
  StyledLink,
  formVariants,
  Card,
  Input,
  Label,
} from "../themes/componentsStyles";
import { signInWithEmail } from "../actions";
import { Colors } from "../themes/colors";
import Logo from "../assets/logo2.svg";

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [alert, setAlert] = useState({ type: "success", message: null });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const onSuccess = () => {
      navigate("/rooms");
    };
    const onError = (error) => {
      setAlert({
        type: "error",
        message: `An error occurred while signing in: ${error}`,
      });
    };
    dispatch(signInWithEmail(data, onSuccess, onError));
  };
  return (
    <Container>
      <Card>
        <motion.div
          variants={formVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <StyledForm component="form" onSubmit={handleSubmit(onSubmit)}>
            <img src={Logo} alt="hybridly" height="38.18px" width="160.85px" />
            <Title variant="h5">Connect Your Account</Title>
            <Label
              htmlFor="email"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Email Adress
            </Label>
            <Input
              id="email"
              label="Email Address"
              name="email"
              placeholder="email adress"
              autoFocus
              $customStyles={{ marginBottom: "14px" }}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
            <Label
              htmlFor="password"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Password
            </Label>
            <Input
              name="password"
              label="Password"
              placeholder="password"
              className="password-icon"
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              $customStyles={{ marginBottom: "14px" }}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
            <Button
              $primary
              type="submit"
              disabled={Object.keys(errors).length > 0}
              $customStyles={{ margin: "25px 0", alignSelf: "end" }}
            >
              Log In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <LoginContainer>
                  <span>Don&apos;t have an account?</span>
                  <StyledLink component={RouterLink} to="/signUp">
                    Create Account
                  </StyledLink>
                </LoginContainer>
              </Grid>
            </Grid>
            {alert.message && (
              <Alert severity={alert.type} sx={{ mt: 2 }}>
                {alert.message}
              </Alert>
            )}
          </StyledForm>
        </motion.div>
      </Card>
    </Container>
  );
}

export default SignIn;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${Colors.purple};
`;

const Title = styled.h1`
  font-family: "Poppins";
  font-weight: 600;
  font-size: 1.563rem;
  line-height: 38px;
  color: ${Colors.purple};
  margin: 14px 0 27px 0;
`;

const LoginContainer = styled.div`
  align-self: end;
  font-family: "Poppins";
  font-style: italic;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 18px;
  span {
    margin-right: 2px;
    color: ${Colors.davyGray};
  }
`;

const ErrorMessage = styled.div`
  font-family: "Poppins";
  font-size: 0.75rem;
  color: red;
  margin-top: -10px;
`;
