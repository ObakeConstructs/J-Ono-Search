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

function get_meaning_by_refer(refer, file) {
  refer_parts = refer.split(":");
  
  for (var record_number = 0; record_number < RECORDS.length; record_number++) {
    if(RECORDS[record_number].id === refer_parts[0]) {
      for (var definition_number = 0; definition_number < RECORDS[record_number].definition.length; definition_number++) {
        if ((definition_number + 1) == refer_parts[1]) {
          return "[" + RECORDS[record_number].definition[definition_number].meaning + "]";
        }
      }
    }
  }
  
  //console.log(refer_parts[0] + " <--> " + refer_parts[1]);
  return "";  
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
  
  for (var record_number = 0; record_number < RECORDS.length; record_number++) {
    for (var definition_number = 0; definition_number < RECORDS[record_number].definition.length; definition_number++) {
      for (var example_number = 0; example_number < RECORDS[record_number].definition[definition_number].example.length; example_number++) {
        var src = RECORDS[record_number].definition[definition_number].example[example_number].source;
        var file = RECORDS[record_number].definition[definition_number].example[example_number].file;
        var disp = RECORDS[record_number].definition[definition_number].example[example_number].display;
        var mean = RECORDS[record_number].definition[definition_number].meaning;
        var refer = RECORDS[record_number].definition[definition_number].refer;
        
        if (refer.length > 0) {
          mean = get_meaning_by_refer(refer, file) + mean;
        }
        
        var img = document.createElement("img");
        img.setAttribute("class", "example_image");
        img.setAttribute("src", CONTENT + "img/" + src + "/" + file);
        
        var textblock = document.createElement("div");
        textblock.setAttribute("class", "text_block");
        textblock.innerHTML = "<p><b>" + src + "/" + file + "</b><br />" + disp + "<br />" + mean + "</p>";
        
        var imgdiv = document.createElement("div");
        imgdiv.setAttribute("style", "float:left; width:" + COLUMN_SIZE + "%; padding: 5px 0px;");
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
