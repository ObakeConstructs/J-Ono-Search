
var srch = ""
var jap = false;
var lit = false;
var equ = false;
var com = false;
var typ = 0; //(full)

const content_json = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/json/";
const content_img = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/img/";
  
const deets = [];

//=================================================================================

document.getElementById("search_input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searcher();
  }
});

//=================================================================================

document.getElementById('kata').addEventListener('change', function() {
  refresh_picker()
});

//=================================================================================

document.getElementById('hira').addEventListener('change', function() {
  refresh_picker()
});

//=================================================================================

function clearer() {
  document.getElementById("search_input").value = "";
}

//=================================================================================

function searcher() {
  srch = document.getElementById("search_input").value;
  if (srch.length == 0) return;
  jap = document.getElementById("japanese").checked;
  lit = document.getElementById("literal").checked;
  equ = document.getElementById("equivalent").checked;
  com = document.getElementById("comment").checked;
  if (document.getElementById("match").checked) typ = 0; //(match)
  if (document.getElementById("lead").checked) typ = 1; //(lead)
  if (document.getElementById("any").checked) typ = 2; //(any)

  document.getElementById("output_body").innerHTML = "";
  
  deets.forEach((details) => {
    var isMatch = false;    
    details.katakana.forEach((itm) => {
      if(checkForMatch(itm) && jap) isMatch = true;
    });    
    details.hiragana.forEach((itm) => {
      if(checkForMatch(itm) && jap) isMatch = true;
    });
    if(checkForMatch(details.literal) && lit) isMatch = true;
    details.definition.forEach((itm) => {
      if(checkForMatch(itm.equivalent) && equ) isMatch = true;
      if(checkForMatch(itm.meaning) && com) isMatch = true;
    });
    
    if (isMatch) shower(details);
  });
}

//=================================================================================

function checkForMatch(str1) {
  switch (typ) {
    case 0:
      if(str1 === srch) { return true; }
      break;
    case 1:
      if(str1.substring(0, srch.length) === srch) { return true; }
      break;
    case 2:
      if(str1.includes(srch)) { return true; }
  }
  return false;
}

//=================================================================================

function shower(details) { 
  
  var txt = "";
  details.katakana.forEach((itm) => {
    txt += (txt.length>0 ? ", " : "") + itm;
  });    
  var cell0 = txt + "; <br />";
  
  txt = "";
  details.hiragana.forEach((itm) => {
    txt += (txt.length>0 ? ", " : "") + itm;
  });
  cell0 += txt;
  
  //----------------------
  
  var cell2 = "<table class=\"inner\" frame=\"void\" >";
  details.definition.forEach((itm) => {
    cell2 += "<tr width=\"100%\">";
    cell2 += "<td class=\"inner_b\" width=\"226px\" style=\"\">" + itm.equivalent + "</td>";
    cell2 += "<td class=\"inner_b\" width=\"224px\">" + itm.meaning + "</td>";
    cell2 += "<td class=\"inner\">";
    itm.example.forEach((ex) => {
      var path = content_img + ex.substring(0, 1) + "/" + ex + ".jpg";
      cell2 += "<a href=\"#!\" onclick=\"showPopup('" + path + "');\">img</a> ";
    });
    cell2 += "</td></tr>";
  });
  cell2 += "</table>";    
  
  //----------------------
  
  tbl = document.getElementById("output_body");
  var r = tbl.insertRow(-1);
  var c0 = r.insertCell(0);
  var c1 = r.insertCell(1);
  var c2 = r.insertCell(2);
  c2.colSpan = 3;
  c2.style.padding=0;
  c0.innerHTML = cell0;
  c1.innerHTML = details.literal;
  c2.innerHTML = cell2;
  
}

//=================================================================================

function show_picker() {
  if (document.getElementById('pick_place').style.display === "grid") {
    hide_picker();
    return;
  }
  
  document.getElementById('pick_place').style.display = "grid";
  document.getElementById('pick_flip').style.display = "grid"
  document.getElementById('pick_button').value = "⏫";
  
  refresh_picker();
}

//=================================================================================
  
function hide_picker() {
  document.getElementById('pick_place').style.display = "none";
  document.getElementById('pick_flip').style.display = "none"
  document.getElementById('pick_button').value = "⏬";
}

