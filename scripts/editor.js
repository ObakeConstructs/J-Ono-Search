const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";
let deets = [];
let pubs = [];

var bUpdated = false;
var textElements = document.querySelectorAll('.input_field');

//=================================================================================

document.addEventListener("keyup", function(event) {
  if (event.key.length == 1) {
    bUpdated = true;
    document.getElementById("modified_label").style.display = "block";
  }
});

//======================================================================================================

function findRecordIndexByLiteral(search_val) {
  return deets.findIndex(item => item.literal === search_val);  
}

//======================================================================================================
  
function newRecord() {
  if (bUpdated) {
    showOverlay();
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
    return;
  }
  
  document.getElementById("column_lit").innerHTML = "";
  document.getElementById("column_kana").innerHTML = "";
  document.getElementById("column_def").innerHTML = "";
  
  addRow_literal();
  addRow_kana();
  addRow_def();
  
  bUpdated = false;
  document.getElementById("modified_label").style.display = "none";
  }
  
//======================================================================================================

function addRow_literal() {
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", "lit");
  newInput.setAttribute("class", "input_field");
  newInput.setAttribute("placeholder", "literal value");
  
  var newDiv = document.createElement("div");
  newDiv.className = "grid_lit";
  newDiv.appendChild(newInput);
  
  var col = document.getElementById("column_lit");
  col.appendChild(newDiv);
}

//======================================================================================================
 
function addRow_kana() {
  var btn = document.getElementById("button_kana");
  if (btn) {
    btn.outerHTML = "";
  }
  
  var newDiv = document.createElement("div");
  newDiv.className = "grid_kana";
  
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", "kata");
  newInput.setAttribute("class", "input_field");
  newInput.setAttribute("placeholder", "katakana value");
  newDiv.appendChild(newInput);
  
  newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", "hira");
  newInput.setAttribute("class", "input_field");
  newInput.setAttribute("placeholder", "hiragana value");
  newDiv.appendChild(newInput);
  
  var col = document.getElementById("column_kana");
  col.appendChild(newDiv);  
  col.appendChild(getButtons("kana"));
}

//======================================================================================================

