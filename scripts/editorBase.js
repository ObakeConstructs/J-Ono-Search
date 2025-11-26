/*

Self-contained functions used by Editor

*/


//======================================================================================================
// Global Stuff
//======================================================================================================

// Input Names
const INPUT_NAME = ["romaji", "katakana", "hiragana", "refer", "type", "meaning", "equivalent", "source", "file", "display", "contributor"];

// Totem Type Names
const TOTEM_NAME = ["romaji", "kana", "definition", "equivalent", "example"];

// Input Types
const Input = {
  ROMAJI:      0,
  KATAKANA:    1,
  HIRAGANA:    2,
  REFER:       3,
  TYPE:        4,
  MEANING:     5,
  EQUIVALENT:  6,
  SOURCE:      7,
  FILE:        8,
  DISPLAY:     9,
  CONTRIBUTOR: 10
}

// Totem Types
const Totem = {
  ROMAJI:     0,
  KANA:       1,
  DEFINITION: 2,
  EQUIVALENT: 3,
  EXAMPLE:    4
}

let PUBLISHER_POPUP_VISIBLE = false;

//======================================================================================================
// Event Listeners
//======================================================================================================

document.getElementById('blackOverlay').addEventListener("click", (event) => {
  if (event.target.closest(".popup")) return;
  document.getElementById('blackOverlay').style.display = 'none';
});

//======================================================================================================

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    document.getElementById('blackOverlay').style.display = 'none';
    document.getElementById("publisher_popup_left").style.display = "none";
    document.getElementById("publisher_popup_right").style.display = "none";
    PUBLISHER_POPUP_VISIBLE = false;
  }
  if (event.key.length == 1) {
    bUpdated = true;
    document.getElementById("modified_label").style.display = "block";
    document.getElementById("body").setAttribute("onbeforeunload", "return true");
  }
});

//======================================================================================================
// Base Functions
//======================================================================================================

function get_new_adder_button(totem_type, definition_num) {
  let newInput = document.createElement("input");  
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: new_totem_block(" + totem_type + ", " + definition_num + ");");
  if (totem_type == Totem.DEFINITION) {
    newInput.setAttribute("onClick", "javascript: definition_adder_button_clicked(" + totem_type + ", " + definition_num + ");");
  }
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "+";
  newInput.style.width = "25px";
  newInput.style.height = "20px";
  return newInput;
}

//======================================================================================================

function definition_adder_button_clicked(totem_type, definition_num) {
  
  new_totem_block(totem_type, definition_num);
  block_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_-999").getAttribute("data-blockcount"));
  new_totem_block(Totem.EQUIVALENT, block_count - 1); 
  new_totem_block(Totem.EXAMPLE, block_count - 1);
}

//======================================================================================================

function get_new_controller_button_set(totem_type, block_num, definition_num) {
    
  let containerDiv = document.createElement("div");
  containerDiv.setAttribute("class", "grid_box");
  containerDiv.style.gridTemplateColumns  = "15px 30px";
  
  let newInput = document.createElement("input"); // delete button
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: remove_totem_block(" + totem_type + ", " + block_num + ", " + definition_num + ");" );                                                
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "X";
  newInput.style.width = "15px";
  newInput.style.height = "29px";
  containerDiv.appendChild(newInput);
  
  let subContainerDiv = document.createElement("div");
  
  newInput = document.createElement("input"); // move up button
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: move_totem_item(" + totem_type + ", " + (block_num - 1)+ ", " + definition_num + ");" );
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "⬆";
  newInput.className = "flat_button";
  newInput.style.width = "25px";
  newInput.style.height = "14px";
  subContainerDiv.appendChild(newInput);
  
  newInput = document.createElement("input"); // move down button
  newInput.setAttribute("type", "button");
  newInput.setAttribute("onClick", "javascript: move_totem_item(" + totem_type + ", " + block_num + ", " + definition_num + ");" );
  newInput.setAttribute("tabindex", "-1");
  newInput.value = "⬇";
  newInput.style.width = "25px";
  newInput.style.height = "14px";
  subContainerDiv.appendChild(newInput);
  
  containerDiv.appendChild(subContainerDiv);  
  return containerDiv;
}

