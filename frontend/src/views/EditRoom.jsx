import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { List, ListItem } from "@mui/material";
import styled from "styled-components";
import { giveUserRoleOnRoom } from "../actions";
import { deleteRole, subscribeToRoleChanges, ROLES } from "../utils/roles";
import { updateParticipantRoles } from "../utils/helpers";
import { Card, Button, Input } from "../themes/componentsStyles";
import { Colors } from "../themes/colors";
import { supabase } from "../lib/api";
import edit from "../assets/edit.svg";
import deleteGray from "../assets/deleteGray.svg";
import deletePurple from "../assets/deletePurple.svg";
import { addUpdateParticipant, removeRole } from "../reducers/roomSlice";

export async function roomLoader({ params }) {
  return params.roomId;
}

function EditRoom() {
  const participants = useSelector((state) => state.room.participants);
  const dispatch = useDispatch();
  const roomId = useLoaderData();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [email, setEmail] = useState("");
  const [roleToAdd, setRoleToAdd] = useState("");
  const [recentlyAddedHost, setRecentlyAddedHost] = useState("");
  const [recentlyAddedPresenter, setRecentlyAddedPresenter] = useState("");
  // TODO:
  // get actual hosts/presenters from db
  const [roles, setRoles] = useState({ hosts: [], presenters: [] });

  useEffect(() => {
    const handleAddRole = async () => {
      const currentHosts = roles.hosts;
      const currentPresenters = roles.presenters;
      await giveUserRoleOnRoom(email, roomId, roleToAdd);

      if (roleToAdd === "host") {
        if (recentlyAddedHost === email) {
          setRoles({
            hosts: [email, ...currentHosts],
            presenters: [...currentPresenters],
          });
        } else {
          setRoles({
            hosts: [...currentHosts, email],
            presenters: [...currentPresenters],
          });
        }
      }
      if (roleToAdd === "presenter") {
        if (recentlyAddedPresenter === email) {
          setRoles({
            hosts: [...currentHosts],
            presenters: [email, ...currentPresenters],
          });
        } else {
          setRoles({
            hosts: [...currentHosts],
            presenters: [...currentPresenters, email],
          });
        }
      }
      setEmail("");
    };
    handleAddRole();
  }, [recentlyAddedHost, recentlyAddedPresenter]);

  const getRoles = () => {
    const rolesCopy = { ...roles };
    const newPresenters = rolesCopy.presenters.slice();
    const newHosts = rolesCopy.hosts.slice();

    participants.forEach((participant) => {
      if (
        participant.role === ROLES.PRESENTER &&
        !newPresenters.includes(participant.name)
      ) {
        newPresenters.push(participant.name);
      } else if (
        participant.role === ROLES.HOST &&
        !newHosts.includes(participant.name)
      ) {
        newHosts.push(participant.name);
      }
    });

    setRoles({ hosts: newHosts, presenters: newPresenters });
  };

  const handleDeleteRole = async (e, r) => {
    const currentHosts = roles.hosts;
    const currentPresenters = roles.presenters;
    await deleteRole(e);
    const newRoles = {
      hosts: [...currentHosts],
      presenters: [...currentPresenters],
    };
    newRoles[r].every((element, index) => {
      if (element === e) {
        newRoles[r].splice(index, 1); // remove
        return false; // break out of loop
      }
      return true; // keep looping
    });
    const participant = participants.find((object) => object.name === e);
    dispatch(removeRole({ id: participant.id }));
    setRoles(newRoles);
  };

  const handleRoleChange = (payload) => {
    if (payload.eventType === "INSERT") {
      const { id, userEmail } = payload;
      const permission = payload["rooms-permission"].name;
      dispatch(
        addUpdateParticipant({
          name: userEmail,
          role: permission,
          id,
        }),
      );
    }
    // Supabase realtime only sends the ID that was deleted from the rooms-data table
    if (payload.eventType === "DELETE") {
      const { id } = payload.old;
      dispatch(removeRole({ id }));
    }
  };

  useEffect(() => {
    getRoles();
  }, [participants.length]);

  useEffect(() => {
    updateParticipantRoles(roomId, dispatch);
  }, [roles]);

  useEffect(() => {
    const getRoomName = async () => {
      try {
        const roomsQuery = await supabase.from("rooms").select();
        if (roomsQuery.error) {
          throw roomsQuery.error;
        }
        setRoomName(
          roomsQuery.data.filter((room) => room.providerId === roomId)[0].name,
        );
      } catch (err) {
        console.error(`Error getting room name: ${err.message}`);
      }
    };
    getRoomName();
    subscribeToRoleChanges(roomId, handleRoleChange);
  }, []);

  return (
    <Container>
      <Card
        $customStyles={{
          flexDirection: "column",
          alignItems: "start",
          width: "70%",
          padding: "40px",
        }}
      >
        <Title>Edit room</Title>
        <TitleRoomContainer>
          <Subtitle>{roomName}</Subtitle>
          <img width="17px" height="17px" src={edit} alt="edit title room" />
        </TitleRoomContainer>
        <StyledContainer>
          <StyledInput
            placeholder="Email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            $customStyles={{ padding: "0 20px" }}
          />
          <StyledSelect
            label="Role"
            value={roleToAdd}
            defaultValue=""
            onChange={(e) => setRoleToAdd(e.target.value)}
          >
            <StyledOption value="" disabled hidden>
              Role
            </StyledOption>
            <StyledOption value="presenter">Presenter</StyledOption>
          </StyledSelect>
          <Button
            onClick={() =>
              roleToAdd === "presenter"
                ? setRecentlyAddedPresenter(email)
                : setRecentlyAddedHost(email)
            }
            disabled={roleToAdd === ""}
            $primary
            $customStyles={{ height: "100%", width: "100%" }}
          >
            Add
          </Button>
          <Button
            $primary
            onClick={() => navigate(`/rooms/${roomId}`)}
            $customStyles={{ height: "100%", width: "100%" }}
          >
            Go to Room
          </Button>
        </StyledContainer>
        <ListsContainer>
          <ListContainer $host>
            <Subtitle $fontSize="1.3rem">Hosts</Subtitle>
            <List>
              {roles.hosts.map((e) => {
                return (
                  <>
                    {recentlyAddedHost === e ? (
                      <ListItem
                        key={e}
                        secondaryAction={
                          <img
                            width="17px"
                            src={deletePurple}
                            alt="delete"
                            onClick={() => {
                              handleDeleteRole(e, "presenters");
                            }}
                          />
                        }
                        sx={{ padding: "8px 0" }}
                      >
                        <Email $isRecentlyAdded>{e}</Email>
                      </ListItem>
                    ) : (
                      <ListItem
                        key={e}
                        secondaryAction={
                          <img
                            width="17px"
                            src={deleteGray}
                            alt="delete"
                            onClick={() => {
                              handleDeleteRole(e, "presenters");
                            }}
                          />
                        }
                        sx={{ padding: "8px 0" }}
                      >
                        <Email>{e}</Email>
                      </ListItem>
                    )}
                  </>
                );
              })}
            </List>
          </ListContainer>
          <ListContainer $presenter>
            <Subtitle $fontSize="1.3rem">Presenters</Subtitle>
            <List>
              {roles.presenters.map((e) => {
                return (
                  <>
                    {recentlyAddedPresenter === e ? (
                      <ListItem
                        key={e}
                        secondaryAction={
                          <img
                            width="17px"
                            src={deletePurple}
                            alt="delete"
                            onClick={() => {
                              handleDeleteRole(e, "presenters");
                            }}
                          />
                        }
                        sx={{ padding: "8px 0" }}
                      >
                        <Email $isRecentlyAdded>{e}</Email>
                      </ListItem>
                    ) : (
                      <ListItem
                        key={e}
                        secondaryAction={
                          <img
                            width="17px"
                            src={deleteGray}
                            alt="delete"
                            onClick={() => {
                              handleDeleteRole(e, "presenters");
                            }}
                          />
                        }
                        sx={{ padding: "8px 0" }}
                      >
                        <Email>{e}</Email>
                      </ListItem>
                    )}
                  </>
                );
              })}
            </List>
          </ListContainer>
        </ListsContainer>
      </Card>
    </Container>
  );
}