function addRow_def() {
  var btn = document.getElementById("button_def");
  if (btn) {
    btn.outerHTML = "";
  }
  
  var lit_rows = document.getElementsByClassName("grid_lit");
  var lit_value = lit_rows[0].children[0].value
  var base_name = lit_value.replace(" ", "_");
      
  //----------------------------------------------------------------------------------------------------
  
  //--- text input - refer
  var re_text = document.createElement("input");
  re_text.setAttribute("type", "text");
  re_text.setAttribute("name", "refer");
  re_text.setAttribute("class", "input_field");
  re_text.setAttribute("placeholder", "reference");
  
  //--- text input - meaning
  var me_text = document.createElement("input");
  me_text.setAttribute("type", "text");
  me_text.setAttribute("name", "mean");
  me_text.setAttribute("class", "input_field");
  me_text.setAttribute("placeholder", "meaning");
  
  //--- text input - equivalent
  var eq_text = document.createElement("input");
  eq_text.setAttribute("type", "text");
  eq_text.setAttribute("name", "equi");
  eq_text.setAttribute("class", "input_field");
  eq_text.setAttribute("placeholder", "equivalent values");
  
  //--- equivalent plus button
  var eq_btn_add = document.createElement("input");
  eq_btn_add.setAttribute("type", "button");
  eq_btn_add.setAttribute("onClick", "javascript: addRow_equi(" + (document.getElementsByClassName("grid_def").length) + ");" );
  eq_btn_add.setAttribute("tabindex", "-1");
  eq_btn_add.value = "+";
  eq_btn_add.className = "little_button";
  
  //--- equivalent minus button
  var eq_btn_rem = document.createElement("input");
  eq_btn_rem.setAttribute("type", "button");
  eq_btn_rem.setAttribute("onClick", "javascript: delRow_equi(" + (document.getElementsByClassName("grid_def").length) + ");" );
  eq_btn_rem.setAttribute("tabindex", "-1");
  eq_btn_rem.value = "-";
  eq_btn_rem.className = "little_button";
  
  //--- text input - filename
  var ex_text_file = document.createElement("input");
  ex_text_file.setAttribute("type", "text");
  ex_text_file.setAttribute("class", "input_field");
  ex_text_file.setAttribute("name", "exam_file");
  ex_text_file.setAttribute("placeholder", "filename");
  ex_text_file.setAttribute("value", base_name + "-" + (document.getElementById("column_def").children.length + 1) + "a");
  
  //--- text input - contributor
  var ex_text_contrib = document.createElement("input");
  ex_text_contrib.setAttribute("type", "text");
  ex_text_contrib.setAttribute("class", "input_field");
  ex_text_contrib.setAttribute("name", "exam_contrib");
  ex_text_contrib.setAttribute("placeholder", "contributor");
  
  //--- text input - display
  var ex_text_display = document.createElement("input");
  ex_text_display.setAttribute("type", "text");
  ex_text_display.setAttribute("class", "input_field");
  ex_text_display.setAttribute("name", "exam_display");
  ex_text_display.setAttribute("placeholder", "display");
  
  //--- text input - source
  var ex_text_source = document.createElement("input");
  ex_text_source.setAttribute("type", "text");
  ex_text_source.setAttribute("class", "input_field");
  ex_text_source.setAttribute("name", "exam_source");
  ex_text_source.setAttribute("placeholder", "example source");
  
  //--- dropdown button for source
  var ex_btn_src = document.createElement("input");
  ex_btn_src.setAttribute("type", "button");
  ex_btn_src.setAttribute("name", "btn_source");
  ex_btn_src.setAttribute("onClick", "javascript: source_dropdown(this);" );
  ex_btn_src.setAttribute("tabindex", "-1");
  ex_btn_src.value = "v";
  ex_btn_src.className = "little_button";  
  
  //--- example plus button
  var ex_btn_add = document.createElement("input");
  ex_btn_add.setAttribute("type", "button");
  ex_btn_add.setAttribute("onClick", "javascript: addRow_exam(" + (document.getElementsByClassName("grid_def").length) + ");" );
  ex_btn_add.setAttribute("tabindex", "-1");
  ex_btn_add.value = "+";
  ex_btn_add.className = "little_button";  
  
  //--- example minus button
  var ex_btn_rem = document.createElement("input");
  ex_btn_rem.setAttribute("type", "button");
  ex_btn_rem.setAttribute("onClick", "javascript: delRow_exam(" + (document.getElementsByClassName("grid_def").length) + ");" );
  ex_btn_rem.setAttribute("tabindex", "-1");
  ex_btn_rem.value = "-";
  ex_btn_rem.className = "little_button";
  
  //----------------------------------------------------------------------------------------------------
  
  //--- equivalent button group (only one button group per meaning)
  var eq_div_buttons = document.createElement("div");
  eq_div_buttons.appendChild(eq_btn_add);
  eq_div_buttons.appendChild(eq_btn_rem);
  
  //--- example button group (only one button group per meaning)
  var ex_div_buttons = document.createElement("div");
  ex_div_buttons.appendChild(ex_btn_add);
  ex_div_buttons.appendChild(ex_btn_rem);
  
  //--- equivalent group
  var eq_div = document.createElement("div");
  eq_div.className = "grid_equi";
  eq_div.appendChild(eq_text);
  eq_div.appendChild(eq_div_buttons);
  
  //--- example group
  var ex_div = document.createElement("div");
  ex_div.className = "grid_exam";
  ex_div.appendChild(ex_text_source);
  ex_div.appendChild(ex_btn_src);
  ex_div.appendChild(ex_text_file);
  ex_div.appendChild(ex_text_display);
  ex_div.appendChild(ex_text_contrib);
  ex_div.appendChild(ex_div_buttons);
  
  //--- definition group
  var div_def = document.createElement("div");
  div_def.className = "grid_def";
  div_def.appendChild(re_text);  
  div_def.appendChild(me_text);
  div_def.appendChild(eq_div);
  div_def.appendChild(ex_div);
  
  //--- add to doc
  var col_def = document.getElementById("column_def");
  col_def.appendChild(div_def);
  col_def.appendChild(getButtons("def")); 
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}

