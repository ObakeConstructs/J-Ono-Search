const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";
let RECORDS_ARRAY = [];
let PUBLISHERS_ARRAY = [];

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
  
function newRecord() {
  if (bUpdated) {
    showOverlay();
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
    return;
  }
  
  document.getElementById("column_romaji").innerHTML = "";
  document.getElementById("column_kana").innerHTML = "";
  document.getElementById("column_def").innerHTML = "";
  
  addRow_romaji();
  addRow_kana();
  addRow_def();
  
  bUpdated = false;
  document.getElementById("modified_label").style.display = "none";
  }
  
//======================================================================================================

function addRow_romaji() {
  var btn = document.getElementById("button_romaji");
  if (btn) {
    btn.outerHTML = "";
  }
  
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("name", "romaji");
  newInput.setAttribute("class", "input_field");
  newInput.setAttribute("placeholder", "romaji value");
  
  var newDiv = document.createElement("div");
  newDiv.className = "grid_romaji";
  newDiv.appendChild(newInput);
  
  var col = document.getElementById("column_romaji");
  col.appendChild(newDiv);
  col.appendChild(getButtons("romaji"));
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
  
  var romaji_rows = document.getElementsByClassName("grid_romaji");
  var romaji_value = romaji_rows[0].children[0].value
  var base_name = romaji_value.id
      
  //----------------------------------------------------------------------------------------------------
  
  //--- text input - refer
  var reference_text = document.createElement("input");
  reference_text.setAttribute("type", "text");
  reference_text.setAttribute("name", "refer");
  reference_text.setAttribute("class", "input_field");
  reference_text.setAttribute("placeholder", "reference");
  
  //--- text input - type
  var type_text = document.createElement("input");
  type_text.setAttribute("type", "text");
  type_text.setAttribute("name", "type");
  type_text.setAttribute("class", "input_field");
  type_text.setAttribute("placeholder", "type");
                        
  //--- text input - meaning
  var meaning_text = document.createElement("input");
  meaning_text.setAttribute("type", "text");
  meaning_text.setAttribute("name", "mean");
  meaning_text.setAttribute("class", "input_field");
  meaning_text.setAttribute("placeholder", "meaning");
  
  //--- text input - equivalent
  var equivalent_text = document.createElement("input");
  equivalent_text.setAttribute("type", "text");
  equivalent_text.setAttribute("name", "equi");
  equivalent_text.setAttribute("class", "input_field");
  equivalent_text.setAttribute("placeholder", "equivalent values");
  
  //--- equivalent plus button
  var equivalent_button_adder = document.createElement("input");
  equivalent_button_adder.setAttribute("type", "button");
  equivalent_button_adder.setAttribute("onClick", "javascript: addRow_equi(" + (document.getElementsByClassName("grid_def").length) + ");" );
  equivalent_button_adder.setAttribute("tabindex", "-1");
  equivalent_button_adder.value = "+";
  equivalent_button_adder.className = "little_button";
  
  //--- equivalent minus button
  var equivalent_button_remover = document.createElement("input");
  equivalent_button_remover.setAttribute("type", "button");
  equivalent_button_remover.setAttribute("onClick", "javascript: delRow_equi(" + (document.getElementsByClassName("grid_def").length) + ");" );
  equivalent_button_remover.setAttribute("tabindex", "-1");
  equivalent_button_remover.value = "-";
  equivalent_button_remover.className = "little_button";
  
  //--- text input - filename
  var example_filename_text = document.createElement("input");
  example_filename_text.setAttribute("type", "text");
  example_filename_text.setAttribute("class", "input_field");
  example_filename_text.setAttribute("name", "exam_file");
  example_filename_text.setAttribute("placeholder", "filename");
  example_filename_text.setAttribute("value", base_name + "-" + (document.getElementById("column_def").children.length + 1) + "a");
  
  //--- text input - contributor
  var example_contributor_text = document.createElement("input");
  example_contributor_text.setAttribute("type", "text");
  example_contributor_text.setAttribute("class", "input_field");
  example_contributor_text.setAttribute("name", "exam_contrib");
  example_contributor_text.setAttribute("placeholder", "contributor");
  
  //--- text input - display
  var example_display_text = document.createElement("input");
  example_display_text.setAttribute("type", "text");
  example_display_text.setAttribute("class", "input_field");
  example_display_text.setAttribute("name", "exam_display");
  example_display_text.setAttribute("placeholder", "display");
  
  //--- text input - source
  var example_source_text = document.createElement("input");
  example_source_text.setAttribute("type", "text");
  example_source_text.setAttribute("class", "input_field");
  example_source_text.setAttribute("name", "exam_source");
  example_source_text.setAttribute("placeholder", "example source");
  
  //--- dropdown button for source
  var example_publisher_dropdown_button = document.createElement("input");
  example_publisher_dropdown_button.setAttribute("type", "button");
  example_publisher_dropdown_button.setAttribute("name", "btn_source");
  example_publisher_dropdown_button.setAttribute("onClick", "javascript: source_dropdown_clicked(this);" );
  example_publisher_dropdown_button.setAttribute("tabindex", "-1");
  example_publisher_dropdown_button.value = "⇓";
  example_publisher_dropdown_button.className = "little_button";  
  
  //--- example plus button
  var example_button_adder = document.createElement("input");
  example_button_adder.setAttribute("type", "button");
  example_button_adder.setAttribute("onClick", "javascript: addRow_exam(" + (document.getElementsByClassName("grid_def").length) + ");" );
  example_button_adder.setAttribute("tabindex", "-1");
  example_button_adder.value = "+";
  example_button_adder.className = "little_button";  
  
  //--- example minus button
  var example_button_remover = document.createElement("input");
  example_button_remover.setAttribute("type", "button");
  example_button_remover.setAttribute("onClick", "javascript: delRow_exam(" + (document.getElementsByClassName("grid_def").length) + ");" );
  example_button_remover.setAttribute("tabindex", "-1");
  example_button_remover.value = "-";
  example_button_remover.className = "little_button";
  
  //----------------------------------------------------------------------------------------------------
  
  //--- equivalent button group (only one button group per meaning)
  var equivalent_buttons_div = document.createElement("div");
  equivalent_buttons_div.appendChild(equivalent_button_adder);
  equivalent_buttons_div.appendChild(equivalent_button_remover);
  
  //--- example button group (only one button group per meaning)
  var example_buttons_div = document.createElement("div");
  example_buttons_div.appendChild(example_button_adder);
  example_buttons_div.appendChild(example_button_remover);
  
  //--- equivalent group
  var equivalent_group_div = document.createElement("div");
  equivalent_group_div.className = "grid_equi";
  equivalent_group_div.appendChild(equivalent_text);
  equivalent_group_div.appendChild(equivalent_buttons_div);
  
  //--- example group
  var example_group_div = document.createElement("div");
  example_group_div.className = "grid_exam";
  example_group_div.appendChild(example_source_text);
  example_group_div.appendChild(example_publisher_dropdown_button);
  example_group_div.appendChild(example_filename_text);
  example_group_div.appendChild(example_display_text);
  example_group_div.appendChild(example_contributor_text);
  example_group_div.appendChild(example_buttons_div);
  
  //--- definition group
  var definition_group_div = document.createElement("div");
  definition_group_div.className = "grid_def";
  definition_group_div.appendChild(reference_text);
  //definition_group_div.appendChild(typeContainer);
  definition_group_div.appendChild(type_text);
  definition_group_div.appendChild(meaning_text);
  definition_group_div.appendChild(equivalent_group_div);
  definition_group_div.appendChild(example_group_div);
  
  //--- add full definition to doc
  var definition_column = document.getElementById("column_def");
  definition_column.appendChild(definition_group_div);
  definition_column.appendChild(getButtons("def"));
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}

