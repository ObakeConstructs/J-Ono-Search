//location of json data and images...
var CONTENT_URL = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";

//global arrays to hold definition and publisher data
var RECORDS_ARRAY = [];
var PUBLISHERS_ARRAY = [];
var UPDATES_ARRAY = [];

//global state variable to track where we're at in the app - see change_state() function
var CURRENT_STATE = -1;
const STATES = {
  SEARCH:   0,
  RESULTS:  1,
  DETAILS:  2,
  EXAMPLES: 3,
  STATS:    4
}

//---------------------------------------------------------------

// kata/hira radio button handlers

document.getElementById('kata').addEventListener('change', function() {
  create_kana_picker()
});

document.getElementById('hira').addEventListener('change', function() {
  create_kana_picker()
});

//=================================================================================


function clearer() {
  // for clear button (litte x just inside search box)
  
  document.getElementById("search_input").value = "";
}


//=================================================================================

// reference handlers
// for those definitions that reference other definitions

function get_meaning_by_refer(refer) {
  refer_parts = refer.split(":"); // [0] = id, [1] = definition index number
  itm = RECORDS_ARRAY.find(item => item.id === refer_parts[0]); // get the object from RECORDS_ARRAY by searching for the id
  return itm.definition[refer_parts[1] - 1].meaning; // return the meaning string using the definition index
}

function get_type_by_refer(refer) {
  refer_parts = refer.split(":"); // [0] = id, [1] = definition index number
  itm = RECORDS_ARRAY.find(item => item.id === refer_parts[0]); // get the object from RECORDS_ARRAY by searching for the id
  return itm.definition[refer_parts[1] - 1].type; // return the meaning string using the definition index
}

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

function submitter() {
  //handles URL searching
  
  let url = new URL(window.location.href.split("?")[0]);
  let search_val = document.getElementById("search_input").value;
  
  if (search_val.length > 0) {
    url.searchParams.set("search", search_val);
    
    if (document.getElementById("search_method_exact").checked)
      url.searchParams.set("method", "exact");
    
    if (document.getElementById("search_method_any").checked)
      url.searchParams.set("method", "any");
    
    if (document.getElementById("search_for_extended").checked)
      url.searchParams.set("for", "extended");
  }
  
  window.location.href = url.href;
  
}

//=================================================================================

function checkForHiragana(search_str) {
  // checks if string contains hiragana and properly sets hira/kata radio button
  
  const hira = "あぁいぃうぅゔえぇおぉかがきぎくぐけげこごさざしじすずせぜそぞただちぢつっづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもやゃゆゅよょらりるれろわゎゐゑをん";
  for (const c of search_str) {
    h_index = hira.indexOf(c);
    if (h_index > -1) {
      document.getElementById('hira').checked = true;
      create_kana_picker()
      return;
    }
  }
}

//=================================================================================

function searcher() {
  // primary search loop
  if (document.getElementById("search_input").value.length == 0) return;
  
  var search_default =  document.getElementById("search_for_default").checked;
  var search_extended = document.getElementById("search_for_extended").checked;
  
  var typ = -1;
  if (document.getElementById("search_method_exact").checked) typ = 0; //exact match
  if (document.getElementById("search_method_lead").checked) typ = 1; //from start
  if (document.getElementById("search_method_any").checked) typ = 2; //anywhere
  
  document.getElementById("results_body").innerHTML = "";
   
  RECORDS_ARRAY.forEach((record, record_index) => {
    
    var isMatch = false;
    
    //check for romaji match
    record.romaji.forEach((itm) => {
      if(checkForMatch(itm, typ)) isMatch = true;
    });
    
    //check for katakana match
    record.katakana.forEach((itm) => {
      if(checkForMatch(itm, typ)) isMatch = true;
    });    
    
    //check for hiragana match
    record.hiragana.forEach((itm) => {
      if(checkForMatch(itm, typ)) isMatch = true;
    });
    
    //check for definition match
    record.definition.forEach((itm) => {
      if(checkForMatch(itm.meaning, typ) && search_extended) isMatch = true;
      itm.equivalent.forEach((eq) => {
        if(checkForMatch(eq, typ) && search_extended) isMatch = true;
      });
    });
    
    if (isMatch) {
      display_results(record_index)
    }
  });
}

