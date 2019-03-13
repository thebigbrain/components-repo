const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: '192.168.99.100',
  port: 9000,
  useSSL: false,
  accessKey: 'localhost',
  secretKey: 'localhost'
});

let size = 0;
// reads 30 bytes from the offset 10.
minioClient.getObject('components', 'story.js', function (err, dataStream) {
  if (err) {
    return console.log(err);
  }
  dataStream.on('data', function (chunk) {
    size += chunk.length;
  });
  dataStream.on('end', function () {
    console.log('End. Total size = ' + size);
  });
  dataStream.on('error', function (err) {
    console.log(err);
  })
});

function middleware(req, res, next) {

}

module.exports = {
  default: middleware
};
