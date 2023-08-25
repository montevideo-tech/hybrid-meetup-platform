import { comparator } from "./helpers";

const setRemoteStreamsRef = (remoteStreamsRef, setRemoteStreams, data) => {
  remoteStreamsRef.current = data;
  const remoteStreamsSorted = Array.from(data.values()).sort(comparator);
  setRemoteStreams(remoteStreamsSorted);
};

export default setRemoteStreamsRef;