//======================================================================================================

function addRow_exam(num) {
  var romaji_rows = document.getElementsByClassName("grid_romaji");
  var romaji_value = romaji_rows[0].children[0].value
  var base_name = romaji_value.id
  
  //--- text input - filename
  var example_filename_text = document.createElement("input");
  example_filename_text.setAttribute("type", "text");
  example_filename_text.setAttribute("class", "input_field");
  example_filename_text.setAttribute("name", "exam_file");
  example_filename_text.setAttribute("placeholder", "filename");
  example_filename_text.setAttribute("value", base_name + "-" + (num + 1) + String.fromCharCode(97 + document.getElementsByClassName("grid_def")[num].children[3].children.length/6));
  
  //--- text input - contributor
  var example_contributor_text = document.createElement("input");
  example_contributor_text.setAttribute("type", "text");
  example_contributor_text.setAttribute("class", "input_field");
  example_contributor_text.setAttribute("name", "exam_contrib");
  example_contributor_text.setAttribute("placeholder", "contributor");
  
  //--- text input - display
  var example_display_text = document.createElement("input");
  example_display_text.setAttribute("type", "text");
  example_display_text.setAttribute("class", "input_field");
  example_display_text.setAttribute("name", "exam_display");
  example_display_text.setAttribute("placeholder", "display");
  
  //--- text input - source
  var example_source_text = document.createElement("input");
  example_source_text.setAttribute("type", "text");
  example_source_text.setAttribute("class", "input_field");
  example_source_text.setAttribute("name", "exam_source");
  example_source_text.setAttribute("placeholder", "example source");
  
  //--- dropdown button for source
  var example_publisher_dropdown_button = document.createElement("input");
  example_publisher_dropdown_button.setAttribute("type", "button");
  example_publisher_dropdown_button.setAttribute("name", "btn_source");
  example_publisher_dropdown_button.setAttribute("onClick", "javascript: source_dropdown_clicked(this);" );
  example_publisher_dropdown_button.setAttribute("tabindex", "-1");
  example_publisher_dropdown_button.value = "⇓";
  example_publisher_dropdown_button.className = "little_button"; 
  
  //--- hidden input (in lieu of extra plus/minus buttons)
  var example_hidden_input = document.createElement("input");
  example_hidden_input.setAttribute("type", "hidden");
  example_hidden_input.value = "0";
  
  //--- hidden input group
  var example_hidden_input_group = document.createElement("div");
  example_hidden_input_group.appendChild(example_hidden_input); 
  
  var grid_exam = document.getElementsByClassName("grid_def")[num].children[4]; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group
  grid_exam.appendChild(example_source_text);
  grid_exam.appendChild(example_publisher_dropdown_button);
  grid_exam.appendChild(example_filename_text);
  grid_exam.appendChild(example_display_text);
  grid_exam.appendChild(example_contributor_text);
  grid_exam.appendChild(example_hidden_input_group);
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
  
}