//======================================================================================================

function new_input_field(input_type, totem_num, def_num) {
  let newInput = document.createElement("input");
  newInput.setAttribute("type", "text");
  newInput.setAttribute("id", "input_" + INPUT_NAME[input_type] + "_" + totem_num + "_" + def_num);
  newInput.setAttribute("placeholder", INPUT_NAME[input_type] + " value");
  
  return newInput;
}

//======================================================================================================

function new_totem(totem_type, definition_num = -999) {
  let newTotemContainer = document.createElement("div");
  newTotemContainer.setAttribute("class", "grid_box");
  newTotemContainer.appendChild(get_new_adder_button(totem_type, definition_num));
  
  let newTotem = document.createElement("div");
  newTotem.setAttribute("class", "grid_box");
  newTotem.setAttribute("id", "totem_" + TOTEM_NAME[totem_type] + "_" + definition_num);
  newTotem.setAttribute("data-blockcount", 0);
  newTotemContainer.style.outline = "1px solid black";
  newTotemContainer.style.padding = "5px";
  
  newTotemContainer.appendChild(newTotem);
  return newTotemContainer;
}

//======================================================================================================

function json_to_field(json_record) {
  // ID value
  document.getElementById("loaded_id").innerHTML = "ID: " + json_record.id;
  loaded_id = json_record.id;
  
  // romaji values
  for (let i = 0; i < json_record.romaji.length; i++) {
    new_totem_block(Totem.ROMAJI);
    document.getElementById("input_" + INPUT_NAME[Input.ROMAJI] + "_" + i + "_-999").value = json_record.romaji[i];
  }
  
  // kana values
  for (let i = 0; i < json_record.katakana.length; i++) {
    new_totem_block(Totem.KANA);
    document.getElementById("input_" + INPUT_NAME[Input.KATAKANA] + "_" + i + "_-999").value = json_record.katakana[i];
    document.getElementById("input_" + INPUT_NAME[Input.HIRAGANA] + "_" + i + "_-999").value = json_record.hiragana[i];
  }
  
  // definition values
  for (let i = 0; i < json_record.definition.length; i++) {
    new_totem_block(Totem.DEFINITION);
    document.getElementById("input_" + INPUT_NAME[Input.REFER] + "_" + i + "_-999").value = json_record.definition[i].refer;
    document.getElementById("input_" + INPUT_NAME[Input.TYPE] + "_" + i + "_-999").value = json_record.definition[i].type;
    document.getElementById("input_" + INPUT_NAME[Input.MEANING] + "_" + i + "_-999").value = json_record.definition[i].meaning;
    for (let j=0; j<json_record.definition[i].equivalent.length; j++) {
      new_totem_block(Totem.EQUIVALENT, i);
      document.getElementById("input_" + INPUT_NAME[Input.EQUIVALENT] + "_" + j + "_" + i).value = json_record.definition[i].equivalent[j];
    }
    for (let j=0; j<json_record.definition[i].example.length; j++) {
      new_totem_block(Totem.EXAMPLE, i);
      document.getElementById("input_" + INPUT_NAME[Input.SOURCE] + "_" + j + "_" + i).value = json_record.definition[i].example[j].source;
      document.getElementById("input_" + INPUT_NAME[Input.FILE] + "_" + j + "_" + i).value = json_record.definition[i].example[j].file;
      document.getElementById("input_" + INPUT_NAME[Input.DISPLAY] + "_" + j + "_" + i).value = json_record.definition[i].example[j].display;
      document.getElementById("input_" + INPUT_NAME[Input.CONTRIBUTOR] + "_" + j + "_" + i).value = json_record.definition[i].example[j].contributor;
    }
  }
}

//======================================================================================================

