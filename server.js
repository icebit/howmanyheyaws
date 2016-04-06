var express = require("express");
var app = express();

var fs = require("fs");

var PORT = 4433;
var num_heyaws = 0;

//Read num_heyaws
fs.readFile("num_heyaws", "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  num_heyaws = ~~data;
});

//Backup number every 5 seconds
setInterval(saveHeyaws, 5000);

function saveHeyaws() {
	fs.writeFile("num_heyaws", num_heyaws.toString(), function (err, data) {
	  if (err) {
	    return console.log(err);
	  }
		console.log("Saved num_heyaws");
	});
}

app.use(express.static("static"));

app.get("/num", function(req, res) {
	res.send(num_heyaws.toString());
});

app.get("/add", function(req, res) {
	// /add?num=x
	var num = req.param("num");
	num_heyaws += ~~num;
	console.log(num + " heyaws recieved from " + req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	res.sendStatus(0);
});

app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});

process.on('SIGTERM', function () {
	saveHeyaws();
	process.exit(0);
});