//======================================================================================================

function addRow_equi(defNum) {
  
  //--- text input - equivalent values
  var equivalent_text = document.createElement("input");
  equivalent_text.setAttribute("type", "text");
  equivalent_text.setAttribute("name", "equi");
  equivalent_text.setAttribute("class", "input_field");
  equivalent_text.setAttribute("placeholder", "equivalent values");
  
  //--- blank input (in lieu of extra plus/minus buttons)
  var example_hidden_input = document.createElement("input");
  example_hidden_input.setAttribute("type", "hidden");
  example_hidden_input.value = "0";
  
  //--- blank button group
  var example_hidden_input_group = document.createElement("div");
  example_hidden_input_group.appendChild(example_hidden_input);
  
  var grid_equi = document.getElementsByClassName("grid_def")[defNum].children[3]; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group
  grid_equi.appendChild(equivalent_text);
  grid_equi.appendChild(example_hidden_input_group);
  
  bUpdated = true;
}

//======================================================================================================

function delRow_common(section) {
  var rows = document.getElementsByClassName("grid_" + section);
    
  if(rows.length > 2) { //two rows: one div for the field and one for the buttons
    rows[rows.length - 2].outerHTML = "";
  }
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";  
}

//======================================================================================================
 
function delRow_romaji() { delRow_common("romaji"); }
function delRow_kana() { delRow_common("kana"); }
function delRow_def() { delRow_common("def"); }

