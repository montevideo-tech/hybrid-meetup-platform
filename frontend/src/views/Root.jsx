import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { logout } from '../reducers/userSlice';

function Root() {
  const [auth, setAuth] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const currentUser = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(currentUser);
  }, [currentUser]);

  const handleSignOut = () => {
    // TODO: invalidate token
    dispatch(logout());
    setAuth(null);
    setAnchorEl(null);
  };

  const handleSignIn = () => {
    navigate('/signIn');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div style={{ height: '8vh' }}>
        <AppBar position="relative" sx={{ height: '100%', justifyContent: 'center' }}>
          <Toolbar>
            <MenuItem variant="h6" sx={{ flexGrow: 1, textDecoration: 'none' }} component={RouterLink} to="/">
              Monte&lt;video&gt; Tech Summer Camp
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
            {!auth?.email && !auth?.token && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleSignIn}
                  color="inherit"
                >
                  <LoginIcon />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <div style={{ height: '92vh' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