function new_totem_block(totem_type, definition_num = -999) {
  
  let totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + definition_num);
  let totem_count = parseInt(totem.getAttribute("data-blockcount"));
  
  let totemBlockContainer = document.createElement("div");  
  totemBlockContainer.setAttribute("class", "grid_box");
  totemBlockContainer.setAttribute("id", "totemBlockContainer_" + TOTEM_NAME[totem_type] + "_" + totem_count + "_" + definition_num);
  totemBlockContainer.style.gridTemplateColumns = "auto 45px";
  
  switch(totem_type) {
    case Totem.ROMAJI:
      totemBlockContainer.appendChild(new_input_field(Input.ROMAJI, totem_count, definition_num));
      totemBlockContainer.appendChild(get_new_controller_button_set(totem_type, totem_count, definition_num));
      totem.appendChild(totemBlockContainer);
      break;
      
    case Totem.KANA:
      totemBlockContainer.style.gridTemplateColumns = "1fr 1fr 45px"; /* katakan, hiragan, controlbox*/
      totemBlockContainer.appendChild(new_input_field(Input.KATAKANA, totem_count, definition_num));
      totemBlockContainer.appendChild(new_input_field(Input.HIRAGANA, totem_count, definition_num));
      totemBlockContainer.appendChild(get_new_controller_button_set(totem_type, totem_count, definition_num));
      totem.appendChild(totemBlockContainer);
      break;
      
    case Totem.DEFINITION:
      totemBlockContainer.style.paddingBottom = "10px";
      
      let fullDiv = document.createElement("div");
      fullDiv.setAttribute("class", "grid_box");
      
      let upperDiv = document.createElement("div");
      upperDiv.setAttribute("class", "grid_box");
      upperDiv.style.outline = "1px solid black";
      upperDiv.style.padding = "5px";
      upperDiv.style.backgroundColor = "#505050";
      upperDiv.style.gridTemplateColumns = "100px 38px auto"; /* refer, type, meaning */
      upperDiv.appendChild(new_input_field(Input.REFER, totem_count, definition_num));
      upperDiv.appendChild(new_input_field(Input.TYPE, totem_count, definition_num));
      upperDiv.appendChild(new_input_field(Input.MEANING, totem_count, definition_num));
      fullDiv.appendChild(upperDiv);
      
      let lowerDiv = document.createElement("div");
      lowerDiv.setAttribute("class", "grid_box");
      lowerDiv.style.gridTemplateColumns = "200px auto"; /* equiv, examples */
      lowerDiv.style.backgroundColor = "#505050";
      let definitionTotem = document.getElementById("totem_" + TOTEM_NAME[Totem.DEFINITION] + "_" + definition_num);
      let definitionTotem_count = totem.getAttribute("data-blockcount")
      lowerDiv.appendChild(new_totem(Totem.EQUIVALENT, definitionTotem_count));
      lowerDiv.appendChild(new_totem(Totem.EXAMPLE, definitionTotem_count));      
      fullDiv.appendChild(lowerDiv);
      
      totemBlockContainer.appendChild(fullDiv);
      totemBlockContainer.appendChild(get_new_controller_button_set(totem_type, totem_count, definition_num));
      totem.appendChild(totemBlockContainer);
      break;
      
    case Totem.EQUIVALENT:
      totemBlockContainer.appendChild(new_input_field(Input.EQUIVALENT, totem_count, definition_num));
      totemBlockContainer.appendChild(get_new_controller_button_set(totem_type, totem_count, definition_num));
      totem.appendChild(totemBlockContainer);
      break;
      
    case Totem.EXAMPLE:
      totemBlockContainer.style.gridTemplateColumns = "180px 30px 150px auto 180px 45px"; /* source, dropdown, filename, display, contributor control-box*/
      totemBlockContainer.appendChild(new_input_field(Input.SOURCE, totem_count, definition_num));
      totemBlockContainer.appendChild(new_publisher_dropdown_button(INPUT_NAME[Input.SOURCE], totem_count, definition_num));
      totemBlockContainer.appendChild(new_input_field(Input.FILE, totem_count, definition_num));
      totemBlockContainer.appendChild(new_input_field(Input.DISPLAY, totem_count, definition_num));
      totemBlockContainer.appendChild(new_input_field(Input.CONTRIBUTOR, totem_count, definition_num));
      totemBlockContainer.appendChild(get_new_controller_button_set(totem_type, totem_count, definition_num));
      totem.appendChild(totemBlockContainer);
      break;
  }
  
  totem_count += 1;
  totem.setAttribute("data-blockcount", totem_count);
}

