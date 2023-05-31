import VoxeetSDK from "@voxeet/voxeet-web-sdk";
import React, { useEffect, useState } from "react";

const Dolby = () => {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [videoStreams, setVideoStreams] = useState([]);
  const [participantName, setParticipantName] = useState("");

  const initializeVoxeet = async () => {
    const token =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY4NTM2ODExOSwic3ViIjoid195UDNYVDJaVy1RbmZ6TXR5V1MwZz09IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJ0YXJnZXQiOiJzZXNzaW9uIiwib2lkIjoiOTg3MDFkMDctZWEyNi00ODM1LWJhM2ItMTBiMGU4MjkyODcyIiwiYWlkIjoiYjU3NmZhYjctY2JiMC00NWRhLTg1YWQtOGQ5MmZhZWEyNDY5IiwiYmlkIjoiOGEzNjgwZGU4ODJjOTlmNTAxODgyZmUxNGJmMTZiMmIiLCJleHAiOjE2ODU0NTQ1MTl9.AbXIfxhIrEDOYu0GdnSFq6RoHQHNgKs6tYPSn8rrx8AgHciNedkKyXaH38knxhW4b0U72SQWsrp_4pYCdrd0Og";
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
      // Solicitar los permisos de cámara y micrófono
      setRoomId(conference.id);
      await requestMediaPermissions();
      // Unirse a la conferencia
      const constraints = {
        audio: true,
        video: true,
      };
      await VoxeetSDK.conference.join(conference, { constraints: constraints });
      setIsJoined(true); // Establecer el estado de unión a true
      console.log("Sala de conferencias creada. ID:", conference.id);
    } catch (error) {
      console.error("Error al crear la sala de conferencias:", error);
    }
  };

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      const localVideoElement = document.getElementById("local-video");
      if (localVideoElement) {
        localVideoElement.srcObject = stream;
      }

      console.log("Permisos de cámara y micrófono concedidos");

      VoxeetSDK.conference.on("streamAdded", handleStreamAdded);
      VoxeetSDK.conference.on("streamRemoved", handleStreamRemoved);
    } catch (error) {
      console.error(
        "Error al solicitar los permisos de cámara y micrófono:",
        error,
      );
    }
  };
  const handleStreamAdded = (participant, stream) => {
    // Actualizar el estado de los flujos de video
    setVideoStreams((prevStreams) => [...prevStreams, stream]);
  };

  const handleStreamRemoved = (participant, stream) => {
    // Actualizar el estado de los flujos de video
    setVideoStreams((prevStreams) =>
      prevStreams.filter((s) => s.id !== stream.id),
    );
  };

  const closeConference = async () => {
    try {
      await VoxeetSDK.conference.leave();
      await VoxeetSDK.session.close();
      setVideoStreams([]);
      setIsJoined(false); // Establecer el estado de unión a false
      console.log("Conferencia cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar la conferencia:", error);
    }
  };

  const joinConferenceRoom = async () => {
    try {
      // Solicitar los permisos de cámara y micrófono
      await requestMediaPermissions();
      // Obtener la conferencia existente por su ID
      const conference = await VoxeetSDK.conference.fetch(roomId);
      // Unirse a la conferencia existente
      const constraints = {
        audio: true,
        video: true,
      };
      await VoxeetSDK.conference.join(conference.id, {
        constraints: constraints,
        userInfo: {
          name: participantName, // Nombre del segundo participante
        },
      });

      setIsJoined(true); // Establecer el estado de unión a true
      console.log("Unido a la conferencia existente");
    } catch (error) {
      console.error("Error al unirse a la conferencia existente:", error);
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
        placeholder="Nombre del participante"
        value={participantName}
        onChange={(e) => setParticipantName(e.target.value)}
      />
      <button onClick={joinConferenceRoom}>Unirse a la Sala</button>
      <input
        type="text"
        placeholder="Nombre de la sala"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={createConferenceRoom}>Crear Sala</button>
      {isJoined && (
        <div>
          <button onClick={closeConference}>Cerrar Conferencia</button>
        </div>
      )}
      {isJoined && (
        <div>
          {videoStreams.map((stream) => (
            <video
              key={stream.id}
              autoPlay
              playsInline
              ref={(videoRef) => {
                if (videoRef) {
                  videoRef.srcObject = stream;
                }
              }}
            />
          ))}
        </div>
      )}
      <div id="participants">
  <h3>Participants</h3>
  <ul id="participants-list"></ul>
</div>
    </div>
  );
};

export default Dolby;