//======================================================================================================

function addRow_exam(num) {
  var lit_rows = document.getElementsByClassName("grid_lit");
  var lit_value = lit_rows[0].children[0].value
  var base_name = lit_value.replace(" ", "_");
  
  //--- text input - filename
  var ex_text_file = document.createElement("input");
  ex_text_file.setAttribute("type", "text");
  ex_text_file.setAttribute("class", "input_field");
  ex_text_file.setAttribute("name", "exam_file");
  ex_text_file.setAttribute("placeholder", "filename");
  ex_text_file.setAttribute("value", base_name + "-" + (num + 1) + String.fromCharCode(97 + document.getElementsByClassName("grid_def")[num].children[3].children.length/6));
  
  //--- text input - contributor
  var ex_text_contrib = document.createElement("input");
  ex_text_contrib.setAttribute("type", "text");
  ex_text_contrib.setAttribute("class", "input_field");
  ex_text_contrib.setAttribute("name", "exam_contrib");
  ex_text_contrib.setAttribute("placeholder", "contributor");
  
  //--- text input - display
  var ex_text_display = document.createElement("input");
  ex_text_display.setAttribute("type", "text");
  ex_text_display.setAttribute("class", "input_field");
  ex_text_display.setAttribute("name", "exam_display");
  ex_text_display.setAttribute("placeholder", "display");
  
  //--- text input - source
  var ex_text_source = document.createElement("input");
  ex_text_source.setAttribute("type", "text");
  ex_text_source.setAttribute("class", "input_field");
  ex_text_source.setAttribute("name", "exam_source");
  ex_text_source.setAttribute("placeholder", "example source");
  
  //--- dropdown button for source
  var ex_btn_src = document.createElement("input");
  ex_btn_src.setAttribute("type", "button");
  ex_btn_src.setAttribute("name", "btn_source");
  ex_btn_src.setAttribute("onClick", "javascript: source_dropdown(this);" );
  ex_btn_src.setAttribute("tabindex", "-1");
  ex_btn_src.value = "v";
  ex_btn_src.className = "little_button"; 
  
  //--- blank input (in lieu of extra plus/minus buttons)
  var ex_blank = document.createElement("input");
  ex_blank.setAttribute("type", "hidden");
  ex_blank.value = "0";
  
  //--- blank button group
  var ex_div_buttons = document.createElement("div");
  ex_div_buttons.appendChild(ex_blank); 
  
  var grid_exam = document.getElementsByClassName("grid_def")[num].children[3]; // children[0] = refer, children[1] = meaning, children[2] = equivalent group, children[3] = example group
  grid_exam.appendChild(ex_text_source);
  grid_exam.appendChild(ex_btn_src);
  grid_exam.appendChild(ex_text_file);
  grid_exam.appendChild(ex_text_display);
  grid_exam.appendChild(ex_text_contrib);
  grid_exam.appendChild(ex_div_buttons);
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
  
}

//======================================================================================================

function addRow_equi(defNum) {
  
  //--- text input - equivalent values
  var eq_text = document.createElement("input");
  eq_text.setAttribute("type", "text");
  eq_text.setAttribute("name", "equi");
  eq_text.setAttribute("class", "input_field");
  eq_text.setAttribute("placeholder", "equivalent values");
  
  //--- blank input (in lieu of extra plus/minus buttons)
  var ex_blank = document.createElement("input");
  ex_blank.setAttribute("type", "hidden");
  ex_blank.value = "0";
  
  //--- blank button group
  var div_blank = document.createElement("div");
  div_blank.appendChild(ex_blank);
  
  var grid_equi = document.getElementsByClassName("grid_def")[defNum].children[2]; // children[0] = refer, children[1] = meaning, children[2] = equivalent group, children[3] = example group
  grid_equi.appendChild(eq_text);
  grid_equi.appendChild(div_blank);
  
  bUpdated = true;
}

