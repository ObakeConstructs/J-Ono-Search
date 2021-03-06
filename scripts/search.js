//location of json data and images...
const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";

//global arrays to hold definition and source data
let deets = [];
let sources = [];

//=================================================================================

// event listeners
document.getElementById("search_input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searcher();
  }
});

document.getElementById('kata').addEventListener('change', function() {
  refresh_picker()
});

document.getElementById('hira').addEventListener('change', function() {
  refresh_picker()
});

//=================================================================================

function clearer() {
  document.getElementById("search_input").value = "";
}

//=================================================================================

function searcher() {
  if (document.getElementById("search_input").value.length == 0) return;
  
  var jap = document.getElementById("japanese").checked;
  var lit = document.getElementById("literal").checked;
  var equ = document.getElementById("equivalent").checked;
  var com = document.getElementById("comment").checked;
  var typ = -1;
  if (document.getElementById("match").checked) typ = 0; //exact match
  if (document.getElementById("lead").checked) typ = 1; //from start
  if (document.getElementById("any").checked) typ = 2; //anywhere

  document.getElementById("grid_body").innerHTML = "";
  
  deets.forEach((details) => {
    var isMatch = false;
    
    if(checkForMatch(details.literal, typ) && lit) isMatch = true;
    
    details.katakana.forEach((itm) => {
      if(checkForMatch(itm, typ) && jap) isMatch = true;
    });    
    
    details.hiragana.forEach((itm) => {
      if(checkForMatch(itm, typ) && jap) isMatch = true;
    });
    
    details.definition.forEach((itm) => {
      if(checkForMatch(itm.meaning, typ) && com) isMatch = true;
      itm.equivalent.forEach((eq) => {
        if(checkForMatch(eq, typ) && equ) isMatch = true;
      });
    });
    
    if (isMatch) {
      shower_results(details)
    }
  });
}

//=================================================================================

function checkForMatch(str1, typ) {
  //remove all spaces and ensure lowercase before comparisons...
  var srch = document.getElementById("search_input").value.toLowerCase().split(" ").join("");
  str = str1.toLowerCase().split(" ").join("");
  
  switch (typ) {
    case 0: //exact match
      if(str === srch) { return true; }
      break;
    case 1: //match from beginning
      if(str.substring(0, srch.length) === srch) { return true; }
      break;
    case 2: //match anything
      if(str.includes(srch)) { return true; }
  }
  return false;
}

//=================================================================================

function shower_results(details) { 
  
  var kata = document.createElement("div");
  kata.setAttribute("class", "grid_kana");
  details.katakana.forEach((itm) => {
    if (kata.innerHTML.length>0) kata.innerHTML += ", ";
    kata.innerHTML += itm;
  });
  
  var hira = document.createElement("div");
  hira.setAttribute("class", "grid_kana");
  details.hiragana.forEach((itm) => {
    if (hira.innerHTML.length > 0) hira.innerHTML += ", ";
    hira.innerHTML += itm;
  });
  
  var kana = document.createElement("div");
  kana.setAttribute("class", "grid_main_block");
  kana.appendChild(kata);
  kana.appendChild(hira);
  
  //----------------------
  
  var lit = document.createElement("div");
  lit.setAttribute("class", "grid_main_block");
  lit.innerHTML = details.literal;
  
  //----------------------
  
  var defs = document.createElement("div");
  defs.setAttribute("class", "grid_defs");  
  details.definition.forEach((itm) => {  
  
    var equi = document.createElement("div");
    equi.setAttribute("class", "grid_main_block");
    itm.equivalent.forEach((eq_itm) => {
      if (equi.innerHTML.length > 0) equi.innerHTML += ", ";
      equi.innerHTML += eq_itm;
    });
    defs.appendChild(equi);
    
    var mean = document.createElement("div");
    mean.setAttribute("class", "grid_main_block");
    mean.innerHTML = itm.meaning;
    defs.appendChild(mean);
    
    var exam = document.createElement("div");
    exam.setAttribute("class", "grid_main_block");
    itm.example.forEach((ex_itm) => {
      var path = content + "img/" + ex_itm.source + "/" + ex_itm.file + ".jpg";
      var link = document.createElement("a");
      link.setAttribute("href", "#!");
      link.setAttribute("onclick", "showPopup('" + path + "', '" + ex_itm.display + "', '" + ex_itm.source + "', '" + ex_itm.contributor + "');");
      link.innerHTML = "img ";
      exam.appendChild(link);
      
    });
    defs.appendChild(exam);
  });
  
  //----------------------
  
  var body = document.getElementById("grid_body");
  grid_body.appendChild(kana);
  grid_body.appendChild(lit);
  grid_body.appendChild(defs);
  
}

//=================================================================================

function showPopup(img_path, title, src, contributor) {
  showOverlay();
  document.getElementById('popup').style.display = 'block';
  document.getElementById('popup_img').src = img_path;
  document.getElementById('imgTitle').innerHTML = title;
  var pub = "Image used for education/instructional purposes only."
  var cont = "";
  sources.forEach((source) => {
    if (source.id === src) {
      pub += "<br />Source: " + source.manga;
      pub += "<br />?? " + source.publisher;
      if (contributor.length > 0) cont = "Contributor: " + contributor;
    }
    
  });
  document.getElementById('imgAttrib').innerHTML = pub;  
  document.getElementById('imgContrib').innerHTML = cont;
}

//=================================================================================

