import VoxeetSDK from "@voxeet/voxeet-web-sdk";
export const initializeToken = () => {
  const token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkb2xieS5pbyIsImlhdCI6MTY4NTEyNDQ1Miwic3ViIjoid195UDNYVDJaVy1RbmZ6TXR5V1MwZz09IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9DVVNUT01FUiJdLCJ0YXJnZXQiOiJzZXNzaW9uIiwib2lkIjoiOTg3MDFkMDctZWEyNi00ODM1LWJhM2ItMTBiMGU4MjkyODcyIiwiYWlkIjoiYjU3NmZhYjctY2JiMC00NWRhLTg1YWQtOGQ5MmZhZWEyNDY5IiwiYmlkIjoiOGEzNjgwZGU4ODJjOTlmNTAxODgyZmUxNGJmMTZiMmIiLCJleHAiOjE2ODUyMTA4NTJ9.tnk_LMFaxam6c2EDBJ5SyiRFKuJwyoVigxMpZZ_eUd1RL0tEnQ6nnFOgeyUMcuYTXWAsS-Ud-5bztIb0_tbeJQ";
  VoxeetSDK.initializeToken(
    token,
    () => new Promise((resolve) => resolve(token)),
    console.log("WEPAAAAAAAAAA iniciamo"),
  );
  return token;
};
