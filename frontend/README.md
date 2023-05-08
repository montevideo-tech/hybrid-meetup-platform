# Welcome to Hibridly frontend

## Get started

### Requirements

- NodeJS LTS or Latest

### Run the project

```
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Working with MUX Spaces

Follow the MUX docs [here](https://docs.mux.com/guides/video/build-real-time-video-experiences).

> If you want to quickly generate a one-off JWT for testing, you might want to try the [mux-cli](https://github.com/muxinc/cli), and use the `spaces:sign` [command](https://github.com/muxinc/cli#mux-spacessign-space-id) to quickly get a JWT.

Set the following env variable to the signed JWT:

- `VITE_MUX_SPACE_JWT`

You can find the docs for the MUX Spaces SDK [here](https://devdocs.mux.com/spaces-web/latest/modules.html).
