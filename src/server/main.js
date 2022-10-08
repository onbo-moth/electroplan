function get_memory_usage() {
  let mem_data = process.memoryUsage();
  console.log(`heap used:  ${(mem_data.heapUsed  / (1024**2)).toFixed(4)}MB`)
  console.log(`heap total: ${(mem_data.heapTotal / (1024**2)).toFixed(4)}MB`)
  console.log(`mem:        ${(mem_data.rss       / (1024**2)).toFixed(4)}MB`)
}

console.log("before require")
get_memory_usage()

const fetch     = require("node-fetch")
const { JSDOM } = require("jsdom")

console.log()
console.log("after require")
get_memory_usage()

async function fetch_plan(url){
  const response = await fetch(url)
  const body     = await response.text()

  return body
}

async function parse_table(){
  const html     = await fetch_plan("http://plan.ckziu-elektryk.pl/plany/o21.html")
  const document = new JSDOM(html).window.document

  console.time("jsdom getting data")
  
  const table = document.getElementsByClassName("tabela")[0]

  let schoolplan = {
    name: document.getElementsByClassName("tytulnapis")[0].innerHTML,
    timeplan: [],
    plan: null
  }

  let plan = []

  function parse_name(HTMLCollection){
    if(HTMLCollection.length == 0) return null
    let result = ""
    for(i=0; i<HTMLCollection.length; i++){
        result += HTMLCollection[i].innerHTML + "\n"
    }
    return result.trim()
  }

  let lessons = table.getElementsByClassName("l")

  let lnames = []
  for(let i=0; i<lessons.length; i++){
    lnames.push(parse_name(lessons[i].getElementsByClassName("p")))
  }

  while(lnames.length > 0) plan.push(lnames.splice(0, 5))

  console.table(plan)

  schoolplan.plan = plan

  console.timeEnd("jsdom getting data")

  return schoolplan
}

parse_table()