//======================================================================================================
 
function delRow_exam(num) {
  var grid_exam = document.getElementsByClassName("grid_def")[num].children[4]; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group
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
  
  var grid_equi = document.getElementsByClassName("grid_def")[num].children[3]; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group
  if(grid_equi.children.length > 2) { 
    grid_equi.lastChild.outerHTML = "";
    grid_equi.lastChild.outerHTML = "";
  }
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}

//======================================================================================================

function source_dropdown_clicked(element) {
  if (element.previousSibling.id) {
    //already showing, so hide
    element.previousSibling.removeAttribute("id");
    document.getElementById("sourceDropdown1").style.display = "none";
    document.getElementById("sourceDropdown2").style.display = "none";
  } else {
    //show the dropdown
    element.previousSibling.setAttribute("id", "sourceDropped");
    let bb = element.getBoundingClientRect();
    document.getElementById("sourceDropdown1").style.top = (bb.top + 25) + "px";
    document.getElementById("sourceDropdown1").style.left = bb.left + "px";
    document.getElementById("sourceDropdown1").style.display = "block";
    
    document.getElementById("sourceDropdown2").style.top = (bb.top + 25) + "px";
    document.getElementById("sourceDropdown2").style.left = (bb.left + 164) + "px";
    document.getElementById("sourceDropdown2").style.display = "block";
  }
}

//======================================================================================================

function pickSource(sourceid) {
  document.getElementById("sourceDropped").value = sourceid;
  document.getElementById("sourceDropped").removeAttribute("id");
  document.getElementById("sourceDropdown1").style.display = "none";
  document.getElementById("sourceDropdown2").style.display = "none";
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
}

//======================================================================================================

function getButtons(section) {
  // build side-by-side +/- buttons (except for those for equivs)
  
  var tmpDiv = document.createElement("div");
  
  // + button
  var newInput = document.createElement("input");
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: addRow_" + section + "();" );
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "+";
  newInput.className = "little_button";
  tmpDiv.appendChild(newInput);
  
  // - button
  newInput = document.createElement("input");
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: delRow_" + section + "();" );
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "-";
  newInput.className = "little_button";
  tmpDiv.appendChild(newInput);
  
  // good enough for examples
  if (section === "exam")
    return tmpDiv;
  
  // put buttons in a new div (so they appear below instead of next-to)
  var newDiv = document.createElement("div");
  newDiv.id = "button_" + section;
  newDiv.className = "grid_" + section;
  newDiv.appendChild(tmpDiv);
  
  if (section === "kana" || section === "romaji")
    return newDiv;
  
  // tack on type notes next to def buttons
  var test = document.createElement("div");
  test.innerHTML = "o:onomatopoeic&nbsp;(giongo)<br>v:voiced&nbsp;(giseigo)<br>s:state&nbsp;(gitaigo)<br>m:movement&nbsp;(giyougo)<br>e:emotions&nbsp;(gijougo)<br>c:symbolic&nbsp;cue";
  newDiv.appendChild(test);
  return newDiv;
}
  
//======================================================================================================

