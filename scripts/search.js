//location of json data and images...
const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";

//global arrays to hold definition and publisher data
let RECORDS_ARRAY = [];
let PUBLISHERS_ARRAY = [];
let UPDATES_ARRAY = [];

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

function get_meaning_by_refer(refer) {
  refer_parts = refer.split(":"); // [0] = id, [1] = definition index number
  itm = RECORDS_ARRAY.find(item => item.id === refer_parts[0]); // get the object from RECORDS_ARRAY by searching for the id
  return itm.definition[refer_parts[1] - 1].meaning; // return the meaning string using the definition index
}

//=================================================================================

function get_type_by_refer(refer) {
  refer_parts = refer.split(":"); // [0] = id, [1] = definition index number
  itm = RECORDS_ARRAY.find(item => item.id === refer_parts[0]); // get the object from RECORDS_ARRAY by searching for the id
  return itm.definition[refer_parts[1] - 1].type; // return the meaning string using the definition index
}

//=================================================================================

function get_equivs_by_refer(refer) {
  refer_parts = refer.split(":"); // [0] = id, [1] = definition index number
  itm = RECORDS_ARRAY.find(item => item.id === refer_parts[0]); // get the object from RECORDS_ARRAY by searching for the id
  
  //loop through equivs and build a quick string
  var retval = "";
  itm.definition[refer_parts[1] - 1].equivalent.forEach((eq_itm) => {    
    if (retval.length > 0) retval += ", ";
    retval += eq_itm;
  });
  return retval;
  
}

//=================================================================================

