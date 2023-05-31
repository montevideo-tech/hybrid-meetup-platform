import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import {
  Button,
  Card,
  Input,
  Label,
  StyledLink,
  formVariants,
} from "../themes/componentsStyles";
import { signUp } from "../actions";
import { Colors } from "../themes/colors";
import logo2 from "../assets/logo2.svg";
import orangeUser from "../assets/orangeUser.svg";
import envelope from "../assets/envelope.svg";
import lock from "../assets/lock.svg";

function SignUp() {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
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

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const onSuccess = () => {
      setAlert({ type: "success", message: "Please verify your email" });
      setTimeout(() => {
        navigate("/signIn");
      }, 3000);
    };
    const onError = (error) => {
      setAlert({ type: "error", message: `An error occurred: ${error} ` });
    };
    dispatch(signUp(data, onSuccess, onError));
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
          <StyledForm
            component="form"
            className="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <img src={logo2} alt="hybridly" height="38.18px" width="160.85px" />
            <Title>Create an Account</Title>
            <Label
              htmlFor="name"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Name
            </Label>
            <Input
              id="name"
              label="Name"
              name="name"
              autoFocus
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="name"
              $customStyles={{
                marginBottom: "14px",
                background: `url(${orangeUser}) no-repeat scroll 15px 7px`,
                paddingLeft: "43px",
              }}
            />
            <Label
              htmlFor="email"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              placeholder="email address"
              $customStyles={{
                marginBottom: "14px",
                background: `url(${envelope}) no-repeat scroll 15px 9px`,
                paddingLeft: "43px",
              }}
            />
            <Label
              htmlFor="password"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              label="Email Address"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.password}
              helperText={errors.password?.message}
              placeholder="password"
              $customStyles={{
                marginBottom: "14px",
                background: `url(${lock}) no-repeat scroll 15px 7px`,
                paddingLeft: "43px",
              }}
            />
            <Label
              htmlFor="confirmPassword"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(event) => event.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              placeholder="password"
              $customStyles={{
                background: `url(${lock}) no-repeat scroll 15px 7px`,
                paddingLeft: "43px",
              }}
            />
            <Button
              $primary
              $customStyles={{ margin: "25px 0", alignSelf: "end" }}
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              Sign up
            </Button>
            <LoginContainer>
              <span>Already have an account?</span>
              <StyledLink component={RouterLink} to="/signIn">
                Login
              </StyledLink>
            </LoginContainer>
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

export default SignUp;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${Colors.purple};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
