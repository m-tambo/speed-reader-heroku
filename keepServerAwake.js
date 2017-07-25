const http = require("http");

// keep the server awake by pinging every 5 minutes (300000)
module.exports = () => {
    setInterval(() => {
        http.get(`http://speed-reader-heroku.herokuapp.com/`);
    }, 300000);
}
