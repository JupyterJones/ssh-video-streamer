var http       = require('http'),
    fs         = require('fs'),
    url        = require('url'),
    basePath   = '/home/jack/Desktop',
    baseUrl    = 'localhost',
    basePort   = 8081;

http.createServer(function (req, res) {

    // Get params from request.
    var params    = url.parse(req.url, true).query,
        filePath  = basePath + params.type + '/' + params.name,
        stat      = fs.statSync(filePath),
        total     = stat.size;

      if (req.headers['range']) {
        var range         = req.headers.range,
            parts         = range.replace(/bytes=/, "").split("-"),
            partialstart  = parts[0],
            partialend    = parts[1],
            start         = parseInt(partialstart, 10),
            end           = partialend ? parseInt(partialend, 10) : total-1,
            chunksize     = (end-start)+1;

        var file = fs.createReadStream(filePath, {start: start, end: end});
        res.writeHead(206, { 'Content-Range'  : 'bytes ' + start + '-' + end + '/' + total,
                             'Accept-Ranges'  : 'bytes',
                             'Content-Length' : chunksize,
                             'Content-Type'   : 'video/mp4' });
        file.pipe(res);

        // Close file at end of stream.
        file.on('end', function(){
          file.close();