//======================================================================================================

function new_publisher_dropdown_button(field_name, totem_num, def_num) {
  let dropdown_btn = document.createElement("input");
  dropdown_btn.setAttribute("type", "button");
  dropdown_btn.setAttribute("name", "publisher_dropdown_button");
  dropdown_btn.setAttribute("onClick", "javascript: publisher_dropdown_clicked(\"" + field_name + "\", " + totem_num + ", " + def_num + ");" );
  dropdown_btn.setAttribute("tabindex", "-1");
  dropdown_btn.value = "⇓";
  dropdown_btn.className = "little_button"; 
  return dropdown_btn;
}

//======================================================================================================

function swap_definition_totems(top_definition) {
  //for swapping equivalents & examples between neighboring definitions
  
  let bottom_definition = top_definition + 1;
  
  // --> Equivalents
  let totem_type = Totem.EQUIVALENT
  let top_totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + top_definition);
  let bottom_totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + (top_definition + 1));
  let temp_totem = top_totem.cloneNode(true);
  
  top_totem.innerHTML = "";
  top_totem.setAttribute("data-blockcount", 0);
  for (let i=0; i<bottom_totem.getAttribute("data-blockcount"); i++) {
    new_totem_block(totem_type, top_definition);
    document.getElementById("input_" + INPUT_NAME[Input.EQUIVALENT] + "_" + i + "_" + top_definition).value = bottom_totem.children[i].firstChild.value;
  }
  bottom_totem.innerHTML = "";
  bottom_totem.setAttribute("data-blockcount", 0);
  for (let i=0; i<temp_totem.getAttribute("data-blockcount"); i++) {
    new_totem_block(totem_type, bottom_definition);
    document.getElementById("input_" + INPUT_NAME[Input.EQUIVALENT] + "_" + i + "_" + bottom_definition).value = temp_totem.children[i].firstChild.value;
  }
  
  // --> Examples
  totem_type = Totem.EXAMPLE
  top_totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + top_definition);
  bottom_totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + bottom_definition);
  temp_totem = top_totem.cloneNode(true);
  
  top_totem.innerHTML = "";
  top_totem.setAttribute("data-blockcount", 0);
  for (let i=0; i<bottom_totem.getAttribute("data-blockcount"); i++) {
    new_totem_block(totem_type, top_definition);
    document.getElementById("input_" + INPUT_NAME[Input.SOURCE] + "_" + i + "_" + top_definition).value = document.getElementById("input_" + INPUT_NAME[Input.SOURCE] + "_" + i + "_" + (top_definition + 1)).value;
    document.getElementById("input_" + INPUT_NAME[Input.FILE] + "_" + i + "_" + top_definition).value = document.getElementById("input_" + INPUT_NAME[Input.FILE] + "_" + i + "_" + (top_definition + 1)).value;
    document.getElementById("input_" + INPUT_NAME[Input.DISPLAY] + "_" + i + "_" + top_definition).value = document.getElementById("input_" + INPUT_NAME[Input.DISPLAY] + "_" + i + "_" + (top_definition + 1)).value;
    document.getElementById("input_" + INPUT_NAME[Input.CONTRIBUTOR] + "_" + i + "_" + top_definition).value = document.getElementById("input_" + INPUT_NAME[Input.CONTRIBUTOR] + "_" + i + "_" + (top_definition + 1)).value;
  }
  
  bottom_totem.innerHTML = "";
  bottom_totem.setAttribute("data-blockcount", 0);
  for (let i=0; i<temp_totem.getAttribute("data-blockcount"); i++) {
    new_totem_block(totem_type, bottom_definition);
    document.getElementById("input_" + INPUT_NAME[Input.SOURCE] + "_" + i + "_" + bottom_definition).value = temp_totem.children[i].children[0].value;
    document.getElementById("input_" + INPUT_NAME[Input.FILE] + "_" + i + "_" + bottom_definition).value = temp_totem.children[i].children[1].value;
    document.getElementById("input_" + INPUT_NAME[Input.DISPLAY] + "_" + i + "_" + bottom_definition).value = temp_totem.children[i].children[2].value;
    document.getElementById("input_" + INPUT_NAME[Input.CONTRIBUTOR] + "_" + i + "_" + bottom_definition).value = temp_totem.children[i].children[3].value;
  }
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
    document.getElementById("body").setAttribute("onbeforeunload", "return true");
}

