const express = require('express');
const server = express();

server.all('/', (req,res)=>{
  res.send('BOT ONLINE!')
})
function KeepAlive(){
  server.listen(3000, ()=>{console.log("Server is Ready!")});
}
module.exports = KeepAlive