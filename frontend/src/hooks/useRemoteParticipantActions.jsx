import { useState } from "react";

export const useRemoteParticipantActions = () => {
  const [isEnableToUnmute, setIsEnableToUnmute] = useState(true);
  return {
    isEnableToUnmute,
    setIsEnableToUnmute,
  };
};
