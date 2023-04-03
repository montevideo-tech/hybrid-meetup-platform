/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { signInWithEmail } from '../actions';

const StyledContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const StyledForm = styled(Box)`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  padding: 2rem;
`;

const StyledButton = styled(Button)`
&&.custom-button {
    background-color: #652ead;
    color: #ffffff;
  }
  &&.custom-button:hover {
    background-color: #391052;
  }
  &&.custom-button:disabled {
    background-color: #cccccc;
  }
`;

const StyledLink = styled(Link)`
  color: #007bff;
`;

const StyledHeader = styled(Typography)`
  font-weight: bold;
  text-align: center;
`;

const StyledAvatar = styled(Avatar)`
  background-color: #dbbcd7;
`;

const formVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.7 } }
};

function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [alert, setAlert] = useState({ type: 'success', message: null });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const onSuccess = () => {
      navigate('/rooms');
    };
    const onError = (error) => {
      setAlert({ type: 'error', message: `An error occurred while signing in: ${error}` });
    };
    dispatch(signInWithEmail(data, onSuccess, onError));
  };

  return (
    <StyledContainer>
      <motion.div
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <StyledForm component="form" onSubmit={handleSubmit(onSubmit)}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <StyledHeader variant="h5">
            Sign In
          </StyledHeader>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            {...register('email')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              )
            }}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password')}
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
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={Object.keys(errors).length > 0}
            sx={{ mt: 2, mb: 1 }}
            className="custom-button"
          >
            Sign In
          </StyledButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <StyledLink component={RouterLink} to="/signUp" variant="body2">
                Don't have an account? Sign Up
              </StyledLink>
            </Grid>
          </Grid>
          {alert.message && (
            <Alert severity={alert.type} sx={{ mt: 2 }}>
              {alert.message}
            </Alert>
          )}
        </StyledForm>
      </motion.div>
    </StyledContainer>
  );
}

export default SignIn;
