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

  if(url === '/') {
    const indexData = await promise(r => 
      fs.readFile('index.html', {'encoding': 'utf-8'}, r))
    indexData && res.write(indexData)
    res.end()
  } else if(url === '/data/100mb') {
    const bytes = 1024 * 1024 * 100
    res.statusCode = 200
    res.setHeader('Content-Length', bytes.toFixed())
    res.flushHeaders()
    res.write(createData(bytes))
    res.end()
  } else {
    res.statusCode = 200
    res.write('404')
    res.end()
  }
})

server.listen(1000)