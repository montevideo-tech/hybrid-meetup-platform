# Hybridly

Summer Camp WebRTC challenge. The goal of this project is to create a Hybrid meetup platform with exchangable WebRTC provider.

Seeing how the communities across the world host their events, we see a variety of tools (Zoom, Meet, Gather Town) and others do it in person.
These tools are made for meetings, not for events and lack the proper tools to account for questions and answers (without distractions), doing questions to the public as surveys and it's hard to do networking among others.

We want to gift the community a tool for hybrid events.
Built by video-devs for video-devs 💚

## Getting started

The frontend project is a React app using vite.

For the backend side, we are using [Supabase](https://supabase.com/) for faster development. This tool offers a cloud-based solution or a self-hosted deployment. We recommend using the cloud-based solution to speed up the process.

To use Supabase, follow these steps:

1. Create an account in [Supabase](https://supabase.com/).
2. Create a new project.
3. Copy the `project URL` and `anon API key` and paste them in the `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` variables respectively in the `frontend/src/lib/constants.js` file inside the React project.
4. For more details, refer to the [_getting started_](https://supabase.com/docs/guides/getting-started/tutorials/with-react#github) page from Supabase.

If you prefer to use the self-hosted solution, we recommend using the Docker proposal. Refer to the [Supabase documentation](https://supabase.com/docs/guides/self-hosting/docker) for more information on how to do so.

To start the app, follow these steps:

1. Run `npm install` and `npm start` in the `Frontend` directory to launch the project.
2. In the frontend folder, create a `.env` file and set up the following environment variables:
   - `VITE_SUPABASE_URL` (as discussed above)
   - `VITE_SUPABASE_KEY` (as discussed above)
   - `VITE_SUPABASE_FUNCTIONS_URL` (as discussed above)
   - `VITE_WEBRTC_PROVIDER_NAME` - Name of the provider we are going to use.
   - `VITE_DOLBY_API_KEY` - Dolby API key, which can be obtained from [here](https://dashboard.dolby.io/dashboard/applications/410015/keys)
3. Run the following command in the frontend folder: `npm run start`

## Current status of the product

Currently, the product isn't completed. So far, we have added features for Mux and then pushed to have the same features with the Dolby WebRTC provider.

| Feature                           | Mux | Dolby | Observations                                                                                                                                                                                                                                                                                            |
| --------------------------------- | --- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ShareScreen                       | ✅  | ❌    | We tried to implement it in Dolby but couldn't make it, the progress made is on the [implement-dolby-screen-share](https://github.com/montevideo-tech/hybrid-meetup-platform-private/tree/implement-dolby-screen-share)                                                                                 |
| Turn camera on/off                | ✅  | ✅    |                                                                                                                                                                                                                                                                                                         |
| Turn microphone on/off            | ✅  | ✅    |                                                                                                                                                                                                                                                                                                         |
| See remote participants in a call | ✅  | ✅    |                                                                                                                                                                                                                                                                                                         |
| Remove participant                | ✅  | ❌    | Not implemented for Dolby                                                                                                                                                                                                                                                                               |
| Mute participant                  | ✅  | ❌    | Not implemented for Dolby                                                                                                                                                                                                                                                                               |
| Mute all users that aren't admin  | ✅  | ❌    | Not implemented for Dolby                                                                                                                                                                                                                                                                               |
| Show user that is speaking        | ✅  | ❌    | Currently, Dolby.io doesn't have an event to detect when a user started speaking                                                                                                                                                                                                                        |
| Remove participant from a call    | ✅  | ❌    | Not implemented for Dolby                                                                                                                                                                                                                                                                               |
| Screen recording                  | ❌  | ❌    | We implemented the changes in [Implement-Screen-Recording-using-JS-Library](https://github.com/montevideo-tech/hybrid-meetup-platform-private/tree/Implement-Screen-Recording-using-JS-Library) branch. The problem we had is that we couldn't find a way to record the audio of the local participant. |

## User roles

User roles are roles defined by the time the user was created, by that moment the user aquires the following rights for every room.

| Permission                 | Admin | Regular Participant |
| -------------------------- | ----- | ------------------- |
| Create, Edit, Remove Rooms | ✅    | ❌                  |
| Kick Participants          | ✅    | ❌                  |
| Mute Participants          | ✅    | ❌                  |
| Mute All (Except Admins)   | ✅    | ❌                  |

## User permissions

During a call an admin can give permissions to Regular participants to do other stuff.
This stage isn't completed but what we planned was to follow the following table.

| Permission                  | Host | Presenter | Participant | Implemented |
| --------------------------- | ---- | --------- | ----------- | ----------- |
| Share Screen                | ✅   | ✅        | ❌          | ✅          |
| Mute Everyone               | ✅   | ❌        | ❌          | ❌          |
| Kick participant            | ✅   | ❌        | ❌          | ❌          |
| Mute a specific participant | ✅   | ❌        | ❌          | ❌          |

# AWS Deployment

We have a deployment on AWS in the Qualabs account with a domain created using Certificate Manager. Currently, it is disabled as the project is not active. If you want to enable it again, you need to access the CloudFront service, enable the distributions, and also activate the CodePipeline service, which is also disabled.
To ask for access and permissions to the Qualabs AWS account, you can reach out to Maxi Pollinger, who can provide you with the necessary details.


## Extra documentation

- [Onboarding Hybridly](https://docs.google.com/document/d/1xAtQFdGuxCulLFVWubGiTnqwpwXmdHmXZupWRrKS2AI/edit?usp=sharing) here you'll find everything you need to know about Hybridly and how to get started.
- [Minutas CleanCode](https://docs.google.com/document/d/1vry3s-TRHS9hC-U8DJGXtwaDB242HV-wucDEU7fknrI/edit?usp=sharing) here you'll find a summary of some chapters of Robert C Martin's Book Clean Code, this was read during the development of this project. The notes were taken in spanish since all of the developers in this project are spanish-speaking devs.

