const content = "https://raw.githubusercontent.com/ObakeConstructs/j-ono-data/main/";
let RECORDS_ARRAY = [];
let PUBLISHERS_ARRAY = [];

let bUpdated = false;
let loaded_id = ""
let textElements = document.querySelectorAll('.input_field');

//======================================================================================================

function setup_controls() {
  controlDiv = document.getElementById("little_wrapper");
  
  let upper_lower_div = document.createElement("div");  
  let upper_div = document.createElement("div");
  let lower_div = document.createElement("div");
  let id_line_div = document.createElement("div");
  let id_div = document.createElement("div");
  let modified_div = document.createElement("div");
  let guide_div = document.createElement("div");
  
  let new_button = document.createElement("input");
  let saver_button = document.createElement("input");
  let collapse_check = document.createElement("input");
  let collapse_label = document.createElement("label");
  
  controlDiv.setAttribute("class", "grid_box");
  upper_lower_div.setAttribute("class", "grid_box");
  upper_div.setAttribute("class", "grid_box");
  lower_div.setAttribute("class", "grid_box");
  id_line_div.setAttribute("class", "grid_box");
  id_div.setAttribute("class", "grid_box");
  modified_div.setAttribute("class", "grid_box");
  guide_div.setAttribute("class", "grid_box");
  
  controlDiv.style.marginTop = "10px";
  
  id_div.setAttribute("id", "loaded_id");  
  modified_div.setAttribute("id", "modified_label");
  
  controlDiv.style.gridTemplateColumns = "455px 300px auto"; /* upper/lower, guide */
  lower_div.style.gridTemplateColumns = "104px 100px auto"; /* new button, download button*/
  id_line_div.style.gridTemplateColumns = "150px auto"; /* ID, collapse check*/
  
  new_button.setAttribute("type", "button");
  new_button.setAttribute("onclick", "new_blank_record()");
  new_button.setAttribute("value", "New");
  new_button.setAttribute("class", "normal_button");
  new_button.setAttribute("tabindex", "-1");
  
  saver_button.setAttribute("type", "button");
  saver_button.setAttribute("onclick", "saver()");
  saver_button.setAttribute("value", "Download");
  saver_button.setAttribute("class", "normal_button");
  saver_button.setAttribute("tabindex", "-1");
  
  collapse_check.setAttribute("type", "checkbox");
  collapse_check.setAttribute("id", "collapse_chk");
  collapse_check.setAttribute("class", "picker");
  
  collapse_label.setAttribute("for", "collapse_chk");
  
  guide_div.innerHTML = "Types:<br>o: onomatopoeic&nbsp;(giongo)<br>v: voiced&nbsp;(giseigo)<br>s: state&nbsp;(gitaigo)<br>m: movement&nbsp;(giyougo)<br>e: emotions&nbsp;(gijougo)<br>c: symbolic&nbsp;cue";
  modified_div.innerHTML = "*Modified";
  
  collapse_label.appendChild(collapse_check);
  collapse_label.innerHTML += " collapse duplicate romaji"
  
  id_line_div.appendChild(id_div);
  id_line_div.appendChild(collapse_label);
  
  upper_div.appendChild(id_line_div);
  upper_div.appendChild(modified_div);
  
  lower_div.appendChild(new_button);
  lower_div.appendChild(saver_button);
  
  upper_lower_div.appendChild(upper_div);
  upper_lower_div.appendChild(lower_div);
  
  controlDiv.appendChild(upper_lower_div);
  controlDiv.appendChild(guide_div);
  
  document.getElementById("collapse_chk").checked = false;
  
}

//======================================================================================================
  
function clear_record() {
  if (bUpdated) {
    showOverlay("<p>The modified flag indicates that changes were made to this record.</p><p><b>--> Removing flag <--</b></p><p>Consider saving your changes, if needed.</p>");
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
    document.getElementById("body").setAttribute("onbeforeunload", null);
    return;
  }
  
  document.getElementById("new_wrapper").innerHTML = "";
  let recordDiv = document.createElement("div");
  recordDiv.setAttribute("class", "grid_box");
  recordDiv.style.gridTemplateColumns = "150px 300px auto"; /* romaji, kana, definition */
  recordDiv.appendChild(new_totem(Totem.ROMAJI));
  recordDiv.appendChild(new_totem(Totem.KANA));
  recordDiv.appendChild(new_totem(Totem.DEFINITION));
  
  document.getElementById("new_wrapper").appendChild(recordDiv);
}


