# MeetSphere

A full-stack video meeting web app with real-time video calls, chat, and meeting history — built with React, Node.js, WebRTC, and Socket.IO.

## Features

- **User registration & login** — accounts are stored in MongoDB with passwords hashed using bcrypt.
- **Token-based authentication** — a random token is generated on login, saved to the user's record, and stored client-side to protect routes like `/home` and `/history`.
- **Real-time video calling** — peer-to-peer video/audio using native WebRTC (`RTCPeerConnection`), with a Google STUN server for NAT traversal.
- **Live signaling via Socket.IO** — joining a room, exchanging WebRTC offers/answers/ICE candidates, and notifying participants when someone joins or leaves all happen over Socket.IO.
- **Audio & video controls** — toggle your microphone and camera on/off during a call.
- **Screen sharing** — share your screen mid-call using `getDisplayMedia`, with an automatic switch back to your camera feed once sharing stops.
- **Real-time chat** — send and receive text messages with everyone in the same meeting room; messages sent before you joined are replayed to you when you connect.
- **Meeting history** — every meeting code you join is saved against your account and viewable later on the History page.
- **Join by meeting code** — enter any code on the Home page to be routed straight into that meeting room (`/:url`).

## Tech Stack

**Frontend**
- React 19 with React Router v7
- Material UI (MUI) v9 for components
- Axios for API requests
- Socket.IO Client

**Backend**
- Node.js with Express 5
- Socket.IO (server)
- bcrypt for password hashing
- Node's built-in `crypto` module for generating auth tokens

**Database**
- MongoDB with Mongoose ODM
- Two collections: `User` and `Meeting`

**Real-time / WebRTC**
- Native WebRTC API (`RTCPeerConnection`) for direct peer-to-peer media
- Google's public STUN server for NAT traversal (no TURN server configured)
- Socket.IO used purely as the signaling channel and for chat

## How It Works

```
React Frontend  →  Express REST API  →  MongoDB
      │                (auth, meeting history)
      │
      └────────────→  Socket.IO Server  →  WebRTC (peer-to-peer)
                       (signaling, chat)      (audio/video/screen streams)
```

1. The React app talks to the Express backend over REST (`/api/v1/users/...`) for registration, login, and saving/fetching meeting history — all persisted in MongoDB.
2. When a user opens a meeting URL, the frontend connects to the Socket.IO server and emits a `join-call` event with the room (meeting) code.
3. The server tracks which sockets are in which room and relays WebRTC signaling data (`signal` events carrying SDP/ICE information) between participants.
4. Once signaling completes, browsers establish a direct WebRTC connection to exchange audio, video, and screen-share streams — the server is no longer involved in the media itself.
5. Chat messages are sent over the same Socket.IO connection and broadcast to everyone currently in the room.

## Project Structure

```
backend/
└── src/
    ├── app.js                     # Express + Socket.IO server bootstrap, DB connection, route mounting
    ├── controllers/
    │   ├── user.controller.js     # Register, login, and meeting history logic
    │   └── socketManager.js       # Socket.IO event handling (join-call, signal, chat-message, disconnect)
    ├── models/
    │   ├── user.model.js          # Mongoose schema for users
    │   └── meeting.model.js       # Mongoose schema for meeting history entries
    └── routes/
        └── users.routes.js        # Express routes under /api/v1/users

frontend/
└── src/
    ├── pages/
    │   ├── landing.jsx            # Public landing page
    │   ├── authentication.jsx     # Login / Register screen
    │   ├── home.jsx                # Dashboard — join a meeting, logout, view history
    │   ├── history.jsx            # Lists the current user's past meetings
    │   └── VideoMeet.jsx          # Lobby + main meeting room (video grid, controls, chat)
    ├── contexts/
    │   └── AuthContext.jsx        # Auth state and API calls (register/login/history) via Axios
    ├── utils/
    │   └── withAuth.jsx           # Route-protection HOC, checks for a token in localStorage
    ├── styles/
    │   └── videoComponent.module.css  # Styling for the meeting/lobby/chat UI
    └── environment.js             # Backend base URL (toggles between local and deployed)
```

## Getting Started

### Prerequisites
- Node.js and npm
- A MongoDB connection string (MongoDB Atlas or a local instance)

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The server listens on port `8000` by default. Create a `.env` file in `backend/` with your own `MONGO_URI` (see [Environment Variables](#environment-variables)) before starting the server.

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app runs on `http://localhost:3000` by default. In `src/environment.js`, set `IS_PROD` to `false` to point the frontend at your local backend (`http://localhost:8000`) instead of the deployed one.

## Environment Variables

| Variable | Used in | Description |
|---|---|---|
| `PORT` | Backend (`app.js`) | Port the Express/Socket.IO server listens on. Defaults to `8000` if not set. |
| `MONGO_URI` | Backend (`app.js`) | MongoDB connection string used to connect via Mongoose. Example: `MONGO_URI=your_mongodb_connection_string` |

The frontend does not currently use a `.env` file — the backend base URL is set manually via the `IS_PROD` flag in `src/environment.js`.

## API Endpoints

All routes are prefixed with `/api/v1/users`.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/register` | Create a new user account (password hashed with bcrypt). |
| `POST` | `/login` | Verify credentials and return a generated auth token. |
| `POST` | `/add_to_activity` | Save a meeting code to the authenticated user's history. |
| `GET` | `/get_all_activity` | Fetch a user's meeting history (token passed as a query parameter). |

## WebRTC / Socket.IO

- **Joining a room:** the client emits `join-call` with the meeting code. The server groups connected sockets by room and emits `user-joined` to everyone in it.
- **Signaling:** each participant creates an `RTCPeerConnection` (configured with a public Google STUN server) for every other participant in the room, and exchanges SDP offers/answers and ICE candidates through a `signal` event that the server simply relays to the intended recipient.
- **Media streams:** once the peer connections are established, audio/video/screen-share streams flow directly between browsers — the server only handles signaling, not the media itself.
- **Chat:** `chat-message` events are broadcast by the server to every socket currently in the same room. Messages are kept in memory on the server (not persisted to MongoDB), so they're available to anyone who joins later in that session, but are lost when the server restarts.
- **Leaving:** on `disconnect`, the server removes the socket from its room and notifies the remaining participants via `user-left`.
- **Known limitation:** with only a STUN server configured (no TURN), calls between peers on restrictive or symmetric NATs/firewalls may fail to connect directly.

## Deployment

MeetSphere is deployed on Render with separate frontend and backend services.

- **Frontend:** [MeetSphere Frontend](https://meetspherefrontend-vvx7.onrender.com)
- **Backend:** [MeetSphere Backend](https://meetspherebackend-u4fc.onrender.com)

The frontend is configured to communicate with the deployed backend when `IS_PROD` is set to `true` in `frontend/src/environment.js`.ckend-u4fc.onrender.com), which `frontend/src/environment.js` points to when `IS_PROD` is `true`.
- **Frontend:** deployed as a static site on Render, built from the `frontend/` directory.


## Author

**Diya Mehndiratta**

## GitHub

[https://github.com/diyam1311/MeetSphere](https://github.com/diyam1311/MeetSphere)