//=================================================================================

function refresh_picker() {
  place = document.getElementById('pick_place');
  const div1 = "<div class=\"picker_block\">";
  const div2 = "<div class=\"picker_pick\">";
  const div_close = "</div>";
  
  place.innerHTML = "";
  
  var picker_cnt = 0;
  for (var i=0; i<52; i++) {
    var tmp = "";
    if(i == 36 || i == 38 || i == 47) {
      tmp = "<div class=\"picker_block_gray\"></div>";
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
  const kata = "アァ  イィ  ウゥヴ エェ  オォ  カ ガ キ ギ ク グ ケ ゲ コ ゴ サ ザ シ ジ ス ズ セ ゼ ソ ゾ タ ダ チ ヂ ツッヅ テ デ ト ド ナ   ニ   ヌ   ネ   ノ   ハ バパヒ ビピフ ブプヘ ベペホ ボポマ   ミ   ム   メ   モ   ヤャ      ユュ      ヨョ  ラ   リ   ル   レ   ロ   ワヮヷ ヰ ヸ     ヱ ヹ ヲ ヺ ン   ー               ";
  const hira = "あぁ  いぃ  うぅゔ えぇ  おぉ  か が き ぎ く ぐ け げ こ ご さ ざ し じ す ず せ ぜ そ ぞ た だ ち ぢ つっづ て で と ど な   に   ぬ   ね   の   は ばぱひ びぴふ ぶぷへ べぺほ ぼぽま   み   む   め   も   やゃ      ゆゅ      よょ  ら   り   る   れ   ろ   わゎ  ゐ       ゑ   を   ん   ー               ";

  var retVal = "";
  
  if (document.getElementById('hira').checked) retVal = hira.substring(pos, pos + 1);
  else retVal = kata.substring(pos, pos + 1);
  
  //if (retVal === "X") retVal = "";
  
  if (retVal === " ") 
    retVal = "";
  else 
    retVal = "<a href=\"#!\" onclick=\"pickMe('" + retVal + "');\" class=\"pick\">" + retVal + "</a>"
  
  return retVal;
}

//=================================================================================

function pickMe(picked) {
  document.getElementById('search_input').value += picked;
}

//=================================================================================

function display_stats() {
  var lit_cnt = 0;
  var kana_cnt = 0;
  var def_cnt = 0;
  var img_cnt = 0;
  
  deets.forEach((d) => {
    kana_cnt += d.katakana.length;
    kana_cnt += d.hiragana.length;
    def_cnt += d.definition.length;
    for (let def in d.definition) {
      img_cnt += d.definition[def].example.length;
    }
  });
  
  var foot = document.getElementById("output_footer");
  foot.innerHTML = "<br /><br /><br />";
  foot.innerHTML += "Literals: " + deets.length + "<br />";
  foot.innerHTML += "Japanese FXs: " + kana_cnt + "<br />";
  foot.innerHTML += "Meanings: " + def_cnt + "<br />";
  foot.innerHTML += "Images: " + img_cnt + "<br />";
}

//=================================================================================

function copier() {
  var srch = document.getElementById("search_input");
  navigator.clipboard.writeText(srch.value);
}

//=================================================================================

function opener() {
  //check for search parameters
  const url = window.location.search;
  const params = new URLSearchParams(url);
  let srch = params.get('search');
  document.getElementById("search_input").value = srch;
  srch = srch.replace("%20", "_");
  srch = srch.replace(" ", "_");
  quickLoad(srch);
  
  prefetch();
}

//=================================================================================

async function quickLoad(srch) {
  let response = await fetch(content_json + srch.substring(0,1) + "/" + srch + ".json");
  let details = await response.json();
  shower(details);
}

//=================================================================================

async function prefetch() {
  //Pre-fetch all records, store all in global arrray called 'deets' - modern browsers should cache these
  document.getElementById("note").innerHTML = "Loading records from JSON (this may take a few seconds)...";
  const response = await fetch(content_json + "index.json");
  idx = await response.json();
  for (let i in idx) {
    let response = await fetch(content_json + idx[i].substring(0,1) + "/" + idx[i] + ".json");
    let details = await response.json();
    deets.push(details);
  }
  document.getElementById("note").innerHTML = "";
  
  //display_stats();
}

