const http = require('http')
const fs = require('fs')

const createData = size => {
  const data = new Buffer.alloc(size, 'abcdefg\n')
  return data
}

const promise = r => new Promise((resolve, reject) => {
    r((error, value) => error ? reject(error) : resolve(value))
})

const server = http.createServer(async (req, res) => {
  const {url} = req
  console.log(`${req.socket.remoteAddress}`, req.method, url)

  if(url === '/') {
    const indexData = await promise(r => 
      fs.readFile('index.html', {'encoding': 'utf-8'}, r))
    indexData && res.write(indexData)
    res.end()
  } else if(url === '/data/50mb') {
    const bytes = 1024 * 1024 * 50
    res.statusCode = 200
    res.setHeader('Content-Length', bytes.toFixed())
    res.flushHeaders()
    res.write(createData(bytes))
    res.end()
  } else {
    res.statusCode = 404
    res.write('404')
    res.end()
  }
})

server.listen(1000)

console.log('Ready')
