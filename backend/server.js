import { PingManager } from './utilities/pingManager.js';
import { broadcastPingResults } from './utilities/websocketUtils.js';
import { receivers } from './receivers.mjs';
import express from 'express';
import cors from 'cors';
import 'dotenv';
import bodyParser from 'body-parser';

const HTTP_PORT = process.env.HTTP_PORT;
const allowedOrigins = process.env.CORS_ORIGINS

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());

let selectedReceivers = receivers.reduce((accumulator, receiver) => {
  if (receiver.isSelected) {
    accumulator.push(receiver)
  }
  return accumulator
}, [])

let hosts = selectedReceivers.map(receiver => receiver.IP)
console.log(hosts)
const pingManager = new PingManager();

app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://${IP_ADDRESS}:${HTTP_PORT}`);
});

app.get('/', (req, res) => {
  return res.send(JSON.stringify(selectedReceivers))
});

const updateHostsList = () => {
  return receivers.reduce((accumulator, receiver) => {
    if (receiver.isSelected) {
      accumulator.push(receiver.IP)
    }
    return accumulator
  }, [])
}
const updateReceiverList = (ids) => {
  return selectedReceivers.map(receiver => {
    if (ids.includes(receiver.id)) {
      receiver["isSelected"] = true;
    }
    else {
      receiver["isSelected"] = false;
    }
    return receiver
  })
}

app.put('/updateReceiverListState', (req, res) => {
  const updatedReceiverIds = req.body.selectedDevices;
  console.log("updatedIds: ", updatedReceiverIds)
  selectedReceivers = updateReceiverList(updatedReceiverIds);
  hosts = updateHostsList();
  res.send(JSON.stringify(selectedReceivers));
})

app.put('/shouldPing', (req, res) => {
  const shouldPing = req.body.shouldPing;
  pingManager.setPingingState(shouldPing);

  if (shouldPing) {
    console.log("Monitoring devices: ", pingManager.checkPingingState());
    pingManager.executePings(hosts, broadcastPingResults);
  } else {
    console.log("Stopped Monitoring devices");
  }

  res.send(JSON.stringify({ "Monitoring devices": pingManager.checkPingingState() }));
});