function searcher() {
  if (document.getElementById("search_input").value.length == 0) return;
  
  var jap = document.getElementById("japanese").checked;
  var rom = document.getElementById("romaji").checked;
  var equ = document.getElementById("equivalent").checked;
  var com = document.getElementById("comment").checked;
  var typ = -1;
  if (document.getElementById("match").checked) typ = 0; //exact match
  if (document.getElementById("lead").checked) typ = 1; //from start
  if (document.getElementById("any").checked) typ = 2; //anywhere

  document.getElementById("grid_body").innerHTML = "";
   
  RECORDS_ARRAY.forEach((record, idx) => {
    
    var isMatch = false;
    
    //check for romaji match
    record.romaji.forEach((itm) => {
      if(checkForMatch(itm, typ) && rom) isMatch = true;
    });
    
    //check for katakana match
    record.katakana.forEach((itm) => {
      if(checkForMatch(itm, typ) && jap) isMatch = true;
    });    
    
    //check for hiragana match
    record.hiragana.forEach((itm) => {
      if(checkForMatch(itm, typ) && jap) isMatch = true;
    });
    
    //check for definition match
    record.definition.forEach((itm) => {
      if(checkForMatch(itm.meaning, typ) && com) isMatch = true;
      itm.equivalent.forEach((eq) => {
        if(checkForMatch(eq, typ) && equ) isMatch = true;
      });
    });
    
    if (isMatch) {
      shower_results(record, idx)
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

function get_type_divs(type_string) {
  if (type_string.length == 0) return null;
  
  var type_divs = document.createElement("div");  
  var type_div = document.createElement("div"); 
  
  switch (type_string) {
    case "o": 
      type_div.innerHTML = "onomatopoeia - 擬音語 (giongo)";
      type_div.setAttribute("class", "type_block_giongo");
      type_div.title = "Imitates sounds coming from nature or objects (擬音語)"; 
      break;
    case "v":
      type_div.innerHTML = "voiced/vocal - 擬声語 (giseigo)";
      type_div.setAttribute("class", "type_block_giseigo");
      type_div.title = "Imitates vocal sounds generated by humans or animals (擬声語)";
      break;
    case "s":
      type_div.innerHTML = "state/condition - 擬態語 (gitaigo)";
      type_div.setAttribute("class", "type_block_gitaigo");
      type_div.title = "Expresses states or conditions (擬態語)";
      break;
    case "m":
      type_div.innerHTML = "motion/movement - 擬容語 (giyougo)";
      type_div.setAttribute("class", "type_block_giyogo");
      type_div.title = "Expresses motions or movements (擬容語)";
      break;
    case "e":
      type_div.innerHTML = "emotion/mental state - 擬情語 (gijougo)";
      type_div.setAttribute("class", "type_block_gijogo");
      type_div.title = "Expresses emotions or mental states (擬情語)";
      break;
    case "c":
      type_div.innerHTML = "meta/visual cue - 視覚的オノマトペ (shikaku teki)";
      type_div.setAttribute("class", "type_block_symbolic");
      type_div.title = "Conveys a moods, effects, or emphasis to scenes (視覚的オノマトペ)";
      break;
  }
  type_divs.appendChild(type_div)
  
  return type_divs;
}

//=================================================================================

function shower_results(details, deet_num) { 
  
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
  
  var rom = document.createElement("div");
  rom.setAttribute("class", "grid_main_block");
  details.romaji.forEach((itm) => {
    if (rom.innerHTML.length > 0) rom.innerHTML += ",<br />";
    rom.innerHTML += itm;
  });
  
  //----------------------
  
  var defs = document.createElement("div");
  defs.setAttribute("class", "grid_defs");  
  details.definition.forEach((itm, idx) => {  
    
    //equivalents
    var equi = document.createElement("div");
    equi.setAttribute("class", "grid_main_block");
    if (itm.refer.length > 0) {
      equi.innerHTML = get_equivs_by_refer(itm.refer);
    }
    if (itm.equivalent[0].length > 0) {
      itm.equivalent.forEach((eq_itm) => {
        if (equi.innerHTML.length > 0) equi.innerHTML += ", ";
        equi.innerHTML += eq_itm;
      });
    }
    defs.appendChild(equi);
    
    //meaning
    var meaning_div = document.createElement("div");
    meaning_div.setAttribute("class", "grid_main_block");
    var mean = document.createElement("div");
    if (itm.refer.length > 0) {
      mean.innerHTML = get_meaning_by_refer(itm.refer) + itm.meaning;
    } else {
      mean.innerHTML = itm.meaning;
    }
    meaning_div.appendChild(mean);
    
    //types
    var type_div = "";
    if (itm.refer.length > 0) {
      type_div = get_type_divs(get_type_by_refer(itm.refer))    
    } else {
      type_div = get_type_divs(itm.type)    
    }
    if (type_div) {
      meaning_div.appendChild(type_div);
    }
    
    defs.appendChild(meaning_div);
    
    //examples
    var exam = document.createElement("div");
    exam.setAttribute("class", "grid_examples");
    itm.example.forEach((ex_itm) => {
      var image_div = document.createElement("div");
      var path = content + "img/" + ex_itm.source + "/" + ex_itm.file;
      
      var link = document.createElement("a");
      link.setAttribute("href", "#!");
      link.setAttribute("class", "example");
      link.setAttribute("onclick", "showPopup('" + path + "', '" + ex_itm.display + "', '" + ex_itm.source + "', '" + ex_itm.contributor + "');");
      
      var example_image = document.createElement("img");
      example_image.setAttribute("src", path);
      example_image.setAttribute("alt", path);
      example_image.setAttribute("width", 30);
      example_image.setAttribute("height", 30);
      link.appendChild(example_image);
      image_div.appendChild(link);
      exam.appendChild(image_div);
    });
    defs.appendChild(exam);
  });
  
  //----------------------
  
  var body = document.getElementById("grid_body");
  grid_body.appendChild(kana);
  grid_body.appendChild(rom);
  grid_body.appendChild(defs);
  
}

//=================================================================================

function show_stats() {
  showOverlay();
  document.getElementById('stat_popup').style.display = 'block';
  document.getElementById('stat_text').innerHTML = "<p class=\"update_text\">J-Ono Statistics</p>";
  
  var kana_cnt = 0;
  var def_cnt = 0;
  var img_cnt = 0;
  var pub_cnt = 0;
  var mng_cnt = 0;
  
  RECORDS_ARRAY.forEach((d) => {
    kana_cnt += d.katakana.length;
    kana_cnt += d.hiragana.length;
    def_cnt += d.definition.length;
    d.definition.forEach((def) => {
      img_cnt += def.example.length;
    });
  });
  
  pub_cnt = PUBLISHERS_ARRAY.length;
  PUBLISHERS_ARRAY.forEach((p) => {
    mng_cnt += p.sources.length;
  });
  
  document.getElementById('stat_text').innerHTML += "<p class=\"update_text\">---------------------</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"stat_text\">JSON Records: " + RECORDS_ARRAY.length + "</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"stat_text\">Defined Meanings: " + def_cnt + "</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"stat_text\">Kana Recognized: " + kana_cnt + "</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"stat_text\">Example Images: " + img_cnt + "</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"stat_text\">Publisher Count: " + pub_cnt + "</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"update_text\">Manga Count: " + mng_cnt + "</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"update_text\">---------------------</p>";
  document.getElementById('stat_text').innerHTML += "<p class=\"update_text\">Recent Updates</p>";
  
  UPDATES_ARRAY.forEach((u) => {
    document.getElementById('stat_text').innerHTML += "<p class=\"stat_text\">" + u.date + " - " + u.message + "</p>";
  });
  
}

//=================================================================================


function get_romaji(kana) {
  var romaji_triplets = {
    "っしゃ":"ssha","っしゅ":"sshu","っしょ":"ssho","ッシャ":"ssha","ッシュ":"sshu","ッショ":"ssho"};
  var romaji_doublets = {
    "きゃ":"kya","きゅ":"kyu","きょ":"kyo","ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo","しゃ":"sha","しゅ":"shu","しょ":"sho","っし":"sshi","じゃ":"ja","じゅ":"ju","じょ":"jo","ちゃ":"cha",
    "ちゅ":"chu","ちょ":"cho","にゃ":"nya","にゅ":"nyu","にょ":"nyo","ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo","みゃ":"mya","みゅ":"myu","みょ":"myo","りゃ":"rya",
    "りゅ":"ryu","りょ":"ryo","キャ":"kya","キュ":"kyu","キョ":"kyo","ギャ":"gya","ギュ":"gyu","ギョ":"gyo","シャ":"sha","シュ":"shu","ショ":"sho","ッシ":"sshi","ジャ":"ja","ジュ":"ju",
    "ジョ":"jo","チャ":"cha","チュ":"chu","チョ":"cho","ニャ":"nya","ニュ":"nyu","ニョ":"nyo","ヒャ":"hya","ヒュ":"hyu","ヒョ":"hyo","ミャ":"mya","ミュ":"myu","ミョ":"myo",
    "リャ":"rya","リュ":"ryu","リョ":"ryo","ファ":"fa","フィ":"fi","フェ":"fe","フォ":"fo","フュ":"fyu","ティ":"ti","トゥ":"tu","ディ":"di","ドゥ":"du","チェ":"che",
    "シェ":"she","ジェ":"je","ウィ":"wi","ウェ":"we","ウォ":"wo","ヴァ":"va","ヴィ":"vi","ヴェ":"ve","ヴォ":"vo"};
  var romaji_singles= {
    "あ":"a","い":"i","う":"u","え":"e","お":"o","ア":"a","イ":"i","ウ":"u","ヴ":"vu","エ":"e","オ":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","カ":"ka","キ":"ki",
    "ク":"ku","ケ":"ke","コ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","サ":"sa","シ":"shi","ス":"su","セ":"se","ソ":"so","た":"ta","ち":"chi",
    "つ":"tsu","て":"te","と":"to","タ":"ta","チ":"chi","ツ":"tsu","テ":"te","ト":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","ナ":"na","ニ":"ni",
    "ヌ":"nu","ネ":"ne","ノ":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ハ":"ha","ヒ":"hi","フ":"fu","ヘ":"he","ホ":"ho","ま":"ma","み":"mi",
    "む":"mu","め":"me","も":"mo","マ":"ma","ミ":"mi","ム":"mu","メ":"me","モ":"mo","や":"ya","ゆ":"yu","よ":"yo","ヤ":"ya","ユ":"yu","ヨ":"yo","ら":"ra","り":"ri",
    "る":"ru","れ":"re","ろ":"ro","ラ":"ra","リ":"ri","ル":"ru","レ":"re","ロ":"ro","わ":"wa","を":"o","ん":"n","ワ":"wa","ヲ":"o","ン":"n","が":"ga","ぎ":"gi",
    "ぐ":"gu","げ":"ge","ご":"go","ガ":"ga","ギ":"gi","グ":"gu","ゲ":"ge","ゴ":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","ザ":"za","ジ":"ji",
    "ズ":"zu","ゼ":"ze","ゾ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","ダ":"da","ヂ":"ji","ヅ":"zu","デ":"de","ド":"do","ば":"ba","び":"bi",
    "ぶ":"bu","べ":"be","ぼ":"bo","バ":"ba","ビ":"bi","ブ":"bu","ベ":"be","ボ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po","パ":"pa","ピ":"pi",
    "プ":"pu","ペ":"pe","ポ":"po","ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o","ァ":"a","ィ":"i","ゥ":"u","ェ":"e","ォ":"o","ゃ":"ya","ゅ":"yu","ょ":"yo","ャ":"ya",
    "ュ":"yu","ョ":"yo"," ":" "};
    
  var result = kana;
  
  // pass 1 - kana triplets
  var count = result.length;
  for (let i = 0; i < count; i++) {
    let triplet = result.slice(i, i + 3);
    if (triplet in romaji_triplets) {
      result = result.replace(triplet, romaji_triplets[triplet]);
      count = result.length;
    }
  }
  
  // pass 2 - kana doublets
  for (let i = 0; i < count; i++) {
    let pair = result.slice(i, i + 2);
    if (pair in romaji_doublets) {
      result = result.replace(pair, romaji_doublets[pair]);
      count = result.length;
    }
  }
  
  // pass 3 - kana singles
  for (let i = 0; i < count; i += 1) {
    let chr = result.slice(i, i + 1);
    if (chr in romaji_singles) {
      result = result.replace(chr, romaji_singles[chr]);
      count = result.length;
    }
  }
  
  // pass 4 - orphaned tsus
  for (let i = 0; i < count; i += 1) {
    let chr = result.slice(i, i + 1);
    if (chr === "ッ" || chr === "っ") {
      result = result.replace(chr, "");
      count = result.length;
    }
  }
  
  // pass 5 - extended vowels
  for (let i = 0; i < count; i += 1) {
    let chr = result.slice(i, i + 1);
    if (chr === "ー") {
      var last_vowel = result.slice(i - 1, i)
      if (last_vowel === "a" || last_vowel === "e" || last_vowel === "i" || last_vowel === "o" || last_vowel === "u") {
        result = result.replace(chr, last_vowel);
      }
    }
  }  
  return result;
}

//=================================================================================

function showPopup(img_path, title, src, contributor) {
  showOverlay();
  document.getElementById('popup').style.display = 'block';
  document.getElementById('popup_img').src = img_path;
  document.getElementById('imgTitle').innerHTML = title;
  document.getElementById('imgSubTitle').innerHTML = get_romaji(title);
  var attribution = "Image used for education/instructional purposes only."
  var cont = "";  
  PUBLISHERS_ARRAY.forEach((pub) => {
    pub.sources.forEach((source) => {
      if (source.id === src) {
        attribution += "<br />Source: " + source.manga;
        attribution += "<br />© " + pub.publisher_name;
        if (contributor.length > 0) 
          cont = "Contributor:<br />" + contributor;
        else
          cont = "Contributor:<br /> NightBug"        
      }
    });    
  });
  document.getElementById('imgAttrib').innerHTML = attribution;  
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
  document.getElementById('pick_button').value = "⏫";
  document.getElementById('pick_button_label').innerHTML = "Collapse Kana Picker";
  refresh_picker();
}

//=================================================================================
  
function hide_picker() {
  document.getElementById('pick_place').style.display = "none";
  document.getElementById('pick_flip').style.display = "none"
  document.getElementById('pick_button').value = "⏬";
  document.getElementById('pick_button_label').innerHTML = "Expand Kana Picker";
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

function copier() {
  var srch = document.getElementById("search_input");
  navigator.clipboard.writeText(srch.value);
}

//=================================================================================

function flipper() {
  var srch = document.getElementById("search_input");
  const kata = "アァイィウゥヴエェオォカガキギクグケゲコゴサザシジスズセゼソゾタダチヂツッヅテデトドナニヌネノハバパヒビピフブプホボポマミムメモヤャユュヨョラリルレロワヮヰヱヲン"
  const hira = "あぁいぃうぅゔえぇおぉかがきぎくぐけげこごさざしじすずせぜそぞただちぢつっづてでとどなにぬねのはばぱひびぴふぶぷほぼぽまみむめもやゃゆゅよょらりるれろわゎゐゑをん"

  var newVal = "";
  for (i=0; i<srch.value.length; i++) {
    k_index = kata.indexOf(srch.value.substr(i, 1));
    h_index = hira.indexOf(srch.value.substr(i, 1));
    if (k_index > -1) {
      newVal += hira.substr(k_index, 1);
    }
    else if (h_index > -1) {
      newVal += kata.substr(h_index, 1);
    }
    else {
      newVal += srch.value.substr(i, 1);
    }
  }
  srch.value = newVal;

}

//=================================================================================

async function opener() {
  await prefetch();
  show_picker();
  
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
  //Pre-fetch all JSON data
  
  const upd = await fetch(content + "json/j-ono-updates.json");
  UPDATES_ARRAY = await upd.json();
  
  const data = await fetch(content + "json/j-ono-data.json");
  RECORDS_ARRAY = await data.json();
  
  const src = await fetch(content + "json/j-ono-source.json");
  PUBLISHERS_ARRAY = await src.json();  
  PUBLISHERS_ARRAY.sort(function(a, b){return a.publisher_name > b.publisher_name});
}