//======================================================================================================
 
function delRow_kana() {
  var rows = document.getElementsByClassName("grid_kana");
  if(rows.length > 2)
    rows[rows.length - 2].outerHTML = "";
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}
  
//======================================================================================================
 
function delRow_def() {
  var rows = document.getElementsByClassName("grid_def");
  if(rows.length > 2)
    rows[rows.length - 2].outerHTML = "";
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}
  
//======================================================================================================
 
function delRow_exam(num) {
  var grid_exam = document.getElementsByClassName("grid_def")[num].children[3]; // children[0] = refer, children[1] = meaning, children[2] = equivalent group, children[3] = example group
  if(grid_exam.children.length > 6) { //four input fields + one div for buttons
    grid_exam.lastChild.outerHTML = "";
    grid_exam.lastChild.outerHTML = "";
    grid_exam.lastChild.outerHTML = "";
    grid_exam.lastChild.outerHTML = "";
    grid_exam.lastChild.outerHTML = "";
    grid_exam.lastChild.outerHTML = "";
  }
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}
  
//======================================================================================================
 
function delRow_equi(num) {
  
  var grid_equi = document.getElementsByClassName("grid_def")[num].children[2]; // children[0] = refer, children[1] = meaning, children[2] = equivalent group, children[3] = example group
  if(grid_equi.children.length > 2) {
    grid_equi.lastChild.outerHTML = "";
    grid_equi.lastChild.outerHTML = "";
  }
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}

//======================================================================================================

function source_dropdown(element) {
  if (element.previousSibling.id) {
    element.previousSibling.removeAttribute("id");
    document.getElementById("sourceDropdown").style.display = "none";
  } else {
    element.previousSibling.setAttribute("id", "sourceDropped");
    let bb = element.getBoundingClientRect();
    document.getElementById("sourceDropdown").style.top = (bb.top + 25) + "px";
    document.getElementById("sourceDropdown").style.left = bb.left + "px";
    document.getElementById("sourceDropdown").style.display = "block";
  }
}

//======================================================================================================

function pickSource(sourceid) {
  document.getElementById("sourceDropped").value = sourceid;
  document.getElementById("sourceDropped").removeAttribute("id");
  document.getElementById("sourceDropdown").style.display = "none";
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}

//======================================================================================================

function getButtons(section) {
  var tmpDiv = document.createElement("div");
  
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: addRow_" + section + "();" );
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "+";
  newInput.className = "little_button";
  tmpDiv.appendChild(newInput);
  
  newInput = document.createElement("input");
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: delRow_" + section + "();" );
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "-";
  newInput.className = "little_button";
  tmpDiv.appendChild(newInput);
  
  var newDiv = document.createElement("div");
  newDiv.id = "button_" + section;
  newDiv.className = "grid_" + section;
  newDiv.appendChild(tmpDiv);
  
  if (section === "exam")
    return tmpDiv;
  return newDiv;
}
  
//======================================================================================================

function create_source_list() {   
  var ids = [];
  
  pubs.forEach((pub) => {
    pub.sources.forEach((source) => {
      ids.push(source.id);
    });    
  });
  ids.sort();
  
  for (var i=0; i<ids.length; i++) {
    document.getElementById("sourceDropdown").innerHTML += "<a href='#!' class='pick_link' onclick=\"pickSource('" + ids[i] + "')\">" + ids[i] + "</a>";
  }
}
  
//======================================================================================================