//=================================================================================

function checkForMatch(str1, typ) {
  // compares search string against definition string (str1) by comparison method (typ)
  // (remove all spaces and sets to lowercase before comparisons)
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
  // create and return pretty text block for each fx types
  if (type_string.length == 0) return null;
  
  var type_divs = document.createElement("div");  
  var type_div = document.createElement("div"); 
  
  switch (type_string) {
    case "o": 
      type_div.innerHTML = "onomatopoeia - 擬音語 (giongo)";
      type_div.setAttribute("class", "type_block");
      type_div.style.border = "1px solid #af4b4b";
      type_div.style.backgroundColor = "#150907";
      type_div.style.color = "#af4b4b";
      type_div.title = "Imitates sounds coming from nature or objects (擬音語)"; 
      break;
    case "v":
      type_div.innerHTML = "voiced/vocal - 擬声語 (giseigo)";
      type_div.setAttribute("class", "type_block");
      type_div.style.border = "1px solid #c9b04a";
      type_div.style.backgroundColor = "#171407";
      type_div.style.color = "#c9b04a";
      type_div.title = "Imitates vocal sounds generated by humans or animals (擬声語)";
      break;
    case "s":
      type_div.innerHTML = "state/condition - 擬態語 (gitaigo)";
      type_div.setAttribute("class", "type_block");
      type_div.style.border = "1px solid #7daaca";
      type_div.style.backgroundColor = "#0f1315";
      type_div.style.color = "#7daaca";
      type_div.title = "Expresses states or conditions (擬態語)";
      break;
    case "m":
      type_div.innerHTML = "motion/movement - 擬容語 (giyougo)";
      type_div.setAttribute("class", "type_block");
      type_div.style.border = "1px solid #619161";
      type_div.style.backgroundColor = "#0c1009";
      type_div.style.color = "#619161";
      type_div.title = "Expresses motions or movements (擬容語)";
      break;
    case "e":
      type_div.innerHTML = "emotion/mental state - 擬情語 (gijougo)";
      type_div.setAttribute("class", "type_block");
      type_div.style.border = "1px solid #8b618b";
      type_div.style.backgroundColor = "#100b0d";
      type_div.style.color = "#8b618b";
      type_div.title = "Expresses emotions or mental states (擬情語)";
      break;
    case "c":
      type_div.innerHTML = "meta/visual cue - 視覚的オノマトペ (shikaku teki)";
      type_div.setAttribute("class", "type_block");
      type_div.style.border = "1px solid #ffffff";
      type_div.style.backgroundColor = "#202020";
      type_div.style.color = "#ffffff";
      type_div.title = "Conveys a moods, effects, or emphasis to scenes (視覚的オノマトペ)";
      break;
  }
  type_divs.appendChild(type_div)
  
  return type_divs;
}

//=================================================================================

function get_kana_div(record_index) {
  // returns a new "kana" div (combination of both hiragana and katakana)
  
  let record = RECORDS_ARRAY[record_index];
  
  let kata = document.createElement("div");
  kata.setAttribute("class", "grid_kana");
  record.katakana.forEach((itm) => {
    if (kata.innerHTML.length>0) kata.innerHTML += ", ";
    kata.innerHTML += itm
  });
  
  let hira = document.createElement("div");
  hira.setAttribute("class", "grid_kana");
  record.hiragana.forEach((itm) => {
    if (hira.innerHTML.length>0) hira.innerHTML += ", ";
    hira.innerHTML += itm
  });
  
  let kana = document.createElement("div");
  kana.setAttribute("class", "grid_main_block");
  kana.appendChild(kata);
  kana.appendChild(hira);
  
  return kana;
}

