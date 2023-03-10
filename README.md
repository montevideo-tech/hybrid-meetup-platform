# Hybrid Event Meetup project for #video-devs

Summer Camp WebRTC challenge. This project can be used to host and run hybrid meetups for the video community. 

Seeing how the communities across the world host their events, we see a variety of tools (Zoom, Meet, Gather Town) and others do it in person.
These tools are made for meetings, not for events and lack the proper tools to account for questions and answers (without distractions), doing questions to the public as surveys and it's hard to do networking among others.

We want to gift the community a tool for hybrid events.
Built by video-devs for video-devs 💚

# How to start contributing to the project

Clone the repository
`git clone git@github.com:montevideo-tech/hybrid-meetup-platform.git`

The frontend project is a React app bootstrapped via [CRA](https://create-react-app.dev/).

We are using [Supabase](https://supabase.com/) for faster development. This tool offers a cloud-based solution or a self-hosted deployment. We recommend using the cloud-based solution in order to speed up the process.
In order to use Supabase, you first need to create an account in [Supabase](https://supabase.com/), then create a new project, then copy the `project URL` and `anon API key` and paste them in the `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY` in the `frontend\src\lib\constants.js` file inside the React project.
For more details, use the [_getting started_](https://supabase.com/docs/guides/getting-started/tutorials/with-react#github) page from Supabase.

If you rather use the self-hosted solution, we recommend using the Docker proposal. Use this [Supabase documentation](https://supabase.com/docs/guides/self-hosting/docker) for more information on how to do so.

To start the app it's just a 2-step process:
`npm install` and `npm start` in the `Frontend` directory to launch the project.
