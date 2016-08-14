var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var bodyParser = require("body-parser");
var PythonShell = require('python-shell');
var io = require('socket.io');
var open = require("open");

var rgbColor = ['255, 0, 0','51, 204, 51','0, 153, 255','255, 255, 0','204, 0, 153','51, 51, 0','255, 0, 102','200, 200, 200','0, 51, 102','255, 153, 255'];

app.use(express.static(path.join(__dirname, 'balloon')));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'balloon/index.html'));
});

app.get('/api/cal', function(req, res){
    var pyPath = path.join(__dirname, 'python');
    fs.readdir(__dirname+ '/python', function(err, files) {
        if (err) throw err;
        files.forEach(function(file){
            PythonShell.run(file, { scriptPath: pyPath}, function (err) {
                if (err) throw err;
                console.log('cal data '+ file+ ' finished');
            });
        });
    });
    var waittingTime = 0;
    fs.readdir(__dirname+ '/uploads', function(err, files) {
        if (err) throw err;
        var filelen = files.length;
        waittingTime = 1300 * filelen;
        setTimeout( function(){ res.json({ success: true })} , waittingTime);
    });
});

app.post('/api/delFile', function(req, res){
    var delfiles = req.body.filename;
    if(delfiles.length){
        delfiles.forEach(function(delfile){
            fs.unlink(path.join(__dirname, '/uploads/')+delfile, function(err) {
                if (err) {
                    return console.error(err);
                }
                console.log(delfile+": deleted successfully!");
                fileList();
            });
        });
        res.json({ success: true });
    }
});

app.get('/api/listFile', function(req, res){
    fileList();
    res.json({ success: true });
});

app.get('/api/getListFile', function(req, res){
    fs.readdir(__dirname+ '/uploads', function(err, files) {
        res.json({success: true, fileData: files});
    });
});

app.post('/api/setup', function(req, res){
    var opts = req.body.options;
    fs.writeFile(path.join(__dirname, 'setting/setting.txt'), opts, function(error) {
      if (error) {
        console.error("write error:  " + error.message);
      }
    });
    res.json({ success: true });
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    fileList();
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(8000, function(){
  console.log('Server listening on port 8000');
});

var socket = io.listen(server);

// Add a connect listener
/*socket.on('connection', function(client){
	// Success!  Now listen to messages to be received
	client.on('message',function(event){
		fileList();
	});

});*/

//
var fileList = function(){
    var fileJson = ('[');
    fs.readdir(__dirname+ '/uploads', function(err, files) {
        if (err) throw err;
        var filelen = files.length;
        for(var i= 0; i< filelen; i++){
            fileJson += ('{ "id": "'+(i+1)+'", "name": "'+files[i]+'", "color": " <p style= \'color:rgb('+rgbColor[i%10]+')\'>▇▇▇</p> "}' );
            if(i<filelen-1)
                fileJson += (',');
        };
        fileJson += (']');
        fs.writeFile(path.join(__dirname, 'balloon/data/file.json'), fileJson, function(error) {
            if (error) {
                console.error("write error:  " + error.message);
            }
        });
    });
};


open("http://127.0.0.1:8000",'chrome');