//=================================================================================

function get_romaji_div(record_index) {  
  // returns a new "romaji" div (combines all romajis into a single block)
  
  let record = RECORDS_ARRAY[record_index];
  
  let rom = document.createElement("div");
  rom.setAttribute("class", "grid_main_block");
  record.romaji.forEach((itm) => {
    if (rom.innerHTML.length>0) rom.innerHTML += ",<br />";
    rom.innerHTML += itm
  });
  
  return rom;
}

//=================================================================================

function display_results(record_index) {
  // get and display search results  
  
  let kana = get_kana_div(record_index);
  let rom = get_romaji_div(record_index);  
  let record = RECORDS_ARRAY[record_index];
  
  let expander = document.createElement("div");
  expander.setAttribute("class", "grid_main_block_expander");
  let expand_button = document.createElement("input");
  expand_button.setAttribute("type", "button");
  expand_button.setAttribute("class", "control");
  expand_button.setAttribute("onclick", "display_details(\"" + record_index + "\")");
  expand_button.setAttribute("value", "☶");
  expander.appendChild(expand_button);
  
  let results = document.getElementById("results_body");
  results.appendChild(kana);
  results.appendChild(rom);
  results.appendChild(expander);
  
}

//=================================================================================

function set_def_div(record_index) {
  // get and display search results  
  
  let record = RECORDS_ARRAY[record_index];
  
  let defs = document.getElementById("details_body_def");
  
  defs.innerHTML = "";  
  defs.setAttribute("class", "grid_details_definition");  
  record.definition.forEach((definition, definition_index) => {
    
    //equivalents
    var equi = document.createElement("div");
    equi.setAttribute("class", "grid_main_block");
    if (definition.refer.length > 0) {
      equi.innerHTML = get_equivs_by_refer(definition.refer);
    }
    if (definition.equivalent[0].length > 0) {
      definition.equivalent.forEach((eq_itm) => {
        if (equi.innerHTML.length > 0) equi.innerHTML += ", ";
        equi.innerHTML += eq_itm;
      });
    }
    defs.appendChild(equi);
    
    //meaning
    var meaning_div = document.createElement("div");
    meaning_div.setAttribute("class", "grid_main_block");
    var mean = document.createElement("div");
    if (definition.refer.length > 0) {
      mean.innerHTML = get_meaning_by_refer(definition.refer) + definition.meaning;
    } else {
      mean.innerHTML = definition.meaning;
    }
    meaning_div.appendChild(mean);
    
    //types
    var type_div = "";
    if (definition.refer.length > 0) {
      type_div = get_type_divs(get_type_by_refer(definition.refer))    
    } else {
      type_div = get_type_divs(definition.type)    
    }
    if (type_div) {
      meaning_div.appendChild(type_div);
    }
    defs.appendChild(meaning_div);
    
    //examples
    var exam = document.createElement("div");
    exam.setAttribute("class", "grid_example_expander");
    
    
    let examples_button = document.createElement("input");
    examples_button.setAttribute("type", "button");
    examples_button.setAttribute("class", "example_button");
    examples_button.setAttribute("onclick", "show_examples(" + record_index + ", " + definition_index + ");");      
    examples_button.setAttribute("value", definition.example.length + " ex.");
    exam.appendChild(examples_button);
    
    defs.appendChild(exam);
  });
  
}

//=================================================================================

function returner() {
  // handles "Return" button - i.e. change state
  
  console.log("current state: " + CURRENT_STATE);
  switch (CURRENT_STATE) {
    case STATES.EXAMPLES:
      change_state(STATES.DETAILS);
      break;
    default:
      change_state(STATES.RESULTS);
  }
}

//=================================================================================

