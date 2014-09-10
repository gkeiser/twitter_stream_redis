var util = require('util'),
    twitter = require('twitter');
var redis = require("redis"),
client = redis.createClient();

client.on("error", function (err) {
        console.log("Error " + err);
    });

var twit = new twitter({
    consumer_key: 'YOURKEY',
    consumer_secret: 'YOURSECRET',
    access_token_key: 'YOURTOKENKEY',
    access_token_secret: 'YOURACCESSTOKENSECRET'
});


var count = 0;
twit.stream('filter', {track:'rayrice'}, function(stream) {
    stream.on('data', function(data) {
	count = count + 1;
	console.log('received data for %d times calling zadd', count);
        console.log('created at date %s', util.inspect(data.created_at));
	console.log('type is object ', new Date(data.created_at))
	client.zadd('rayrice', new Date(data.created_at).getTime(), JSON.stringify(data), function(err, resp){
		console.log('err ', err);
		console.log('response ', resp);
	});
    });
    
    stream.on('error', function(data) {
        console.log(util.inspect(data));
    });
    // Disconnect stream after five seconds
    setTimeout(function() {
	stream.destroy();
	process.exit();
	}, 5000);
});

//twit.search('nodejs OR #node', function(data) {
/*
twit.search('from:@grantkeiser OR from:@shanselman', function(data) {
    //console.log(util.inspect(data));
	console.log(data.statuses instanceof Array);
	console.log(data.statuses.length);
});
*/