function create_publisher_source_list() {   
  var ids = [];
  
  PUBLISHERS_ARRAY.forEach((pub) => {
    pub.sources.forEach((source) => {
      ids.push(source.id);
    });    
  });
  ids.sort();
  
  for (var i=0; i<Math.floor(ids.length/2); i++) {
    document.getElementById("sourceDropdown1").innerHTML += "<a href='#!' class='pick_link' onclick=\"pickSource('" + ids[i] + "')\">" + ids[i] + "</a>";
  }
  if(Math.floor(ids.length/2) != ids.length/2) {
    document.getElementById("sourceDropdown1").innerHTML += "<a class='pick_link'>&nbsp;</a>"
  }
  for (var i=Math.floor(ids.length/2); i<ids.length; i++) {
    document.getElementById("sourceDropdown2").innerHTML += "<a href='#!' class='pick_link' onclick=\"pickSource('" + ids[i] + "')\">" + ids[i] + "</a>";
  }
}
  
//======================================================================================================

function create_picker_list() {
  var picker = document.getElementById("picker");
  // picker is grouped by letter, starting with A:
  
  // initial settings (starting with "a" words).
  var groupLetter = "a";
  var subGroupLetter = "";
  picker.innerHTML += "A:\t"
  
  for (var i=0; i<RECORDS_ARRAY.length; i++) {
  //for (var i=0; i<5; i++) {
    currentLetter1 = RECORDS_ARRAY[i].id.substring(0, 1);
    currentLetter2 = RECORDS_ARRAY[i].id.substring(1, 2);
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
    picker.innerHTML += "<a href='#!', onclick=\"javascript: load_details_to_fields('" + i + "');\" tabindex='-1'>" + RECORDS_ARRAY[i].id	 + "</a>, ";
  }
}
  
//======================================================================================================

function load_details_to_fields(id) {

  if (bUpdated) {
    showOverlay();
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
    return;
  }

  newRecord();
  
  var details = RECORDS_ARRAY[id];
  
  // load romaji values
  var romaji_rows = document.getElementsByClassName("grid_romaji");
  for (var i = 0; i < details.romaji.length; i++) {
    romaji_rows[romaji_rows.length - 2].children[0].value = details.romaji[i];
    if (i < details.romaji.length - 1) addRow_romaji();
  }
  
  // load katakana and hiragana values (in lock-step)
  var kana_rows = document.getElementsByClassName("grid_kana");
  for (var i = 0; i < details.katakana.length; i++) {
    kana_rows[kana_rows.length - 2].children[0].value = details.katakana[i];
    kana_rows[kana_rows.length - 2].children[1].value = details.hiragana[i];
    if (i < details.katakana.length - 1) addRow_kana();
  }
  
  // load definitions
  var def_rows = document.getElementsByClassName("grid_def");
  for (var detNum = 0; detNum < details.definition.length; detNum++) {
    def_rows[def_rows.length - 2].children[0].value = details.definition[detNum].refer; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group    
    def_rows[def_rows.length - 2].children[1].value = details.definition[detNum].type; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group
    def_rows[def_rows.length - 2].children[2].value = details.definition[detNum].meaning;
    
    for (var equNum = 0; equNum<details.definition[detNum].equivalent.length; equNum++) {
      def_rows[def_rows.length - 2].children[3].children[equNum*2].value = details.definition[detNum].equivalent[equNum];
      if (equNum < details.definition[detNum].equivalent.length - 1) addRow_equi(detNum);
    }
    
    for (var exaNum = 0; exaNum < details.definition[detNum].example.length; exaNum++) {
      def_rows[def_rows.length - 2].children[4].children[exaNum*6].value = details.definition[detNum].example[exaNum].source;
      def_rows[def_rows.length - 2].children[4].children[exaNum*6 + 2].value = details.definition[detNum].example[exaNum].file;
      def_rows[def_rows.length - 2].children[4].children[exaNum*6 + 3].value = details.definition[detNum].example[exaNum].display;
      def_rows[def_rows.length - 2].children[4].children[exaNum*6 + 4].value = details.definition[detNum].example[exaNum].contributor;
      if (exaNum < details.definition[detNum].example.length - 1) addRow_exam(detNum);
    }
    
    if (detNum < details.definition.length - 1) addRow_def();
  }
  
  bUpdated = false;
  document.getElementById("modified_label").style.display = "none";
  
}
  