function change_state(state) {
  // handles state changes (hides and shows root wrapper divs)

  document.getElementById("title_wrapper").style.display = "none";
  document.getElementById("search_wrapper").style.display = "none";
  document.getElementById("results_wrapper").style.display = "none";
  document.getElementById("details_wrapper").style.display = "none";
  document.getElementById("examples_wrapper").style.display = "none";
  document.getElementById("return_wrapper").style.display = "none";

  CURRENT_STATE = state;
  
  switch (state) {
    case STATES.DETAILS:
      document.getElementById("return_wrapper").style.display = "block";
      document.getElementById("details_wrapper").style.display = "block";
      break;
    case STATES.EXAMPLES:
      document.getElementById("return_wrapper").style.display = "block";
      document.getElementById("examples_wrapper").style.display = "block";
      break;
    case STATES.RESULTS:
      document.getElementById("title_wrapper").style.display = "grid";
      document.getElementById("search_wrapper").style.display = "grid";
      document.getElementById("results_wrapper").style.display = "block";
    
    default: // STATES.SEARCH
      document.getElementById("title_wrapper").style.display = "grid";
      document.getElementById("search_wrapper").style.display = "grid";
  }

}

//=================================================================================

function display_details(record_index) {
  // handles the various "more" buttons - changes state and shows details of a specific record
  
  let record = RECORDS_ARRAY[record_index]
  
  let kana = get_kana_div(record_index);
  let rom = get_romaji_div(record_index);
  
  let details_jr = document.getElementById("details_body_jr");
  let details_body_def = document.getElementById("details_body_def");
  
  change_state(STATES.DETAILS);
  
  details_jr.innerHTML = "";
  details_jr.appendChild(kana);
  details_jr.appendChild(rom);
  set_def_div(record_index);
  
}

//=================================================================================

function unblur_example_image(example_index) {
  // removes the NSFW blurring effect from an image
  
  document.getElementById("nsfw_button_" + example_index).style.display = "none";
  document.getElementById("example_image_" + example_index).classList.remove("blurred_example_image")
}

//=================================================================================

function show_examples(record_index, definition_index) {
  // handles the various example buttons - changes state and displays all example images
  
  let examples = RECORDS_ARRAY[record_index].definition[definition_index].example;
  
  examples_div = document.getElementById("examples_wrapper");
  examples_div.innerHTML = "";
  
  change_state(STATES.EXAMPLES);
  
  examples.forEach((example, example_index) => {
    let example_body = document.createElement("div");
    example_body.setAttribute("class", "example_body");
    
    //image
    let img = document.createElement("img");
    let path = CONTENT_URL + "img/" + example.source + "/" + example.file;
    img.setAttribute("class", "example_image");
    img.setAttribute("src", path);
    img.setAttribute("id", "example_image_" + example_index);
    if(example.nsfw) {
      img.classList.add("blurred_example_image");
    }    
    example_body.appendChild(img);
    
    //nsfw button (conditional)
    if(example.nsfw) {
      let nsfw_button = document.createElement("input");
      nsfw_button.setAttribute("type", "button");
      nsfw_button.setAttribute("class", "nsfw_button");
      nsfw_button.setAttribute("id", "nsfw_button_" + example_index);
      nsfw_button.setAttribute("onclick", "unblur_example_image(" + example_index + ");");
      nsfw_button.setAttribute("value", "NSFW Content - Tap to view");
      example_body.appendChild(nsfw_button);
    }
    
    //title
    let title = document.createElement("div");
    title.setAttribute("class", "example_title");
    title.innerHTML = example.display;
    example_body.appendChild(title);
    
    //subtitle
    let subtitle = document.createElement("div");
    subtitle.setAttribute("class", "example_subtitle");
    subtitle.innerHTML = get_romaji(example.display);
    example_body.appendChild(subtitle);
    
    //attribution
    let attribution = document.createElement("div");
    attribution.setAttribute("class", "example_attribution");
    PUBLISHERS_ARRAY.forEach((pub) => {
      pub.sources.forEach((source) => {
        if (source.id === example.source) {
          attribution.innerHTML = "Image used for education/instructional purposes only.<br />Source: " + source.manga + "<br />"
          if (pub.publisher_name === "doujinshi") {
            attribution.innerHTML += "(doujinshi by " + source.author + ")";
          } else {
            attribution.innerHTML += "© " + pub.publisher_name;
          }
        }
      });
    });
    example_body.appendChild(attribution);
    
    //contribution
    let contribution = document.createElement("div");
    contribution.setAttribute("class", "example_contribution");
    contribution.innerHTML = "Contributor:<br />";
    if (example.contributor.length > 0) {
      contribution.innerHTML += example.contributor;
    } else {
      contribution.innerHTML += "NightBug";
    }
    example_body.appendChild(contribution);
    
    //final example image
    examples_div.appendChild(example_body);
  });
  
}

