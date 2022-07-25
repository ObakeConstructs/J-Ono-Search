const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";
let deets = [];

//=================================================================================

async function opener() {
  let response = await fetch(content + "json/j-ono-data.json");
  deets = await response.json();
  
  const src = await fetch(content + "json/j-ono-source.json");
  sources = await src.json();
  sources = await sources.sort((a, b) => a.id < b.id ? -1 : 1);
  
  shower();
}

//=================================================================================

function shower() {
  var main = document.getElementById("main");
  deets.forEach((deet) => {
    
    main.innerHTML += "<br>" + deet.literal + "<br>";
    
    deet.definition.forEach((def) => {
      main.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;" + def.meaning + " (";
      var txt = "";
      def.equivalent.forEach((equ) => {
        if (txt.length > 0) txt += ", ";
        txt += equ;
      });
      main.innerHTML += txt + ")<br>";
    });
  });
}