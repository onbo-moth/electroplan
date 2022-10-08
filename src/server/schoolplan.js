const fetch     = require("node-fetch")
const { JSDOM } = require("jsdom")
const fs        = require("fs")

class SchoolPlanServer {
  constructor(){
    this.defaultSite = "http://plan.ckziu-elektryk.pl"
    this.links = []
    this.plans = []
    console.log("rocket launcherer!!")
  }

  getPlanNames(){
    let result = []
    for(let i=0; i < this.plans.length; i++){
      result.push(this.plans[i].name)
    }
    return result
  }

  getPlan(name){
    if(name == null) return

    name = name.trim().toUpperCase()

    for(let i=0; i < this.plans.length; i++){
      if(this.plans[i].name == name) return this.plans[i]
    }

    return null
  }

  async updatePlans(){
    if(!fs.existsSync(`${__dirname}/plans`)) fs.mkdirSync("./plans")

    let links = await this.#getLinks()
    links = links.filter(link => {
      return link.includes("o")
    })

    this.plans = []

    for(let i=0; i<links.length; i++){
      this.#parseSchoolTable(`${this.defaultSite}/${links[i]}`).then(
        res => {
          this.plans.push(res)
          fs.writeFile(
            `${__dirname}/plans/${links[i].substring(6).split(".")[0]}.json`,
            JSON.stringify(res),
            (err)=>{if(err) console.log("uh oh\n" + err)
          })
        }
      )
    }
  }

  async #getLinks(){
    const html     = await this.#fetchBody(`${this.defaultSite}/lista.html`)
    const document = new JSDOM(html).window.document

    let link_elements = document.getElementsByTagName("a")

    let links = []

    for(let i=0; i<link_elements.length; i++){
      links.push(link_elements[i].href)
    }

    this.links = links

    return links
  }

  async #fetchBody(url){
    const response = await fetch(url)
    const body     = await response.text()

    return body
  }

  async #parseSchoolTable(url){
    const html     = await this.#fetchBody(url)
    const document = new JSDOM(html).window.document

    // console.time("jsdom getting data")
    
    const table = document.getElementsByClassName("tabela")[0]

    let schoolplan = {
      name: document.getElementsByClassName("tytulnapis")[0].innerHTML,
      timeplan: null,
      plan: null
    }

    let plan = []

    function parse_name(HTMLCollection){
      if(HTMLCollection.length == 0) return null
      let result = ""
      for(let i=0; i<HTMLCollection.length; i++){
          result += HTMLCollection[i].innerHTML + "<br>"
      }
      return result.trim()
    }

    let lessons = table.getElementsByClassName("l")

    let lnames = []
    for(let i=0; i<lessons.length; i++){
      lnames.push(parse_name(lessons[i].getElementsByClassName("p")))
    }

    while(lnames.length > 0) plan.push(lnames.splice(0, 5))

    // console.table(plan)

    schoolplan.plan = plan


    let times = table.getElementsByClassName("g")

    let hours = []
    for(let i=0; i<times.length; i++){
      hours.push(times[i].textContent)
    }

    schoolplan.timeplan = hours

    // console.timeEnd("jsdom getting data")

    return schoolplan
  }
}

module.exports = SchoolPlanServer
// new SchoolPlanServer();