//=================================================================================

/*
function show_stats() {
  // PENDING/PLANNED
  
  let stats = document.getElementById('stat_text');
  
  document.getElementById('black_overlay').style.display = 'block';
  document.getElementById('stat_popup').style.display = 'block';
    
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
  
  
  stats.innerHTML = "<p class=\"stat_header\">J-Ono Statistics</p>";
  stats.innerHTML += "<p class=\"stat_text\"><b>Defined Meanings</b>: <i>" + def_cnt + "</i></p>";
  stats.innerHTML += "<p class=\"stat_text\"><b>Recognized Kanas</b>: <i>" + kana_cnt + "</i></p>";
  stats.innerHTML += "<p class=\"stat_text\"><b>Example Images</b>: <i>" + img_cnt + "</i></p>";
  stats.innerHTML += "<p class=\"stat_text\"><b>Referenced Mangas</b>: <i>" + mng_cnt + "</i></p>";
  stats.innerHTML += "<p class=\"stat_text\"><b>Referenced Publishers</b>: <i>" + pub_cnt + "</i></p><br />";
  
  stats.innerHTML += "<p class=\"stat_header\">Recent Updates</p>";  
  UPDATES_ARRAY.forEach((u) => {
    stats.innerHTML += "<p class=\"stat_text\"><b>" + u.date + "</b>: <i>" + u.message + "</i></p>";
  });
  
}
*/

//=================================================================================

