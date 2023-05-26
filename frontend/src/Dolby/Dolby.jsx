import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import React, { useEffect, useState } from "react";

const Dolby = () => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  console.log(roomId);
  const initializeVoxeet = async () => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY4NTEyNTM5NCwic3ViIjoid195UDNYVDJaVy1RbmZ6TXR5V1MwZz09IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJ0YXJnZXQiOiJzZXNzaW9uIiwib2lkIjoiOTg3MDFkMDctZWEyNi00ODM1LWJhM2ItMTBiMGU4MjkyODcyIiwiYWlkIjoiYjU3NmZhYjctY2JiMC00NWRhLTg1YWQtOGQ5MmZhZWEyNDY5IiwiYmlkIjoiOGEzNjgwZGU4ODJjOTlmNTAxODgyZmUxNGJmMTZiMmIiLCJleHAiOjE2ODUyMTE3OTR9.YN0KFZeMUWRKxZSkfF0_bsxYD33FeThEuC7RxGqcIiSmquajlSi6UuBabPgR0v4LTbAC5E_XGwkcs-aLO3TDpA";
    try {
      VoxeetSDK.initializeToken(token, () => Promise.resolve(token));
      VoxeetSDK.session.open({ name: "John Doe" });
    } catch (error) {
      console.error("Error al inicializar el SDK de Voxeet:", error);
    }
  };

  const createConferenceRoom = async () => {
    try {
      const conference = await VoxeetSDK.conference.create({ alias: roomName });
      console.log(conference.id);
      setRoomId(conference.id);
      console.log("Sala de conferencias creada. ID:", roomId);
    } catch (error) {
      console.error("Error al crear la sala de conferencias:", error);
    }
  };

  const joinConference = async () => {
    const conference = await VoxeetSDK.conference.fetch(roomId);

    const constraints = {
      audio: true,
      video: true, // No video on join
    };

    await VoxeetSDK.conference.join(conference, { constraints: constraints });
    const videoConstraints = {
      width: 1280,
      height: 720,
    };
    await VoxeetSDK.video.local.start(videoConstraints);
    VoxeetSDK.conference.on("streamAdded", (participant, stream) => {
      if (stream.getVideoTracks().length) {
        // Add the video element to the UI for the `participant`
      }
    });
  };

  const closeConference = async () => {
    try {
      await VoxeetSDK.conference.leave();
      await VoxeetSDK.session.close();
      console.log("Conferencia cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar la conferencia:", error);
    }
  };

  useEffect(() => {
    initializeVoxeet();
  }, []);

  return (
    <div>
      <h1>Crear Sala de Conferencias</h1>
      <input
        type="text"
        placeholder="Nombre de la sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={createConferenceRoom}>Crear Sala</button>
      <div>
        <button onClick={closeConference}>Cerrar Conferencia</button>
      </div>
      <div>
        <button onClick={joinConference}>Unirse a la Conferencia</button>
        <video id="local-video" autoPlay muted />
      </div>
    </div>
  );
};

export default Dolby;