function create_picker_list() {
  var picker = document.getElementById("picker");
  
  var groupLetter = "a";
  var subGroupLetter = "";
  picker.innerHTML += "A:\t"
  
  for (var i=0; i<deets.length; i++) {
    currentLetter1 = deets[i].literal.substring(0, 1);
    currentLetter2 = deets[i].literal.substring(1, 2);
    if (currentLetter1 !== groupLetter) {
      picker.innerHTML += "<br />" + currentLetter1.toUpperCase() + ":\t";
      groupLetter = currentLetter1
      subGroupLetter = currentLetter2
    } else {
      if (groupLetter !== "a" && groupLetter !== "e" && groupLetter !== "i" && groupLetter !== "o" && groupLetter !== "u" && groupLetter !== "n") {
        if (subGroupLetter !== currentLetter2) {
          picker.innerHTML += "<br />&nbsp;&nbsp;\t"
          subGroupLetter = currentLetter2;
        }
      }
    }
    picker.innerHTML += "<a href='#!', onclick=\"javascript: open_details('" + i + "');\" tabindex='-1'>" + deets[i].literal.replace(" ", "&nbsp;") + "</a>, ";
  }
}
  
//======================================================================================================

function open_details(id) {

  if (bUpdated) {
    showOverlay();
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
    return;
  }

  var details = deets[id];
  
  newRecord();
  
  var lit_rows = document.getElementsByClassName("grid_lit");
  lit_rows[0].children[0].value = details.literal;
  //--------------------------------------
  var kana_rows = document.getElementsByClassName("grid_kana");
  for (var i = 0; i<details.katakana.length; i++) {
    kana_rows[kana_rows.length - 2].children[0].value = details.katakana[i];
    kana_rows[kana_rows.length - 2].children[1].value = details.hiragana[i];
    addRow_kana();
  }
  delRow_kana();
  //--------------------------------------
  var def_rows = document.getElementsByClassName("grid_def");
  
  for (var detNum = 0; detNum<details.definition.length; detNum++) {
    def_rows[def_rows.length - 2].children[0].value = details.definition[detNum].refer; // children[0] = refer, children[1] = meaning, children[2] = equivalent group, children[3] = example group
    def_rows[def_rows.length - 2].children[1].value = details.definition[detNum].meaning;
    for (var equNum = 0; equNum<details.definition[detNum].equivalent.length; equNum++) {
      def_rows[def_rows.length - 2].children[2].children[equNum*2].value = details.definition[detNum].equivalent[equNum];
      if (equNum < details.definition[detNum].equivalent.length - 1) addRow_equi(detNum);
    }
    //console.log(def_rows[def_rows.length - 2].children[3]);
    for (var exaNum = 0; exaNum<details.definition[detNum].example.length; exaNum++) {
      def_rows[def_rows.length - 2].children[3].children[exaNum*6].value = details.definition[detNum].example[exaNum].source;
      def_rows[def_rows.length - 2].children[3].children[exaNum*6 + 2].value = details.definition[detNum].example[exaNum].file;
      def_rows[def_rows.length - 2].children[3].children[exaNum*6 + 3].value = details.definition[detNum].example[exaNum].display;
      def_rows[def_rows.length - 2].children[3].children[exaNum*6 + 4].value = details.definition[detNum].example[exaNum].contributor;
      if(exaNum < details.definition[detNum].example.length - 1) addRow_exam(detNum);
    }
    if(detNum < details.definition.length - 1) addRow_def();
  }
  
  bUpdated = false;
  document.getElementById("modified_label").style.display = "none";
  
}
  
//======================================================================================================

