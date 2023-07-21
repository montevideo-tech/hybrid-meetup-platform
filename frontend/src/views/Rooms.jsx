import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Colors } from "../themes/colors";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../lib/api";
import { createRoom, addRoomToDb, giveUserRoleOnRoom } from "../actions";
import { ROLES } from "../utils/supabaseSDK/roles";
import RoomsList from "../components/RoomsList/RoomsList";
import RoomsListSkeleton from "../components/RoomsList/RoomsListSkeleton";
import { store } from "../store";
import close from "../assets/close.svg";
import Snackbar from "../components/SnackbarComponent";
import Spinner from "../components/Spinner";
import { getRoomsData, getUsersData } from "../utils/supabaseSDK/shared";
import Icon from "../components/Icon";

function Rooms() {
  const [roomsList, setRoomsList] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const errorState = store.getState().room?.snackbarAlert;

  const onRoomCreated = async (data) => {
    const onSuccess = () => {
      setCreatingRoom(false);
      setNewRoomName("");
    };
    const onError = (res) => {
      setCreatingRoom(false);
      const {
        response: {
          data: { error },
        },
      } = res;
      console.error(
        `An error occurred while adding the room to DB: ${error.message}`,
      );
    };
    dispatch(addRoomToDb(data, onSuccess, onError));
  };

  const onSubmit = async () => {
    if (!newRoomName) {
      return;
    }

    setShowNameInput(false);
    setCreatingRoom(true);
    const onSuccess = (res) => {
      const {
        data: { data },
      } = res;
      if (!data?.id) {
        console.error(new Error("Bad response from provider: no room ID"));
        return;
      }

      onRoomCreated({
        ...data,
        name: newRoomName,
        providerId: data.id,
        creatorEmail: user.email,
      });
    };
    const onError = (res) => {
      setCreatingRoom(false);
      const {
        response: {
          data: { error },
        },
      } = res;
      console.error(`An error occurred while creating room: ${error.message}`);
    };
    dispatch(createRoom(onSuccess, onError));
  };

  const handleTableEvent = (payload) => {
    const { new: newRoom } = payload;
    switch (payload.eventType) {
      case "INSERT":
        setRoomsList((list) => [...list, newRoom]); // functional update
        break;
      case "UPDATE":
        setRoomsList((list) =>
          list.map((room) => {
            if (room.id === newRoom.id) {
              return newRoom;
            }
            return room;
          }),
        );
        break;
      case "DELETE":
        setRoomsList((list) =>
          list.filter((room) => room.id !== payload.old.id),
        );
        break;
      default:
    }
  };

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const handleAdminHostPermission = async () => {
    if (roomsList) {
      roomsList.forEach(async (room) => {
        const roomId = room.providerId;
        if (currentUser?.role === ROLES.ADMIN) {
          await giveUserRoleOnRoom(currentUser.email, roomId, ROLES.HOST);
        }
      });
    }
  };
  useEffect(() => {
    handleAdminHostPermission();
  }, [roomsList]);

  useEffect(() => {
    const getRoomsList = async () => {
      setLoadingRooms(true);

      try {
        const roomsQuery = await getRoomsData();
        if (roomsQuery.error) {
          throw roomsQuery.error;
        }

        const usersQuery = await getUsersData();
        if (usersQuery.error) {
          throw usersQuery.error;
        }

        setRoomsList(
          roomsQuery.data.map((room) => {
            const { id, providerId, name } = room;
            const createdBy = usersQuery.data.find(
              (u) => u.email === room.creatorEmail,
            );

            return {
              id,
              providerId,
              name,
              createdBy,
            };
          }),
        );

        // Listen to table events
        supabase
          .channel("roomList")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "rooms" },
            handleTableEvent,
          )
          .subscribe();
      } catch (err) {
        console.error(`Error getting rooms list: ${err.message}`);
      } finally {
        setLoadingRooms(false);
      }
    };
    getRoomsList();
  }, []);

  const renderCreateRoomButton = () =>
    showNameInput ? (
      <StyledForm>
        <Input
          placeholder="Name of new room"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          height="41px"
          width="408px"
        />
        <Button
          onClick={onSubmit}
          disabled={loadingRooms || creatingRoom || !newRoomName}
          type="submit"
          primary
          width="100px"
          height="45px"
        >
          Done
        </Button>
        <Button
          onClick={() => {
            setShowNameInput(false);
            setNewRoomName("");
          }}
          primary
          width="45px"
          height="45px"
          customStyles={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon icon={close} name="close" />
        </Button>
      </StyledForm>
    ) : (
      <Button
        onClick={() => setShowNameInput(true)}
        disabled={loadingRooms || creatingRoom}
        secondary
        width="190px"
        height="45px"
      >
        {creatingRoom ? <Spinner size={20} /> : "Create new room +"}
      </Button>
    );

  return (
    <Container>
      <ContainerWithTitleAndButton>
        <Title>Choose your room</Title>
        {user?.role === "admin" && renderCreateRoomButton()}
      </ContainerWithTitleAndButton>
      {loadingRooms ? <RoomsListSkeleton /> : <RoomsList list={roomsList} />}
      {errorState && <Snackbar message={errorState} severity="error" />}
    </Container>
  );
}

const Container = styled.div`
  padding: 30px;
`;

const ContainerWithTitleAndButton = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 40px;
`;

const Title = styled.div`
  font-family: "Poppins", sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 30px;
  line-height: 45px;
  color: ${Colors.blackPurple};
`;

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 0.2fr 0.1fr;
  column-gap: 10px;
`;

export default Rooms;
