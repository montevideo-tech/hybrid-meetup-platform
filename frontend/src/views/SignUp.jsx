import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Alert, Link } from "@mui/material";
import Input from "../components/Input";
import Card from "../components/Card";
import Button from "../components/Button";
import { signUp } from "../actions";
import { Colors } from "../themes/colors";
import logo2 from "../assets/logo2.svg";
import user from "../assets/orange-user.svg";
import envelope from "../assets/envelope.svg";
import lock from "../assets/lock.svg";
import eye from "../assets/eye.svg";
import eyeSlash from "../assets/eye-slash.svg";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";

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
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    const onSuccess = () => {
      setLoading(false);
      setAlert({ type: "success", message: "Please verify your email" });
      setTimeout(() => {
        navigate("/signIn");
      }, 3000);
    };
    const onError = (error) => {
      setLoading(false);
      setAlert({
        type: "error",
        message: `An error occurred: ${error.response.data.error} `,
      });
    };
    dispatch(signUp(data, onSuccess, onError));
  };

  return (
    <Container>
      <Card customStyles={{ padding: "2%" }}>
        <motion.div
          variants={{
            initial: { opacity: 0, y: 100 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            exit: { opacity: 0, y: -100, transition: { duration: 0.7 } },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <StyledForm
            component="form"
            className="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Icon
              icon={logo2}
              name="hybridly"
              height="38.18px"
              width="160.85px"
            />
            <Title>Create an Account</Title>
            <Label htmlFor="name">Name</Label>
            <InputContainer>
              <StartIcon src={user} alt="lock" />
              <Input
                autoFocus
                id="name"
                label="Name"
                name="name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                placeholder="name"
                focusStyles={`border: 2px solid ${Colors.orange};
                box-shadow: 0 0 2px ${Colors.orange};`}
                width="250px"
                customStyles={{ padding: "0 40px" }}
              />
            </InputContainer>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            <Label htmlFor="email">Email address</Label>
            <InputContainer>
              <StartIcon src={envelope} alt="lock" />
              <Input
                id="email"
                name="email"
                autoFocus
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                placeholder="email address"
                focusStyles={`border: 2px solid ${Colors.orange};
                box-shadow: 0 0 2px ${Colors.orange};`}
                width="250px"
                customStyles={{ padding: "0 40px" }}
              />
            </InputContainer>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
            <Label htmlFor="password">Password</Label>
            <InputContainer>
              <StartIcon src={lock} alt="lock" />
              <EndIcon
                onClick={() => setShowPassword(!showPassword)}
                src={showPassword ? eye : eyeSlash}
                alt="view password"
              />
              <Input
                id="password"
                name="password"
                label="Email Address"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                placeholder="password"
                focusStyles={`border: 2px solid ${Colors.orange};
                box-shadow: 0 0 2px ${Colors.orange};`}
                width="250px"
                customStyles={{ padding: "0 40px" }}
              />
            </InputContainer>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <InputContainer>
              <StartIcon src={lock} alt="lock" />
              <EndIcon
                onClick={() => setShowPassword(!showPassword)}
                src={showPassword ? eye : eyeSlash}
                alt="view password"
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                placeholder="password"
                focusStyles={`border: 2px solid ${Colors.orange};
                box-shadow: 0 0 2px ${Colors.orange};`}
                width="250px"
                customStyles={{ padding: "0 40px" }}
              />
            </InputContainer>
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
            )}
            <Button
              primary
              customStyles={{ margin: "25px 0", alignSelf: "end" }}
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              {loading ? <Spinner size={20} /> : "Sign up"}
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
  padding: 4.5% 0 8% 0;
  margin: 0;
`;

const InputContainer = styled.div`
  align-self: center;
  justify-self: center;
  padding-bottom: 4%;
`;

const Label = styled.label`
  font-family: "Poppins";
  font-style: italic;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 18px;
  color: ${Colors.davyGray};
  align-self: start;
  margin-left: 15px;
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

const StyledLink = styled(Link)`
  color: ${Colors.purple};
`;

const ErrorMessage = styled.div`
  font-family: "Poppins";
  font-size: 0.75rem;
  color: red;
  margin-top: -10px;
`;
