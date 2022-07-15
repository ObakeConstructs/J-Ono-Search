//location of json data and images...
const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";

//global array to hold all definition data
let deets = [];

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
    details.katakana.forEach((itm) => {
      if(checkForMatch(itm, typ) && jap) isMatch = true;
    });    
    details.hiragana.forEach((itm) => {
      if(checkForMatch(itm, typ) && jap) isMatch = true;
    });
    if(checkForMatch(details.literal, typ) && lit) isMatch = true;
    details.definition.forEach((itm) => {
      if(checkForMatch(itm.equivalent, typ) && equ) isMatch = true;
      if(checkForMatch(itm.meaning, typ) && com) isMatch = true;
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
  
  var txt = "";
  details.katakana.forEach((itm) => {
    txt += (txt.length>0 ? ", " : "") + itm;
  });    
  var grid0 = "<div class='grid_main_block'>" + txt + "; <br />";
  
  txt = "";
  details.hiragana.forEach((itm) => {
    txt += (txt.length>0 ? ", " : "") + itm;
  });
  grid0 += txt + "</div>";
  
  //----------------------
  
  var grid1 = "<div class='grid_main_block'>" + details.literal + "</div>";
  
  //----------------------
  
  var grid2 = "<div class='grid_defs'>";
  details.definition.forEach((itm) => {
    grid2 += "<div class='grid_main_block'>" + itm.equivalent + "</div>";
    grid2 += "<div class='grid_main_block'>" + itm.meaning + "</div>";
    grid2 += "<div class='grid_main_block'>";
    itm.example.forEach((ex) => {
      var path = content + "img/" + ex.substring(0, 1) + "/" + ex + ".jpg";
      var title = "";
      const parts = ex.split("~");
      title = parts[2];
      title = title.replace("_", "&nbsp;&nbsp;");
      grid2 += "<a href=\"#!\" onclick=\"showPopup('" + path + "', '" + title + "');\">img</a> ";
    });
    grid2 += "</div>";
  });
  grid2 += "</div>";    
  
  //----------------------
  
  body = document.getElementById("grid_body");
  body.innerHTML += grid0 + grid1 + grid2;
  
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
  const kata = "アァ  イィ  ウゥヴ エェ  オォ  カ ガ キ ギ ク グ ケ ゲ コ ゴ サ ザ シ ジ ス ズ セ ゼ ソ ゾ タ ダ チ ヂ ツッヅ テ デ ト ド ナ   ニ   ヌ   ネ   ノ   ハ バパヒ ビピフ ブプヘ ベペホ ボポマ   ミ   ム   メ   モ   ヤャ      ユュ      ヨョ  ラ   リ   ル   レ   ロ   ワヮヷ ヰ ヸ     ヱ ヹ ヲ ヺ ン   ー               ";
  const hira = "あぁ  いぃ  うぅゔ えぇ  おぉ  か が き ぎ く ぐ け げ こ ご さ ざ し じ す ず せ ぜ そ ぞ た だ ち ぢ つっづ て で と ど な   に   ぬ   ね   の   は ばぱひ びぴふ ぶぷへ べぺほ ぼぽま   み   む   め   も   やゃ      ゆゅ      よょ  ら   り   る   れ   ろ   わゎ  ゐ       ゑ   を   ん   ー               ";

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
    for (let def in d.definition) {
      img_cnt += d.definition[def].example.length;
    }
  });
  
  console.log("Literals: " + deets.length);
  console.log("Kanas: " + kana_cnt);
  console.log("Meanings: " + def_cnt);
  console.log("Images: " + img_cnt);
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
  const response = await fetch(content + "j-ono-data.json");
  deets = await response.json();
  
  get_stats();
}

