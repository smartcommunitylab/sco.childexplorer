var express = require('express');
var app = express();
var adaro = require('adaro');
var Client = require('node-rest-client').Client;

var config = require('./config');

var options_auth = { user: config.user, password: config.password };
var client = new Client(options_auth);

var dustOpts = {
  helpers: [
    'dustjs-helpers', // so do installed modules
  ]
};

app.engine('dust', adaro.dust(dustOpts));
app.set('view engine', 'dust');
app.set('view cache', false);
app.set('views', './templates');
app.use(express.static('assets'));

var args = {
    path: { "gameId": config.gameId },
    headers: { "Accept": "application/json" }
};

app.get('/', function (req, res) {
  var playerId = req.query.playerId;
  var playerName = req.query.playerName;
  if(!playerId || !playerName) {
    res.status(400).send('playerId or playerName params missing in request');
    return;
  }
  client.get("https://dev.smartcommunitylab.it/gamification/gengine/state/${gameId}/"+playerId,args, function (data, response) {
  var viewData = {'playerName' : playerName};
  data.state.PointConcept.forEach(function(e) {
    if(e.name === 'passi') {
      viewData.passi = e.score;
    }  
    if(e.name === 'alberi') {
      viewData.alberi = 10;//e.score;
    }
    viewData.alberiImgs = [];
    for(var i = 0; i < viewData.alberi; i++) {
      viewData.alberiImgs.push("");
    }
  });
  res.render('index', viewData);
}).on('error', function (err) {
    res.status(500).send('Internal Error');
});;
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
