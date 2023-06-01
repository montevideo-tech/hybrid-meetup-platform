import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
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
import envelope from "../assets/envelope.svg";
import lock from "../assets/lock.svg";
import eye from "../assets/eye.svg";
import eyeSlash from "../assets/eyeSlash.svg";

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
            <InputContainer>
              <StartIcon src={envelope} alt="lock" />
              <Input
                id="email"
                name="email"
                autoFocus
                className="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="email address"
                $customStyles={{
                  width: "250px",
                }}
              />
            </InputContainer>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
            <Label
              htmlFor="password"
              $customStyles={{ alignSelf: "start", marginLeft: "15px" }}
            >
              Password
            </Label>
            <InputContainer>
              <StartIcon src={lock} alt="lock" />
              <EndIcon
                onClick={() => setShowPassword(!showPassword)}
                src={showPassword ? eye : eyeSlash}
                alt="view password"
              />
              <Input
                name="password"
                label="Password"
                placeholder="password"
                className="password"
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                $customStyles={{ width: "250px" }}
              />
            </InputContainer>
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

const InputContainer = styled.div`
  align-self: center;
  justify-self: center;
  margin-bottom: 14px;
`;

const StartIcon = styled.img`
  position: absolute;
  padding: 11px 0 0 15px;
  width: 20px;
  height: 20px;
`;

const EndIcon = styled.img`
  cursor: pointer;
  position: absolute;
  margin: 11px 0 0 297px;
  width: 20px;
  height: 20px;
`;
