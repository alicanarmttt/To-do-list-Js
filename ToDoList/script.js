let addButton = document.getElementById("add-Button");
let emptyMissionText = document.getElementById("mission-text");
let emptyMission = document.getElementById("emptyMission");
//add button
addButton.addEventListener("click", function () {
  let txtMission = document.getElementById("textArea").value;
  //if we have a mission, continue.
  if (txtMission.length != 0) {
    //If emptyMission is exist. Delete this before add new mission.
    if ((emptyMissionText.value = "Eklediğiniz görevler burada görünür.")) {
      emptyMission.remove();
    }
    //create elements
    let missionDiv = document.createElement("div");
    missionDiv.className = "mission";

    let checkBox = document.createElement("input");
    checkBox.type = "checkBox";
    checkBox.id = "checkBox";

    let missionPDiv = document.createElement("div");
    missionPDiv.className = "mission-p";

    let blockquote = document.createElement("blockquote");
    blockquote.className = "blockquote mb-0";

    let p = document.createElement("p");
    p.textContent = txtMission;
    //add paranet-child relations.
    blockquote.appendChild(p);
    missionPDiv.appendChild(blockquote);
    missionDiv.appendChild(checkBox);
    missionDiv.appendChild(missionPDiv);
    document.getElementById("board-list").appendChild(missionDiv);
    //clear the writing session.
    document.getElementById("textArea").value = "";

    //draw cross out the paragraph
    p.addEventListener("click",function(){
        p.style.textDecoration = "line-through"
    })
    
    checkBox.addEventListener("click",function(){
        missionDiv.remove();
    })
  }
});
