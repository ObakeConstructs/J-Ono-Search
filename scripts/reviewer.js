const CONTENT = "https://raw.githubuserCONTENT.com/ObakeConstructs/j-ono-data/main/";
let RECORDS = [];
let PUBLISHERS = [];
var COLUMN_SIZE = 100;

//=================================================================================

async function opener() {
  let response = await fetch(CONTENT + "json/j-ono-data.json");
  RECORDS = await response.json();
  
  const src = await fetch(CONTENT + "json/j-ono-source.json");
  PUBLISHERS = await src.json();
  PUBLISHERS = await PUBLISHERS.sort((a, b) => a.id < b.id ? -1 : 1);
  
  shower();
}

//=================================================================================

function shower () {
  var frm = document.getElementById("images");
  
  var w = document.documentElement.clientWidth;
  var across = (w/300).toFixed();
  var COLUMN_SIZE = 100/across;
  var cnt = 0;
  
  var row = document.createElement("div");
  row.setAttribute("class", "row");
  
  for (var deetnum = 0; deetnum < RECORDS.length; deetnum++) {
    for (var defnum = 0; defnum < RECORDS[deetnum].definition.length; defnum++) {
      for (var exnum = 0; exnum < RECORDS[deetnum].definition[defnum].example.length; exnum++) {
        var src = RECORDS[deetnum].definition[defnum].example[exnum].source;
        var file = RECORDS[deetnum].definition[defnum].example[exnum].file;
        var disp = RECORDS[deetnum].definition[defnum].example[exnum].display;
        var mean = RECORDS[deetnum].definition[defnum].meaning;
        
        var img = document.createElement("img");
        img.setAttribute("style", "width:100%; border: 1px solid black;");
        img.setAttribute("src", CONTENT + "img/" + src + "/" + file);
        
        var textblock = document.createElement("div");
        textblock.setAttribute("class", "text_block");
        textblock.innerHTML = "<p><b>" + src + "/" + file + "</b><br />" + disp + "<br />" + mean + "</p>";
        
        var imgdiv = document.createElement("div");
        imgdiv.setAttribute("style", "float:left; width:" + COLUMN_SIZE + "%; padding: 5px 0px;");
        //imgdiv.innerHTML = src + "/" + file + "<br />" + disp + "<br />" + mean;
        imgdiv.appendChild(textblock);
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
