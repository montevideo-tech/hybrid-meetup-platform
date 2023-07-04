import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { logout } from "../reducers/userSlice";
import { Hybridly } from "../components/hybridly/Hybridly";
import { Button } from "../themes/componentsStyles";
import user from "../assets/user.svg";
import arrow from "../assets/arrow.svg";
import { DropdownMenu } from "./DropdownMenu";

export function Header() {
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
    navigate("/");
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
          sx={{ justifyContent: "center", padding: "0 30px" }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Hybridly />
            {auth?.email && auth?.token ? (
              <>
                <Button
                  onClick={handleMenu}
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  $customStyles={{
                    width: "100px",
                    height: "45px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 16px",
                  }}
                >
                  <img alt="user" src={user} />
                  <img alt="arrow" src={arrow} />
                </Button>
                <DropdownMenu 
                    handleSignOut={handleSignOut}
                    handleClose={handleClose}
                    anchorEl={anchorEl}
                    currentUser={currentUser}
                    buttonStyles={{
                      width: "100%",
                      height: "25px",
                      fontWeight: "600",
                      fontSize: "0.65rem",
                      lineHeight: "12px",
                      textTransform: "uppercase",
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                />
              </>
            ) : (
              <Button
                onClick={() => navigate("/signIn")}
                $customStyles={{
                  width: "100px",
                  height: "45px",
                  textTransform: "uppercase",
                }}
              >
                Log in
              </Button>
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

export default Header;

const RootContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const AppbarContainer = styled.div`
  height: 4rem;
  .css-1yo9slo-MuiToolbar-root {
    padding: 0;
  }
`;

const OutletContainer = styled.div`
  height: calc(100vh - 4rem);
`;
