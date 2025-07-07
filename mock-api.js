const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PORT = 3000;
const statuses = {};

const STATUS_PENDING = 'pending';
const STATUS_APPROVED = 'approved';
const STATUS_DECLINED = 'declined';
const VALID_ACTIONS = new Set(['approve', 'decline']);

// Helper: Logging with consistent prefix
const log = (message, ...args) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [API] ${message}`, ...args);
};

app.post('/send-notification', (req, res) => {
  const { username } = req.body;
  log('POST /send-notification - body:', req.body);

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const requestId = uuidv4();
  statuses[requestId] = { username, status: STATUS_PENDING };

  log(`Generated requestId ${requestId} for username "${username}"`);
  res.json({ requestId });
});

app.get('/status/:requestId', (req, res) => {
  const { requestId } = req.params;
  log(`GET /status/${requestId}`);

  const entry = statuses[requestId];
  if (!entry) {
    return res.status(404).json({ error: 'RequestId not found' });
  }

  log(`Returning status for ${requestId}: ${entry.status} (username: ${entry.username})`);
  res.json({ status: entry.status });
});

app.post('/user-action', (req, res) => {
  const { requestId, action } = req.body;
  log('POST /user-action - body:', req.body);

  if (!requestId || !action) {
    return res.status(400).json({ error: 'requestId and action are required' });
  }

  const entry = statuses[requestId];
  if (!entry) {
    return res.status(404).json({ error: 'RequestId not found' });
  }

  if (entry.status !== STATUS_PENDING) {
    return res.status(400).json({ error: 'Action already taken' });
  }

  if (!VALID_ACTIONS.has(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  entry.status = action === 'approve' ? STATUS_APPROVED : STATUS_DECLINED;
  log(`Status for ${requestId} updated to ${entry.status}`);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  log(`Backend API listening on port ${PORT}`);
});
