import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { logout } from "../reducers/userSlice";
import { Hybridly } from "../components/hybridly/Hybridly";

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
    navigate("/signIn");
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
        <AppBar
          position="relative"
          sx={{ height: "100%", justifyContent: "center" }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Hybridly />
            {auth?.email && auth?.token && (
              <Container>
                <p>{currentUser.email}</p>
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
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </Container>
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

export default RoomsLayout;

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const AppbarContainer = styled.div`
  height: 4rem;
`;

const OutletContainer = styled.div`
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;
