import React, { useRef, useEffect } from "react";

function Audio(props) {
  const audioref = useRef();

  const { stream } = props;

  useEffect(() => {
    if (!stream) {
      return;
    }

    if (audioref.current && audioref.current.srcObject !== stream) {
      audioref.current.srcObject = stream;
    }
  }, [stream]);

  return <audio ref={audioref} autoPlay />;
}

export default Audio;
