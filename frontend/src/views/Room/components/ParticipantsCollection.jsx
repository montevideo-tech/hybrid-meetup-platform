import React, { useMemo } from "react";
import { MAX_PARTICIPANTS_PER_PAGE } from "../../../lib/constants";
import Audio from "../../../components/Audio";
import Video from "./Video";
import { ROLES } from "../../../utils/supabaseSDK/roles";
import styled from "styled-components";

function ParticipantsCollection(props) {
  const {
    participantsCount,
    children,
    localParticipant,
    permissionRole,
    localVideoStream,
    localAudioStream,
    localName,
  } = props;
  const currentParticipants = useMemo(() => {
    return children;
  }, [children]);

  const onClickRemove = (r) => {
    localParticipant.removeRemoteParticipant(r);
  };

  const onClickMute = (r, isMuted) => {
    localParticipant.blockMuteRemoteParticipant(r, isMuted);
  };

  const colums = Math.round((participantsCount + 1) / 2);
  const isAlone = currentParticipants.length === 0;
  const oddNumber = !isAlone && currentParticipants.length % 2 === 0; //I check that it is an even number since the local participant is added.
  const twoParticipant = currentParticipants.length === 1;
  return (
    <>
      {children.length !== 0 &&
        children.map(({ audioStream, name }) => (
          <Audio key={name} stream={audioStream} />
        ))}
      <Content $colums={colums} $twoParticipant={twoParticipant}>
        {children.length !== 0 &&
          currentParticipants
            .slice(0, 9)
            .map(({ videoStream, name, audioMuted, videoMuted, speaking }) => (
              <Video
                permissionRole={permissionRole}
                key={name}
                stream={videoStream}
                isAudioMuted={audioMuted || false}
                isVideoMuted={videoMuted || false}
                isSpeaking={speaking || false}
                name={name}
                onClick={() => onClickRemove(name)}
                onClickMute={() => onClickMute(name, audioMuted)}
                twoParticipant={twoParticipant}
              />
            ))}
        {localVideoStream && (
          <Video
            permissionRole=""
            key={localName}
            stream={localVideoStream}
            isAudioMuted
            isVideoMuted={localVideoStream.muted || false}
            isSpeaking={false}
            name={localName}
            onClick={() => onClickRemove(localName)}
            onClickMute={() => onClickMute(localName, localAudioStream.muted)}
            oddNumber={oddNumber}
            isAlone={isAlone}
            twoParticipant={twoParticipant}
          />
        )}
      </Content>
    </>
  );
}

const Content = styled.div`
  ${({ $colums, $twoParticipant }) => `
    display: grid;
    grid-template-columns: repeat(${$colums}, 1fr);
    gap: 20px;
    padding: 20px 30px;
    justify-items: ${$twoParticipant ? "center" : "stretch"};
    justify-content: center;
  `}
`;

export default ParticipantsCollection;
