import React, { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { logout } from '../reducers/userSlice';

export function RoomsLayout() {
  const [auth, setAuth] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(currentUser);
  }, [currentUser]);

  const handleSignOut = () => {
    // TODO: invalidate token
    setAuth(null);
    setAnchorEl(null);
    dispatch(logout());
    navigate('/signIn');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <RootContainer>
      <AppbarContainer>
        <AppBar position="relative" sx={{ height: '100%', justifyContent: 'center' }}>
          <Toolbar>
            <MenuItem
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                letterSpacing: 1,
              }}
              component={RouterLink}
              to="/"
            >
              Hybridly
            </MenuItem>
            {auth?.email && auth?.token && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </div>
            )}
          </Toolbar>
        </AppBar>
      </AppbarContainer>
      <OutletContainer>
        <Outlet />
      </OutletContainer>
    </RootContainer>
  );
}

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AppbarContainer = styled.div`
  height: 4rem;
`;

const OutletContainer = styled.div`
  margin-top: 4rem;
  height: 100%;
`;

export default RoomsLayout;
