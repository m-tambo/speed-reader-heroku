const express = require('express');
const app = express();
const port = process.env.PORT || 4040;
const cors = require('cors');
const bodyParser = require('body-parser');
const Nightmare = require('nightmare');
const expressValidator = require('express-validator');
const keepServerAwake = require('./keepServerAwake.js')

keepServerAwake()

// allow cross origin sharing
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/getscreenshot/:url', (req, res) => {
  const nightmare = Nightmare({ show: false });
  nightmare
    .goto(`http://${req.params.url}`)
    .screenshot()
    .end()
    .then((buf) => res.status(200).send(buf))
    .catch( e => {
      console.error('Unable to retrieve screenshot:', e);
    });
  console.log(`Screenshot taken from: ${req.params.url} ...`)
});

app.get('/getstats/:url', (req, res) => {
  const nightmare = Nightmare({ show: false });
  nightmare
    .goto(`http://${req.params.url}`)
    .evaluate( () => {
      return {  navStart: window.performance.timing.navigationStart,
                loadEventEnd: window.performance.timing.loadEventEnd,
                requestStart: window.performance.timing.requestStart,
                responseStart: window.performance.timing.responseStart,
                pageSize: window.performance.memory.usedJSHeapSize
              }
    })
    .end()
    .then( data => {
      console.log(`data returned: ${data.pageSize}`)
      res.status(200).json(data)
    })
    .catch( e => {
      console.error('Search failed:', e);
    });
  console.log(`url analyzed: ${req.params.url} ...`)
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