//======================================================================================================

function new_blank_record() {
  clear_record();
  
  new_totem_block(Totem.ROMAJI);
  new_totem_block(Totem.KANA);
  new_totem_block(Totem.DEFINITION);
  new_totem_block(Totem.EQUIVALENT, 0);
  new_totem_block(Totem.EXAMPLE, 0);
  
  loaded_id = "";
  document.getElementById("loaded_id").innerHTML = "ID: [null]";
}

//======================================================================================================
  

function populate_publisher_popups() {
  let ids = [];
  
  PUBLISHERS_ARRAY.forEach((pub) => {
    pub.sources.forEach((source) => {
      ids.push(source.id);
    });    
  });
  ids.sort();
  
  for (let i=0; i<Math.floor(ids.length/2); i++) {
    document.getElementById("publisher_popup_left").innerHTML += "<a href='#!' class='pick_link' onclick=\"javascript: picked_publisher('" + ids[i] + "')\">" + ids[i] + "</a>";
  }
  if(Math.floor(ids.length/2) != ids.length/2) {
    document.getElementById("publisher_popup_left").innerHTML += "<a class='pick_link'>&nbsp;</a>"
  }
  for (let i=Math.floor(ids.length/2); i<ids.length; i++) {
    document.getElementById("publisher_popup_right").innerHTML += "<a href='#!' class='pick_link' onclick=\"javascript: picked_publisher('" + ids[i] + "')\">" + ids[i] + "</a>";
  }
}
  
//======================================================================================================

function create_picker_list() {
  let picker = document.getElementById("picker");
  
  // picker is grouped by letter, starting with A:  
  // initial settings (starting with "a" words).
  let groupLetter = "a";
  let subGroupLetter = "";
  picker.innerHTML += "A:\t"
  
  for (let i=0; i<RECORDS_ARRAY.length; i++) {
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
    picker.innerHTML += "<a href='#!', onclick=\"javascript: record_to_fields('" + i + "');\" tabindex='-1'>" + RECORDS_ARRAY[i].id	 + "</a>, ";
  }
}
  
//======================================================================================================

function record_to_fields(record_num) {
  if (bUpdated) {
    clear_record();
    return;
  }  
  clear_record();
  
  json_to_field(RECORDS_ARRAY[record_num])
}
  
//======================================================================================================

function get_id() {
  let romaji_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[Totem.ROMAJI] + "_-999").getAttribute("data-blockcount"));
  let bCollapse = document.getElementById("collapse_chk").checked;
  let id_parts = [];
  
  for (let i=0; i<romaji_count; i++) {
    romaji = document.getElementById("input_" + INPUT_NAME[Input.ROMAJI] + "_" + i + "_-999").value;
    
    // check for doublets
    if (romaji.includes(" ") && bCollapse == true) {
      let romaji_parts = romaji.split(" ");
      if (romaji_parts[0] === romaji_parts[1] && romaji_parts.length == 2) {
        romaji = romaji_parts[0];
      }
    }
    
    // check for dupes
    let has_dupes = false;
    if (i > 0 && bCollapse == true) {
      for (let j=0; j<i; j++) {
        if (id_parts[j] === romaji) {
          has_dupes = true;
        }
      }
    }
    if (!has_dupes) {
      id_parts.push(romaji);
    }
  }
  
  // put the parts together
  let id = id_parts[0];
  for (let i=1; i<id_parts.length; i++) {
    id += " " + id_parts[i];
  }
  return id;
}
  
//======================================================================================================