function get_romaji(kana) {
  // dynamically create romaji for example images
  
  var romaji_triplets = {
    "っしゃ":"ssha","っしゅ":"sshu","っしょ":"ssho","ッシャ":"ssha","ッシュ":"sshu","ッショ":"ssho"};
  var romaji_doublets = {
    "きゃ":"kya","きゅ":"kyu","きょ":"kyo","ぎゃ":"gya","ぎゅ":"gyu","ぎょ":"gyo","しゃ":"sha","しゅ":"shu","しょ":"sho","っし":"sshi","じゃ":"ja","じゅ":"ju","じょ":"jo",
    "ちゃ":"cha","ちゅ":"chu","ちょ":"cho","にゃ":"nya","にゅ":"nyu","にょ":"nyo","ひゃ":"hya","ひゅ":"hyu","ひょ":"hyo","みゃ":"mya","みゅ":"myu","みょ":"myo","りゃ":"rya",
    "りゅ":"ryu","りょ":"ryo","キャ":"kya","キュ":"kyu","キョ":"kyo","ギャ":"gya","ギュ":"gyu","ギョ":"gyo","シャ":"sha","シュ":"shu","ショ":"sho","ッシ":"sshi","ジャ":"ja",
    "ジュ":"ju","ジョ":"jo","チャ":"cha","チュ":"chu","チョ":"cho","ニャ":"nya","ニュ":"nyu","ニョ":"nyo","ヒャ":"hya","ヒュ":"hyu","ヒョ":"hyo","ミャ":"mya","ミュ":"myu",
    "ミョ":"myo","リャ":"rya","リュ":"ryu","リョ":"ryo","ファ":"fa","フィ":"fi","フェ":"fe","フォ":"fo","フュ":"fyu","ティ":"ti","トゥ":"tu","ディ":"di","ドゥ":"du","チェ":"che",
    "シェ":"she","ジェ":"je","ウィ":"wi","ウェ":"we","ウォ":"wo","ヴァ":"va","ヴィ":"vi","ヴェ":"ve","ヴォ":"vo"};
  var romaji_singles= {
    "あ":"a","い":"i","う":"u","え":"e","お":"o","ア":"a","イ":"i","ウ":"u","ヴ":"vu","エ":"e","オ":"o","か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko","カ":"ka",
    "キ":"ki","ク":"ku","ケ":"ke","コ":"ko","さ":"sa","し":"shi","す":"su","せ":"se","そ":"so","サ":"sa","シ":"shi","ス":"su","セ":"se","ソ":"so","た":"ta","ち":"chi",
    "つ":"tsu","て":"te","と":"to","タ":"ta","チ":"chi","ツ":"tsu","テ":"te","ト":"to","な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no","ナ":"na","ニ":"ni",
    "ヌ":"nu","ネ":"ne","ノ":"no","は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho","ハ":"ha","ヒ":"hi","フ":"fu","ヘ":"he","ホ":"ho","ま":"ma","み":"mi",
    "む":"mu","め":"me","も":"mo","マ":"ma","ミ":"mi","ム":"mu","メ":"me","モ":"mo","や":"ya","ゆ":"yu","よ":"yo","ヤ":"ya","ユ":"yu","ヨ":"yo","ら":"ra","り":"ri",
    "る":"ru","れ":"re","ろ":"ro","ラ":"ra","リ":"ri","ル":"ru","レ":"re","ロ":"ro","わ":"wa","ゎ":"wa","を":"o","ん":"n","ワ":"wa","ヮ":"wa","ヲ":"o","ン":"n","が":"ga",
    "ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go","ガ":"ga","ギ":"gi","グ":"gu","ゲ":"ge","ゴ":"go","ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo","ザ":"za","ジ":"ji",
    "ズ":"zu","ゼ":"ze","ゾ":"zo","だ":"da","ぢ":"ji","づ":"zu","で":"de","ど":"do","ダ":"da","ヂ":"ji","ヅ":"zu","デ":"de","ド":"do","ば":"ba","び":"bi",
    "ぶ":"bu","べ":"be","ぼ":"bo","バ":"ba","ビ":"bi","ブ":"bu","ベ":"be","ボ":"bo","ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po","パ":"pa","ピ":"pi",
    "プ":"pu","ペ":"pe","ポ":"po","ぁ":"a","ぃ":"i","ぅ":"u","ぇ":"e","ぉ":"o","ァ":"a","ィ":"i","ゥ":"u","ェ":"e","ォ":"o","ゃ":"ya","ゅ":"yu","ょ":"yo","ャ":"ya",
    "ュ":"yu","ョ":"yo","ゔ":"vu"," ":" "};
    
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
  while (result.search("ッ") >= 0) {
    result = result.replace("ッ", "");
  }
  while (result.search("っ") >= 0) {
    result = result.replace("っ", "");
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

function create_kana_picker() {
  // create the Kana Picker matrix
  
  place = document.getElementById('pick_place');
  const div1 = "<div class=\"kana_picker_cell_two_by_two\">";
  const div2 = "<div class=\"kana_picker_button_cell\">";
  const div_close = "</div>";
  
  place.innerHTML = "";
  
  var picker_cnt = 0;
  for (var i=0; i<55; i++) {
    var tmp = "";
    if(i == 36 || i == 38 || i == 47 || i > 51) {
      tmp = "<div class=\"kana_picker_empty_cell\"></div>";
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
  // return the kana link associated with the Kana Picker position (pos)
  
  const kata = "アァ  イィ  ウゥヴ エェ  オォ  カ ガ キ ギ ク グ ケ ゲ コ ゴ サ ザ シ ジ ス ズ セ ゼ ソ ゾ タ ダ チ ヂ ツッヅ テ デ ト ド ナ   ニ   ヌ   ネ   ノ   ハ バパヒ ビピフ ブプヘ ベペホ ボポマ   ミ   ム   メ   モ   ヤャ      ユュ      ヨョ  ラ   リ   ル   レ   ロ   ワヮヷ ヰ ヸ     ヱ ヹ ヲ ヺ ン   ー               ";
  const hira = "あぁ  いぃ  うぅゔ えぇ  おぉ  か が き ぎ く ぐ け げ こ ご さ ざ し じ す ず せ ぜ そ ぞ た だ ち ぢ つっづ て で と ど な   に   ぬ   ね   の   は ばぱひ びぴふ ぶぷへ べぺほ ぼぽま   み   む   め   も   やゃ      ゆゅ      よょ  ら   り   る   れ   ろ   わゎ  ゐ       ゑ   を   ん   ー               ";

  var retVal = "";
  
  if (document.getElementById('hira').checked) 
    retVal = hira.substring(pos, pos + 1);
  else 
    retVal = kata.substring(pos, pos + 1);
    
  if (retVal === " ") 
    retVal = "";
  else
    retVal = "<input type=\"button\" onclick=\"pickMe('" + retVal + "');\" class=\"new_kana_picker_button\" value=\"" + retVal + "\"/>"
  
  return retVal;
}

//=================================================================================

function pickMe(picked) {
  // add clicked kana to search text
  document.getElementById('search_input').value += picked;
}

//=================================================================================

function copier() {
  // copies search text to clipboard
  var srch = document.getElementById("search_input");
  navigator.clipboard.writeText(srch.value);
}

//=================================================================================

function kana_type_flipper() {
  // flips search text between katakana and hiragana
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

function toggle_kana_picker() {
  var picker = document.getElementById("kana_picker");
  if (picker.style.display === "grid") {
    picker.style.display = "none";
  }
  else {
    picker.style.display = "grid";
  }
}  

//=================================================================================

async function prefetch() {
  //Pre-fetch JSON data
  
  const upd = await fetch(CONTENT_URL + "json/j-ono-updates.json");
  UPDATES_ARRAY = await upd.json();
  
  const data = await fetch(CONTENT_URL + "json/j-ono-data.json");
  RECORDS_ARRAY = await data.json();
  
  const src = await fetch(CONTENT_URL + "json/j-ono-source.json");
  PUBLISHERS_ARRAY = await src.json();  
  PUBLISHERS_ARRAY.sort(function(a, b){return a.publisher_name > b.publisher_name});
}

//=================================================================================

async function opener() {
  await prefetch();
  create_kana_picker();
  
  // set visibility for those divs not controlled by state
  document.getElementById("scripts_alert").style.display = "none";
  document.getElementById("footer_wrapper").style.display = "block";
  
  
  const url_search = window.location.search;  
  if (url_search) {
    // search parameters found in URL string
    change_state(STATES.RESULTS);
    const params = new URLSearchParams(url_search);
    let search_value = params.get("search");
    let search_method = params.get("method");
    let search_for = params.get("for");

    if (search_method) {
      document.getElementById("search_method_exact").checked = (search_method == "exact");
      document.getElementById("search_method_any").checked = (search_method == "any");
      document.getElementById("search_method_lead").checked = (search_method == "leading");
    }
    
    if (search_for) {
      document.getElementById("search_for_default").checked = (search_for == "default");
      document.getElementById("search_for_extended").checked = (search_for == "extended");
    }
    
    if (search_value) {
      document.getElementById("search_input").value = search_value;
    }
    checkForHiragana(search_value);
    searcher();
  } else {
    // no search parameters in URL string
    change_state(STATES.SEARCH);
    document.getElementById("kana_picker").style.display = "grid";  
  }
  
}
