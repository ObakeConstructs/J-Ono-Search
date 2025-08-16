const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";
let deets = [];
let sources = [];
var col_size = 100;

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

function shower () {
  var frm = document.getElementById("images");
  
  var w = document.documentElement.clientWidth;
  var across = (w/300).toFixed();
  var col_size = 100/across;
  console.log(across, col_size);
  var cnt = 0;
  
  var row = document.createElement("div");
  row.setAttribute("class", "row");
  
  for (var deetnum = 0; deetnum < deets.length; deetnum++) {
    for (var defnum = 0; defnum < deets[deetnum].definition.length; defnum++) {
      for (var exnum = 0; exnum < deets[deetnum].definition[defnum].example.length; exnum++) {
        var src = deets[deetnum].definition[defnum].example[exnum].source;
        var file = deets[deetnum].definition[defnum].example[exnum].file;
        var disp = deets[deetnum].definition[defnum].example[exnum].display;
        
        var img = document.createElement("img");
        img.setAttribute("style", "width:100%; border: 1px solid black;");
        img.setAttribute("src", content + "img/" + src + "/" + file + ".jpg");
        
        var imgdiv = document.createElement("div");
        imgdiv.setAttribute("style", "float:left; width:" + col_size + "%; padding: 5px 0px;");
        imgdiv.innerHTML = src + "/" + file + "<br>" + disp;
        imgdiv.appendChild(img);
        
        row.appendChild(imgdiv);
        cnt++
        if (cnt + 1 > across) {
          frm.appendChild(row);
          cnt = 0;
          row = document.createElement("div");
          row.setAttribute("class", "row");
        }
      }
    }
  }
  
  frm.appendChild(row);
  
}