function new_json_record_from_fields() {
  let romaji_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[Totem.ROMAJI] + "_-999").getAttribute("data-blockcount"));
  let kana_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[Totem.KANA] + "_-999").getAttribute("data-blockcount"));
  let definition_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[Totem.DEFINITION] + "_-999").getAttribute("data-blockcount"));
  let json_object;
  const roms = [];
  const katas = [];
  const hiras = [];
  const defs = [];
  
  // id
  const id = get_id();
  
  // romaji
  for (let i=0; i<romaji_count; i++) {
    romaji = document.getElementById("input_" + INPUT_NAME[Input.ROMAJI] + "_" + i + "_-999").value;
    if (romaji.length == 0) return null;
    roms.push(romaji);
  }
  
  // katagana
  for (let i=0; i<kana_count; i++) {
    katakana = document.getElementById("input_" + INPUT_NAME[Input.KATAKANA] + "_" + i + "_-999").value;
    hiragana = document.getElementById("input_" + INPUT_NAME[Input.HIRAGANA] + "_" + i + "_-999").value;
    if (katakana === "" || hiragana === "") return null;
    katas.push(katakana);
    hiras.push(hiragana);
  }
  
  // definitions
  for (let i=0; i<definition_count; i++) {
    const equis = [];
    const exams = [];
    let equivalent_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[Totem.EQUIVALENT] + "_" + i).getAttribute("data-blockcount"));
    let example_count = parseInt(document.getElementById("totem_" + TOTEM_NAME[Totem.EXAMPLE] + "_" + i).getAttribute("data-blockcount"));
    re = document.getElementById("input_" + INPUT_NAME[Input.REFER] + "_" + i + "_-999").value;
    ty = document.getElementById("input_" + INPUT_NAME[Input.TYPE] + "_" + i + "_-999").value;
    me = document.getElementById("input_" + INPUT_NAME[Input.MEANING] + "_" + i + "_-999").value;
    if (ty === "" && re === "") return null;
    if (me === "" && re === "") return null;

    // equivalents
    for (let j=0; j<equivalent_count; j++) {
      equivalent = document.getElementById("input_" + INPUT_NAME[Input.EQUIVALENT] + "_" + j + "_" + i).value;
      if (equivalent === "" && re === "") return null;
      equis.push(equivalent);
    }
    equis.sort();

    // examples
    for (let j=0; j<example_count; j++) {
      source = document.getElementById("input_" + INPUT_NAME[Input.SOURCE] + "_" + j + "_" + i).value;
      file = document.getElementById("input_" + INPUT_NAME[Input.FILE] + "_" + j + "_" + i).value;
      display = document.getElementById("input_" + INPUT_NAME[Input.DISPLAY] + "_" + j + "_" + i).value;
      contributor = document.getElementById("input_" + INPUT_NAME[Input.CONTRIBUTOR] + "_" + j + "_" + i).value;
      if (source === "" || file === "" | display === "") return null;
      let ex = {
        source: source,
        file: file,
        display: display,
        contributor: contributor,
      };
      exams.push(ex);
    }
    let de = {
      refer: re,
      type: ty,
      meaning: me,
      equivalent: equis,
      example: exams
    };
    defs.push(de);
  }
    
  json_obj = {
    id: id,
    romaji: roms,
    katakana: katas,
    hiragana: hiras,
    definition: defs
  };
  
  return JSON.stringify(json_obj, null, 2)
}
  
//======================================================================================================

function saver() {
  let id = get_id();  
  if (id != loaded_id && loaded_id !== "") {
    showOverlay("<p>This record's ID is based off its romaji list, which you have modified.</p><p><b>--> Updating the ID for this record <--</b></p><p>This means that this record will no longer overwrite the original record file (" + loaded_id + ".json). You will need to manually remove the old record file to avoid duplication.</p>");
    loaded_id = id;
    document.getElementById("loaded_id").innerHTML = "ID: " + loaded_id;
    return;
  }
  
  let json_record = new_json_record_from_fields();
  
  if(json_record) {
    let saver_link = document.createElement('a');
    saver_link.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(json_record));
    saver_link.setAttribute('download', id);
    saver_link.style.display = 'none';
    
    document.body.appendChild(saver_link);
    saver_link.click();
    document.body.removeChild(saver_link);
    
    bUpdated = false;
    document.getElementById("modified_label").style.display = "none";
    document.getElementById("body").setAttribute("onbeforeunload", null);
  } else {
    showOverlay("<p>This record has one or more blank fields that should not be blank.</p>");
    return;
  }
}
  
//=================================================================================

function send_stats_to_console() {
  let kana_cnt = 0;
  let def_cnt = 0;
  let img_cnt = 0;
  
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
    let pubcnt = 0;
    pub.sources.forEach((source) => {
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
      let sercnt = 0;
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

async function opener() {
  const data = await fetch(content + "json/j-ono-data.json");
  RECORDS_ARRAY = await data.json();
  
  const src = await fetch(content + "json/j-ono-source.json");
  PUBLISHERS_ARRAY = await src.json();
  
  populate_publisher_popups();
  setup_controls();
  create_picker_list();
  send_stats_to_console();
  
  document.getElementById("modified_label").style.display = "none";
  
  new_blank_record();
}
