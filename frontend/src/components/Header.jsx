import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { logout } from "../reducers/userSlice";
import { Hybridly } from "../components/hybridly/Hybridly";
import DropdownMenu from "./DropdownMenu";
import { MenuItem } from "@mui/material";
import { Colors } from "../themes/colors";
import line from "../assets/line.svg";
import user from "../assets/user.svg";
import Button from "../components/Button";
import Icon from "../components/Icon";

export function Header() {
  const [auth, setAuth] = useState(null);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(currentUser);
  }, [currentUser]);

  const handleSignOut = () => {
    // TODO: invalidate token
    setAuth(null);
    dispatch(logout());
    navigate("/");
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
              <DropdownMenu
                label={<Icon name="user" icon={user} />}
                buttonStyles={{
                  width: "100px",
                  height: "45px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 16px",
                }}
              >
                <EmailContainer>
                  <span>{currentUser.email}</span>
                  <Icon name="line" icon={line} />
                </EmailContainer>
                <MenuItem>
                  <Button
                    onClick={handleSignOut}
                    primary
                    width="100%"
                    height="25px"
                    customStyles={{
                      fontWeight: "600",
                      fontSize: "0.65rem",
                      lineHeight: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Log out
                  </Button>
                </MenuItem>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => navigate("/signIn")}
                secondary
                width="100px"
                height="45px"
                customStyles={{
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

const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 14px 0 14px;
  img {
    width: 100%;
    height: 2px;
    object-fit: cover;
  }
  span {
    color: ${Colors.blackPurple};
    font-weight: 500;
    font-size: 0.8rem;
    line-height: 0.938rem;
    margin-bottom: 6px;
  }
`;
