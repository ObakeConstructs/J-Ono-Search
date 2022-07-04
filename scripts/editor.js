const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";
let deets = [];
  
//======================================================================================================
  
function newRecord() {
  var col = document.getElementById("column_lit");
  col.innerHTML = "<div class='grid_lit'><div class='grid_header'>Literal</div></div>";
  addRow_literal();
  
  col = document.getElementById("column_kana");
  col.innerHTML = "<div class='grid_kana'><div class='grid_header'>Katakana</div><div class='grid_header'>Hiragana</div></div>";
  addRow_kana();
  
  col = document.getElementById("column_def");
  col.innerHTML = "<div class='grid_def'><div class='grid_header'>Equivalent</div><div class='grid_header'>Meaning</div><div class='grid_header'>Example</div></div>";
  addRow_def();
  }
  
//======================================================================================================

function addRow_literal() {
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", "lit");
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
  newInput.setAttribute("placeholder", "katakana value");
  newDiv.appendChild(newInput);
  
  newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", "hira");
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
  
  var div_def = document.createElement("div");
  div_def.className = "grid_def";
  
  var eq_text = document.createElement("input");
  eq_text.setAttribute("type", "text");
  eq_text.setAttribute("name", "equi");
  eq_text.setAttribute("placeholder", "equivalent values");
  div_def.appendChild(eq_text);
  
  var me_text = document.createElement("input");
  me_text.setAttribute("type", "text");
  me_text.setAttribute("name", "mean");
  me_text.setAttribute("placeholder", "meaning");
  div_def.appendChild(me_text);
  
  var ex_text = document.createElement("input");
  ex_text.setAttribute("type", "text");
  ex_text.setAttribute("name", "exam");
  ex_text.setAttribute("placeholder", "filename value");
  
  var div_exam = document.createElement("div");
  div_exam.className = "grid_exam";
  div_exam.appendChild(ex_text);
  
  var div_blank = document.createElement("div");
  
  var btn_add = document.createElement("input");
  btn_add.setAttribute("type", "button");
  btn_add.setAttribute("onClick", "javascript: addRow_exam(" + (document.getElementsByClassName("grid_def").length) + ");" );
  btn_add.setAttribute("tabindex", "-1");
  btn_add.value = "+";
  btn_add.className = "little_button";
  div_blank.appendChild(btn_add);
  
  var btn_rem = document.createElement("input");
  btn_rem.setAttribute("type", "button");
  btn_rem.setAttribute("onClick", "javascript: delRow_exam(" + (document.getElementsByClassName("grid_def").length) + ");" );
  btn_rem.setAttribute("tabindex", "-1");
  btn_rem.value = "-";
  btn_rem.className = "little_button";
  div_blank.appendChild(btn_rem);
  
  div_exam.appendChild(div_blank);
  div_def.appendChild(div_exam);
  
  var col_def = document.getElementById("column_def");
  col_def.appendChild(div_def);
  col_def.appendChild(getButtons("def")); 
}

//======================================================================================================

function addRow_exam(num) {
  var grid_exam = document.getElementsByClassName("grid_def")[num].children[2];
  
  var ex_text = document.createElement("input");
  ex_text.setAttribute("type", "text");
  ex_text.setAttribute("name", "exam");
  ex_text.setAttribute("placeholder", "filename value");
  grid_exam.appendChild(ex_text);
  
  var div_blank = document.createElement("div");
  var ex_blank = document.createElement("input");
  ex_blank.setAttribute("type", "hidden");
  ex_blank.value = "0";
  div_blank.appendChild(ex_blank);
  grid_exam.appendChild(div_blank);
  
}

//======================================================================================================
 
function delRow_kana() {
  var rows = document.getElementsByClassName("grid_kana");
  if(rows.length > 3)
    rows[rows.length - 2].outerHTML = "";
}
  
//======================================================================================================
 
function delRow_def() {
  var rows = document.getElementsByClassName("grid_def");
  if(rows.length > 3)
    rows[rows.length - 2].outerHTML = "";
}
  
//======================================================================================================
 
function delRow_exam(num) {
  var grid_exam = document.getElementsByClassName("grid_def")[num].children[2];
  if(grid_exam.children.length > 2) {
    grid_exam.lastChild.outerHTML = "";
    grid_exam.lastChild.outerHTML = "";
  }
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

function copier() {
  j = getJSON();
  if(j)
    navigator.clipboard.writeText(j);
  else
    alert("Missing data elements");
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
  } else alert("Missing data elements");
}

//======================================================================================================

async function opener() {
  let response = await fetch(content + "j-ono-data.json");
  deets = await response.json();
  newRecord();
  
  var picker = document.getElementById("picker");
  
  for (var i=0; i<deets.length; i++) {
    var anc = document.createElement("a");
    anc.setAttribute("href", "#!");
    anc.setAttribute("onclick", "javascript: open_details('" + i + "');");
    anc.setAttribute("tabindex", "-1");
    anc.innerHTML = deets[i].literal;
    picker.appendChild(anc);
  }
}
  
//======================================================================================================

function open_details(id) {
  var details = deets[id];
  
  newRecord();
  
  var lit_rows = document.getElementsByClassName("grid_lit");
  lit_rows[1].children[0].value = details.literal;
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
  for (var i = 0; i<details.definition.length; i++) {
    def_rows[def_rows.length - 2].children[0].value = details.definition[i].equivalent;
    def_rows[def_rows.length - 2].children[1].value = details.definition[i].meaning;
    for (var j = 0; j<details.definition[i].example.length; j++) {
      def_rows[def_rows.length - 2].children[2].children[j*2].value = details.definition[i].example[j];
      addRow_exam(i + 1);
    }
    delRow_exam(i + 1);
    addRow_def();
  }
  delRow_def();
  
}
  
//======================================================================================================

function getJSON() {

  if (document.getElementsByName("lit")[0].value)
    var lit = document.getElementsByName("lit")[0].value;
  else return null;
  
  var kata_rows = document.getElementsByName("kata");
  var def_rows = document.getElementById("column_def");
  const kata = [];
  for (var i=0; i<kata_rows.length; i++)
    if (kata_rows[i].value)
      kata.push(kata_rows[i].value);
    else return null;
  
  var hira_rows = document.getElementsByName("hira");
  const hira = [];
  for (var i=0; i<hira_rows.length; i++)
    if (hira_rows[i].value)
      hira.push(hira_rows[i].value);
    else return null;
    
  const def = [];
  for (var i=1; i<def_rows.children.length - 1; i++) {
    if (def_rows.children[i].children[0].value)
      var eq = def_rows.children[i].children[0].value;
    else return null;
    if (def_rows.children[i].children[1].value)
      var me = def_rows.children[i].children[1].value;
    else return null;
    const exam = [];
    var tmp_exam = def_rows.children[i].children[2]; 
    for (var j=0; j<tmp_exam.children.length; j+=2) {
      if(tmp_exam.children[j].value)
        exam.push(tmp_exam.children[j].value);
      else return null;
    }
    var de = {
      equivalent: eq,
      meaning: me,
      example: exam
    };
    def.push(de);
  }
  
  var json_obj = { 
    literal: lit,
    katakana: kata,
    hiragana: hira,
    definition: def
  };
  
  return JSON.stringify(json_obj, null, 2)
  
}