function getJSON() {

  // literal
  if (!document.getElementsByName("lit")[0].value) return null;
  var lit = document.getElementsByName("lit")[0].value;
  
  // katagana
  var kata_rows = document.getElementsByName("kata");
  const kata = [];
  for (var i=0; i<kata_rows.length; i++) {
    if (!kata_rows[i].value) return null;
    kata.push(kata_rows[i].value);
  }
  
  // hiragana
  var hira_rows = document.getElementsByName("hira");
  const hira = [];
  for (var i=0; i<hira_rows.length; i++) {
    if (!hira_rows[i].value) return null;
    hira.push(hira_rows[i].value);
  }
    
  // definitions
  var def_rows = document.getElementById("column_def");
  const def = [];  
  for (var defNum=0; defNum<def_rows.children.length - 1; defNum++) {
    
    // reference
    var re = def_rows.children[defNum].children[0].value; // children[0] = refer, children[1] = meaning, children[2] = equivalent group, children[3] = example group
  
    
    // meaning
    //if (!def_rows.children[defNum].children[1].value) return null;
    var me = def_rows.children[defNum].children[1].value;
    
    // equivalents
    const equi = [];    
    var equivs = def_rows.children[defNum].children[2];
    for (var equNum=0; equNum<equivs.children.length; equNum+=2) {
      if (!equivs.children[equNum].value && equNum > 0) return null;
      equi.push(equivs.children[equNum].value);
    }
    
    if (equi.length == 0 && re.length == 0) return null;
    if (me.length == 0 && re.length == 0) return null;
    
    // examples
    const exam = [];
    var examps = def_rows.children[defNum].children[3];
    for (var exaNum=0; exaNum<examps.children.length; exaNum+=6) {
      if (!examps.children[exaNum].value) return null;
      if (!examps.children[exaNum + 2].value) return null;
      if (!examps.children[exaNum + 3].value) return null;
      var ex = {
        source: examps.children[exaNum].value,
        file: examps.children[exaNum + 2].value,
        display: examps.children[exaNum + 3].value,
        contributor: examps.children[exaNum + 4].value,
      };
      exam.push(ex);
    }
    
    var de = {
      refer: re,
      meaning: me,
      equivalent: equi,
      example: exam
    };
    def.push(de);
    
    var json_obj = { 
      literal: lit,
      katakana: kata,
      hiragana: hira,
      definition: def
    };
    
  }
  
  return JSON.stringify(json_obj, null, 2)
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
  
  console.log();
  console.log("Records: " + deets.length);
  console.log("Meanings: " + def_cnt);
  console.log("Recognized Kanas: " + kana_cnt);
  console.log("Example Images: " + img_cnt);
  
  pubs.forEach((pub) => {
    console.log();
    var pubcnt = 0;
    //var sercnt = 0;
    pub.sources.forEach((source) => {
      //sercnt++;
      deets.forEach((d) => {
        d.definition.forEach((def) => {
          def.example.forEach((exa) => {
            if (exa.source === source.id) pubcnt++;
          });
        });
      });
    });
    console.log("-- " + pub.publisher_name + " " +  pubcnt + " --> " + pub.site);
    pub.sources.forEach((source) => {
      var sercnt = 0;
      deets.forEach((d) => {
        d.definition.forEach((def) => {
          def.example.forEach((exa) => {
            if (exa.source === source.id) sercnt++;
          });
        });
      });
      console.log("     " + source.manga + " ( " + source.id + " ): " + sercnt);
    });
    
  });
  
}
  
//======================================================================================================

function copier() {
  j = getJSON();
  
  if(j) {
    navigator.clipboard.writeText(j);
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
  }
  else alert("Missing data elements");
}
  
//======================================================================================================
  
function saver() {
  var text = getJSON();
  if(text) {
    var fname = document.getElementsByName("lit")[0].value;
    fname = fname.replace(" ", "_");
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fname);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
  } else alert("Missing data elements");
}

//======================================================================================================

async function opener() {
  const data = await fetch(content + "json/j-ono-data.json");
  deets = await data.json();
  
  const src = await fetch(content + "json/j-ono-source.json");
  pubs = await src.json();
  
  pubs.sort((a, b) => a.publisher_name.localeCompare(b.publisher_name));
  
  create_picker_list();
  create_source_list();
  get_stats();
  
  newRecord();
}