export default EditRoom;

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 3%;
  font-family: "Poppins";
`;

const Title = styled.h1`
  color: ${Colors.blackPurple};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

const TitleRoomContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid ${Colors.purple};
  margin-bottom: 35px;
  padding-bottom: 15px;
`;

const Subtitle = styled.h2`
  color: ${Colors.purple};
  font-size: ${(props) => (props.$fontSize ? props.$fontSize : "1.6rem")};
  font-weight: 600;
  margin: 0 8px 3px 0;
`;

const StyledContainer = styled.div`
  display: grid;
  column-gap: 13px;
  grid-template-columns: auto 125px 100px 150px;
  height: 40px;
  width: 100%;
`;

const StyledInput = styled(Input)`
  ::placeholder {
    opacity: 100%;
  }
`;

const StyledSelect = styled.select`
  border: 2px solid ${Colors.purple};
  background-color: ${Colors.lightPurple};
  border-radius: 34px;
  padding: 0 10px;
  color: ${Colors.davyGray};
  font-size: 1rem;
  font-family: "Poppins";
  font-weight: 500;
  :focus-visible {
    outline: none !important;
    box-shadow: 0 0 2px ${Colors.purple};
  }
`;

const StyledOption = styled.option`
  font-size: 1rem;
  font-family: "Poppins";
  font-weight: 500;
`;

const ListsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
  width: 100%;
  img {
    cursor: pointer;
  }
`;

const ListContainer = styled.div`
  ${(props) =>
    props.$presenter
      ? `
      padding-left: 50px;
      border-left: 2px solid ${Colors.purple}
  `
      : `
      padding-right: 50px;
  `}
`;

const Email = styled.p`
  margin: 0 15px 0 0;
  font-size: 1rem;
  color: ${(props) =>
    props.$isRecentlyAdded ? Colors.purple : Colors.davyGray};
`;