//======================================================================================================

function swap_definition_inputs(input_type, top_definition) {
  //for swapping refer, type, & meaning between neighboring definitions
  
  let bottom_definition = top_definition + 1;
  
  let top_field = document.getElementById("input_" + INPUT_NAME[input_type] + "_" + top_definition + "_-999");
  let bottom_field = document.getElementById("input_" + INPUT_NAME[input_type] + "_" + (bottom_definition) + "_-999");
  let temp_value = top_field.value;
  
  top_field.value = bottom_field.value;
  bottom_field.value = temp_value;
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
    document.getElementById("body").setAttribute("onbeforeunload", "return true");
}

//======================================================================================================

function swap_totem_inputs(input_type, top_position, definition_num) {
  //for swapping neighboring inputs that share the same totem
  
  let bottom_position = top_position + 1;
  
  let top_field = document.getElementById("input_" + INPUT_NAME[input_type] + "_" + top_position + "_" + definition_num);
  let bottom_field = document.getElementById("input_" + INPUT_NAME[input_type] + "_" + (top_position + 1) + "_" + definition_num);
  let temp_value = top_field.value;
  
  top_field.value = bottom_field.value;
  bottom_field.value = temp_value;
  
  bUpdated = true;
  document.getElementById("modified_label").style.display = "block";
    document.getElementById("body").setAttribute("onbeforeunload", "return true");
}

//======================================================================================================

function remove_totem_block(totem_type, totem_item, definition_num = -999) {
  let totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + definition_num);
  let totem_count = parseInt(totem.getAttribute("data-blockcount"));
  
  if (totem_count <= 1) return;
  
  switch(totem_type) {
    case Totem.ROMAJI:
      for (let i=totem_item; i<totem_count - 1; i++) {
        swap_totem_inputs(Input.ROMAJI, i, definition_num);
      }
      break;
      
    case Totem.KANA:
      for (let i=totem_item; i<totem_count - 1; i++) {
        swap_totem_inputs(Input.KATAKANA, i, definition_num);
        swap_totem_inputs(Input.HIRAGANA, i, definition_num);
      }
      break;
      
    case Totem.DEFINITION:
      for (let i=totem_item; i<totem_count - 1; i++) {
        swap_definition_inputs(Input.REFER, i);
        swap_definition_inputs(Input.TYPE, i);
        swap_definition_inputs(Input.MEANING, i);
        swap_definition_totems(i);
      }
      break;
      
    case Totem.EQUIVALENT:
      for (let i=totem_item; i<totem_count - 1; i++) {
        swap_totem_inputs(Input.EQUIVALENT, i, definition_num);
      }
      break;
      
    case Totem.EXAMPLE:
      for (let i=totem_item; i<totem_count - 1; i++) {
        swap_totem_inputs(Input.SOURCE, i, definition_num);
        swap_totem_inputs(Input.FILE, i, definition_num);
        swap_totem_inputs(Input.DISPLAY, i, definition_num);
        swap_totem_inputs(Input.CONTRIBUTOR, i, definition_num);
      }
      break;
      
  }
  
  document.getElementById("totemBlockContainer_" + TOTEM_NAME[totem_type] + "_" + (totem_count - 1) + "_" + definition_num).remove();
  totem_count -= 1;
  totem.setAttribute("data-blockcount", totem_count);
  

}

