const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const dataPath = path.join(process.cwd(), 'fanpit_data.json');
let fanpitData = {};

try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  fanpitData = JSON.parse(rawData);
  fanpitData.events = fanpitData.events.filter(event => event.title !== null);
  fanpitData.experiences = fanpitData.experiences.filter(exp => exp.title !== null);
  fanpitData.events = fanpitData.events.map((event, index) => ({ id: event.id || `event_${index + 1}`, ...event }));
  fanpitData.experiences = fanpitData.experiences.map((exp, index) => ({ id: exp.id || `exp_${index + 1}`, ...exp }));
  console.log(`Loaded ${fanpitData.events.length} events and ${fanpitData.experiences.length} experiences from ${dataPath}`);
} catch (error) {
  console.error(`Could not read or parse fanpit_data.json from ${dataPath}:`, error);
  process.exit(1);
}

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/events', (req, res) => {
  const allItems = [...(fanpitData.events || []), ...(fanpitData.experiences || [])];
  res.json(allItems);
});

app.listen(port, () => {
  console.log(`Mock API server listening at http://localhost:${port}`);
});