function show_picker() {
  if (document.getElementById('pick_place').style.display === "grid") {
    hide_picker();
    return;
  }
  
  document.getElementById('pick_place').style.display = "grid";
  document.getElementById('pick_flip').style.display = "grid"
  document.getElementById('pick_button').value = "???";
  
  refresh_picker();
}

//=================================================================================
  
function hide_picker() {
  document.getElementById('pick_place').style.display = "none";
  document.getElementById('pick_flip').style.display = "none"
  document.getElementById('pick_button').value = "???";
}

//=================================================================================

function refresh_picker() {
  place = document.getElementById('pick_place');
  const div1 = "<div class=\"grid_picker_block\">";
  const div2 = "<div class=\"grid_picker_kana\">";
  const div_close = "</div>";
  
  place.innerHTML = "";
  
  var picker_cnt = 0;
  for (var i=0; i<52; i++) {
    var tmp = "";
    if(i == 36 || i == 38 || i == 47) {
      tmp = "<div class=\"grid_picker_block_gray\"></div>";
      picker_cnt += 4;
    }
    else {
      tmp = div1;
      tmp += div2 + get_kana(picker_cnt++) + div_close;
      tmp += div2 + get_kana(picker_cnt++) + div_close;
      tmp += div2 + get_kana(picker_cnt++) + div_close;
      tmp += div2 + get_kana(picker_cnt++) + div_close;
      tmp += div_close;
    }
    place.innerHTML += tmp;
  }
}

//=================================================================================

function get_kana(pos) {      
  const kata = "??????  ??????  ????????? ??????  ??????  ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ????????? ??? ??? ??? ??? ???   ???   ???   ???   ???   ??? ????????? ????????? ????????? ????????? ?????????   ???   ???   ???   ???   ??????      ??????      ??????  ???   ???   ???   ???   ???   ????????? ??? ???     ??? ??? ??? ??? ???   ???               ";
  const hira = "??????  ??????  ????????? ??????  ??????  ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ??? ????????? ??? ??? ??? ??? ???   ???   ???   ???   ???   ??? ????????? ????????? ????????? ????????? ?????????   ???   ???   ???   ???   ??????      ??????      ??????  ???   ???   ???   ???   ???   ??????  ???       ???   ???   ???   ???               ";

  var retVal = "";
  
  if (document.getElementById('hira').checked) retVal = hira.substring(pos, pos + 1);
  else retVal = kata.substring(pos, pos + 1);
  
  //if (retVal === "X") retVal = "";
  
  if (retVal === " ") 
    retVal = "";
  else 
    retVal = "<a href=\"#!\" onclick=\"pickMe('" + retVal + "');\" class=\"grid_picker_kana\">" + retVal + "</a>"
  
  return retVal;
}

//=================================================================================

function pickMe(picked) {
  document.getElementById('search_input').value += picked;
}

//=================================================================================

function get_stats() {
  var lit_cnt = 0;
  var kana_cnt = 0;
  var def_cnt = 0;
  var img_cnt = 0;
  
  deets.forEach((d) => {
    kana_cnt += d.katakana.length;
    kana_cnt += d.hiragana.length;
    def_cnt += d.definition.length;
    d.definition.forEach((def) => {
      img_cnt += def.example.length;
    });
  });
  
  console.log("Literals: " + deets.length);
  console.log("Kanas: " + kana_cnt);
  console.log("Meanings: " + def_cnt);
  console.log("Images: " + img_cnt);
  
  var pubs = [];
  sources.forEach((s) => {
    var fDupe = false;
    pubs.forEach((p) => {
      if(s.publisher === p.publisher) fDupe = true;
    });
    if (!fDupe) {
      var pubObj = {publisher: s.publisher, count: 0};
      pubs.push(pubObj);
    }
  });
  
  var pubCounts = [];
  sources.forEach((s) => {
    var cnt = 0;
    deets.forEach((d) => {
      d.definition.forEach((def) => {
        def.example.forEach((exa) => {
          if (exa.source === s.id) cnt++;
        });
      });
    });
    var cntObj = {publisher: s.publisher, count: cnt};
    pubCounts.push(cntObj);
  });
  
  console.log("Examples by Publisher:");
  pubs.sort((a, b) => {
    let sa = a.publisher.toLowerCase();
    let sb = b.publisher.toLowerCase();
    if (sa < sb) return -1;
    if (sa > sb) return 1;
    return 0;
  });
  pubs.forEach((p) => {
    pubCounts.forEach((c) => {
      if (p.publisher === c.publisher) p.count += c.count;
    });
    console.log("    " + p.publisher + ": " + p.count);
  });
  
}

//=================================================================================

function copier() {
  var srch = document.getElementById("search_input");
  navigator.clipboard.writeText(srch.value);
}

//=================================================================================

async function opener() {
  await prefetch();
  
  const url = window.location.search;
  if (url) {
    const params = new URLSearchParams(url);
    let srch = params.get('search');
    document.getElementById("search_input").value = srch;
    document.getElementById("match").checked = true;
    searcher();
  }
}

//=================================================================================

async function quickLoad(srch) {
  let response = await fetch(content + srch.substring(0,1) + "/" + srch + ".json");
  let details = await response.json();
  shower(details);
}

//=================================================================================

async function prefetch() {
  //Pre-fetch all records, storing in global arrray called 'deets'
  const data = await fetch(content + "json/j-ono-data.json");
  deets = await data.json();
  
  const src = await fetch(content + "json/j-ono-source.json");
  sources = await src.json();
  
  get_stats();
}