//======================================================================================================

function make_id() {
  var romaji_rows = document.getElementsByName("romaji");
  var id = "";
  for (var i=0; i<romaji_rows.length; i++) {
    if (!romaji_rows[i].value) return null;
    if (id.length > 0) id += "_";
    id += romaji_rows[i].value;
  }
  id = id.replace(" ", "_");
  return id;
}
  
//======================================================================================================

function build_JSON_from_fields() {
  
  var index = make_id();
  if (!index) return null;

  // romaji
  var romaji_rows = document.getElementsByName("romaji");
  const roms = [];
  for (var i=0; i<romaji_rows.length; i++) {
    if (!romaji_rows[i].value) return null;
    roms.push(romaji_rows[i].value);
  }
  
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
    var re = def_rows.children[defNum].children[0].value; // children[0] = refer, children[1] = type, children[2] = meaning, children[3] = equivalent group, children[4] = example group
    
    // type
    var ty = def_rows.children[defNum].children[1].value;
    if (re.length == 0 && ty.length == 0) return null;
    
    // meaning    
    var me = def_rows.children[defNum].children[2].value;
    if (re.length == 0 && me.length == 0) return null;
    
    // equivalents
    const equi = [];    
    var equivs = def_rows.children[defNum].children[3];
    for (var equNum=0; equNum<equivs.children.length; equNum+=2) {
      if (!equivs.children[equNum].value && equNum > 0) return null;
      equi.push(equivs.children[equNum].value);
    }    
    if (equi.length == 0 && re.length == 0) return null;
    equi.sort();
    
    // examples
    const exam = [];
    var examps = def_rows.children[defNum].children[4];
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
      type: ty,
      meaning: me,
      equivalent: equi,
      example: exam
    };
    def.push(de);
    
    var json_obj = {
      id: index,
      romaji: roms,
      katakana: kata,
      hiragana: hira,
      definition: def
    };
    
  }
  
  return JSON.stringify(json_obj, null, 2)
}

//=================================================================================

function send_stats_to_console() {
  var kana_cnt = 0;
  var def_cnt = 0;
  var img_cnt = 0;
  
  RECORDS_ARRAY.forEach((d) => {
    kana_cnt += d.katakana.length;
    kana_cnt += d.hiragana.length;
    def_cnt += d.definition.length;
    d.definition.forEach((def) => {
      img_cnt += def.example.length;
    });
  });
  
  console.log();
  console.log("Records: " + RECORDS_ARRAY.length);
  console.log("Meanings: " + def_cnt);
  console.log("Recognized Kanas: " + kana_cnt);
  console.log("Example Images: " + img_cnt);
  
  PUBLISHERS_ARRAY.forEach((pub) => {
    console.log();
    var pubcnt = 0;
    //var sercnt = 0;
    pub.sources.forEach((source) => {
      //sercnt++;
      RECORDS_ARRAY.forEach((d) => {
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
      RECORDS_ARRAY.forEach((d) => {
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
  j = build_JSON_from_fields();
  
  if(j) {
    navigator.clipboard.writeText(j);
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
  }
  else alert("Missing data elements");
}

//======================================================================================================
  
function saver() {
  var text = build_JSON_from_fields();
  var filename = make_id();
  
  if(text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
  } else {
    alert("Missing data elements");
  }
}

//======================================================================================================

async function opener() {
  const data = await fetch(content + "json/j-ono-data.json");
  RECORDS_ARRAY = await data.json();
  
  const src = await fetch(content + "json/j-ono-source.json");
  PUBLISHERS_ARRAY = await src.json();
  
  PUBLISHERS_ARRAY.sort((a, b) => a.publisher_name.localeCompare(b.publisher_name));
  
  create_picker_list();
  create_publisher_source_list();
  send_stats_to_console();
  
  newRecord();
}
