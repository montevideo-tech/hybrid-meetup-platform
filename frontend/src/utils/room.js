const setRemoteStreamsRef = (
  remoteStreamsRef,
  comparator,
  setRemoteStreams,
  data,
) => {
  remoteStreamsRef.current = data;
  const remoteStreamsSorted = Array.from(data.values).sort(comparator);
  setRemoteStreams(remoteStreamsSorted);
};

export default setRemoteStreamsRef;
