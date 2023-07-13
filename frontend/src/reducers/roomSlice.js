import { createSlice } from "@reduxjs/toolkit";
import { ROLES } from "../utils/supabaseSDK/roles";

export const roomSlice = createSlice({
  name: "currentRoom",
  initialState: {
    id: null,
    participants: [],
    snackbarAlert: null,
  },
  reducers: {
    initRoom: (state, action) => {
      state.id = action.payload.id;
      state.participants = action.payload.participants;
    },
    updateParticipants: (state, action) => {
      state.participants = action.payload.participants;
    },
    // Updates participant if it's already created
    addUpdateParticipant: (state, action) => {
      const participantIndex = state.participants.findIndex(
        (part) => part.name === action.payload.name,
      );
      if (participantIndex > -1) {
        const newState = [...state.participants];
        newState[participantIndex].name = action.payload.name;
        newState[participantIndex].role = action.payload.role;
        newState[participantIndex].id = action.payload.id;
        state.participants = newState;
      } else {
        state.participants = [
          ...state.participants,
          {
            name: action.payload.name,
            role: action.payload.role,
            id: action.payload.id,
          },
        ];
      }
    },
    removeRole: (state, action) => {
      const participantIndex = state.participants.findIndex(
        (part) => part.id === action.payload.id,
      );
      if (participantIndex > -1) {
        const newState = [...state.participants];
        newState[participantIndex].role = ROLES.GUEST;
        newState[participantIndex].id = null;
        state.participants = newState;
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(
        (pt) => pt.name !== action.payload.name,
      );
    },
    cleanRoom: (state) => {
      state.id = null;
      state.participants = [];
    },
    SnackbarAlert: (state, action) => {
      state.snackbarAlert = action.payload.error;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  initRoom,
  updateParticipants,
  addUpdateParticipant,
  removeParticipant,
  removeRole,
  cleanRoom,
  SnackbarAlert,
} = roomSlice.actions;

export default roomSlice.reducer;