//======================================================================================================

function move_totem_item(totem_type, totem_item, definition_num = -999) {
  let totem = document.getElementById("totem_" + TOTEM_NAME[totem_type] + "_" + definition_num);
  let totem_count = parseInt(totem.getAttribute("data-blockcount"));
  
  if (totem_item >= totem_count - 1 || totem_item < 0) return;  //skip if trying to move last or first totem block
  
  switch(totem_type) {
    case Totem.ROMAJI:
      swap_totem_inputs(Input.ROMAJI, totem_item, definition_num);
      break;
      
    case Totem.KANA:
      swap_totem_inputs(Input.KATAKANA, totem_item, definition_num);
      swap_totem_inputs(Input.HIRAGANA, totem_item, definition_num);
      break;
      
    case Totem.DEFINITION:
      swap_definition_inputs(Input.REFER, totem_item);
      swap_definition_inputs(Input.TYPE, totem_item);
      swap_definition_inputs(Input.MEANING, totem_item);
      swap_definition_totems(totem_item);
      break;
      
    case Totem.EQUIVALENT:
      swap_totem_inputs(Input.EQUIVALENT, totem_item, definition_num);
      break;
      
    case Totem.EXAMPLE:
      swap_totem_inputs(Input.SOURCE, totem_item, definition_num);
      swap_totem_inputs(Input.FILE, totem_item, definition_num);
      swap_totem_inputs(Input.DISPLAY, totem_item, definition_num);
      swap_totem_inputs(Input.CONTRIBUTOR, totem_item, definition_num);
      break;
  }
}

//======================================================================================================
// Popup Stuff
//======================================================================================================


function publisher_dropdown_clicked(field_name, totem_position, definition_num) {
  let left_popup = document.getElementById("publisher_popup_left");
  let right_popup = document.getElementById("publisher_popup_right");
  let publisher_field = document.getElementById("input_" + field_name + "_" + totem_position + "_" + definition_num);
  
  // our input fields are not normally named in the editor, so we're temporarily borrowing the name attribute of the "active" publisher field 
  // and setting whichever one to "publisher_picked" when the popup is open for easy reference in the picked_publisher() function below
  
  if (PUBLISHER_POPUP_VISIBLE) {
    //hide
    PUBLISHER_POPUP_VISIBLE = false;
    left_popup.style.display = "none";
    right_popup.style.display = "none";
    publisher_field.name = "";
  } else {
    //show
    PUBLISHER_POPUP_VISIBLE = true;
    field_bounding_box = publisher_field.getBoundingClientRect();
    left_popup.style.top = (field_bounding_box.top + 23) + "px";
    left_popup.style.left = (field_bounding_box.left + 173) + "px";
    left_popup.style.display = "block";
    right_popup.style.top = (field_bounding_box.top + 23) + "px";
    right_popup.style.left = (field_bounding_box.left + 344) + "px";
    right_popup.style.display = "block";
    publisher_field.name = "publisher_picked";
  }
}

//======================================================================================================

function picked_publisher(publisher) {
  let publisher_field = document.getElementsByName("publisher_picked")[0];
  publisher_field.value = publisher;
  publisher_field.name = "";
  
  document.getElementById("publisher_popup_left").style.display = "none";
  document.getElementById("publisher_popup_right").style.display = "none";
  PUBLISHER_POPUP_VISIBLE = false;
}

//======================================================================================================

function showOverlay(message) {
  document.getElementById('dialog').innerHTML = message  
  document.getElementById('blackOverlay').style.display = 'block';
}
