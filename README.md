# Mock API for Polling Authenticator

This is a mock backend API to simulate a user-driven approval flow used by a custom polling authenticator in the [Curity Identity Server](https://curity.io/).

The API simulates sending a notification to a user, tracking their decision (approve/decline), and allowing the [polling-example-authenticator](https://github.com/curityio/polling-example-authenticator/tree/main) to poll for the user's response.

---

## Features

- `POST /send-notification`: Simulates sending an authentication request to a user
- `GET /status/:requestId`: Returns the current status of the request
- `POST /user-action`: Allows a user to approve or decline a request

---

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

---

## Setup

1. Clone the repository 
2. Install dependencies (only `express` and `uuid` are required):

```bash
npm install
```

3. Start the server
```
node mock-api.js
```

The API will start on http://localhost:3000.

---  

## API Endpoints

### `POST /send-notification`
Simulates triggering a notification for a user to approve or decline.

**Request Body:**
```json
{
  "username": "alice"
}
```

**Response:**
```json
{
  "requestId": "140896ed-a726-43e0-a359-d0f1f7bbedc2"
}
```


### `GET /status/:requestId`
Polls the current status of a specific request.

**Response:**
```json
{
  "status": "pending"
}
```

Status can be:
- pending
- approved
- declined


### `POST /user-action`
Simulates a user approving or declining the request.

**Request Body:**
```json
{
  "requestId": "140896ed-a726-43e0-a359-d0f1f7bbedc2",
  "action": "approve"
}
```

Valid actions:
- approve
- decline


## Example Flow

1. Call `POST /send-notification` with a username
2. Poll `GET /status/:requestId` from your authenticator
3. Simulate the user's action by calling `POST /user-action` with `approve` or `decline`
4. Authenticator receives the updated status during polling

## Notes

- This is a mock/stub implementation meant for testing the polling authenticator plugin.
- No persistence: all statuses are stored in-memory.
- No authentication or security is implemented.
