console.log("getting requires...")

const fs = require("fs")
const url = require("url")
const express = require("express")

console.log("starting schoolplan api...")

const SchoolPlanServer = require("./schoolplan.js")
let schoolplan = new SchoolPlanServer()
schoolplan.updatePlans()

function api_call(method, args){
  switch(method){
    case "getPlanNames":
      return schoolplan.getPlanNames()
    case "getPlan":
      return schoolplan.getPlan(args.name)
    case "teapot":
      return 418
    default:
      return 404
  }
}

console.log("starting server...")

const app = express()


// main page
app.get("/", function(req, res){
  res.sendFile(`${__dirname}/client/html/index.html`)
})

// js files
app.get("/js/*", function(req, res){
  if(!fs.existsSync(__dirname + "/client" + req.path)) return res.send(404)
  
  res.type("js")
  res.sendFile(__dirname + "/client" + req.path)
})

//TODO api for schoolplan
app.get("/api/*", function(req, res){
  let answer = api_call(req.path.substring(5), req.query)
  
  res.send(answer)
})


// extra :3
app.get("/debug", function(req, res){
  res.send(
    "debug time babe!\n" +
    req.method + " " + req.path + "\n" + 
    "params: " + req.query.name + "\n"
  )
})

let server = app.listen(8000, function(){
  let host = server.address().address
  let port = server.address().port

  if(host == "::") host = "localhost"

  console.log(`listening @ ${host}:${port}`)
})