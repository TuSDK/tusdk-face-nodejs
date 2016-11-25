tuface = require('./face');

face = new tuface({
	pid : "your_pid", // 公有key
	key: "your_key",  // 私有key
});

try {

	face.request('detection', {
		url:"image_url"
		// file: "path_to_file"
	}, function(resp){
		console.log(resp);
	});

} catch (err) {
	console.error("ERROR: " + err)
}