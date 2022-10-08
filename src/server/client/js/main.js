console.log("Hello World!")

const select    = document.getElementById("classselect")
const table     = document.getElementById("table")
const classname = document.getElementById("classname")

if(true){
  document.body.style.backgroundColor = "#202030"
}

function get_class_names(){
  const response = fetch("/api/getPlanNames")
    .then(data => data.json())
    .then(json => update_class_select(json))
  
}

function update_class_select(classes){
  console.log(classes)

  classes = classes.sort()

  select.innerHTML = ""

  for(let i=0; i<classes.length; i++){
    let option = document.createElement("option")
    option.innerText = classes[i]
    option.value     = classes[i]
    select.appendChild(option)
  }
}

function on_select_class(){
    classname.innerText = select.value

    table.innerHTML = ""

    console.log("Hello?")

    function create_row(array, dark_color = false){
      let tr = document.createElement("tr")

      let td_nr = document.createElement("td")
      td_nr.classList.add("table-nr")
      if(dark_color) td_nr.classList.add("table-color")
      td_nr.innerHTML = array[0]
      tr.appendChild(td_nr)
      
      let td_hr = document.createElement("td")
      td_nr.classList.add("table-hour")
      if(dark_color) td_hr.classList.add("table-color")
      td_hr.innerHTML = array[1]
      tr.appendChild(td_hr)

      for(let i=2; i<7; i++){
        let td = document.createElement("td")
        td.classList.add("table-lesson")
        if(dark_color) td.classList.add("table-color")
        td.innerHTML = array[i]
        tr.appendChild(td)
      }

      table.appendChild(tr)
    }

    create_row(["Nr.", "Godz.", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"], true)

    fetch("/api/getPlan?name=" + select.value)
      .then(data => data.json())
      .then(data => create_table(data))

    function create_table(data){
      console.log(data)
      for(let i=0; i<data.plan.length; i++){
        create_row([i+1, data.timeplan[i]].concat(data.plan[i]))
      }
    }
}

select.addEventListener("change", on_select_class)

get_class_names()