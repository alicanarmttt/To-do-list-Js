let addButton = document.getElementById("add-Button");
let emptyMissionText = document.getElementById("mission-text");
let emptyMission = document.getElementById("emptyMission");
let deleteCheckBx = document.getElementById("checkbox");
//Sayfa yüklendiğinde görevleri çek
window.onload = function () {
  fetch("http://localhost:3000/api/tasks", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => {
        //If emptyMission is exist. Delete this before add new mission.
        if ((emptyMissionText.value = "Eklediğiniz görevler burada görünür.")) {
          emptyMission.remove();
        }
        //create elements
        let missionDiv = document.createElement("div");
        missionDiv.className = "mission";
        missionDiv.setAttribute("data-task-id", task.TaskID); // TaskID'yi sakla silme işlemleri için.

        missionDiv.setAttribute("data-strikethrough",task.IsStrikethrough);
        // console.log("Ustu cizili: ",task.IsStrikethrough);

        let checkBox = document.createElement("input");
        checkBox.type = "checkBox";
        checkBox.id = "checkBox";

        let missionPDiv = document.createElement("div");
        missionPDiv.className = "mission-p";

        let blockquote = document.createElement("blockquote");
        blockquote.className = "blockquote mb-0";

        let p = document.createElement("p");
        p.textContent = task.TaskText;
        //add paranet-child relations.
        blockquote.appendChild(p);
        missionPDiv.appendChild(blockquote);
        missionDiv.appendChild(checkBox);
        missionDiv.appendChild(missionPDiv);
        document.getElementById("board-list").appendChild(missionDiv);
        //clear the writing session.
        document.getElementById("textArea").value = "";

        if (task.IsStrikethrough) {
          p.style.textDecoration = "line-through";
        }
        
        //draw cross out the paragraph
        p.addEventListener("click", function () {
          let TaskID =missionDiv.getAttribute("data-task-id");
          console.log("Güncellenecek TaskID:",TaskID);

          fetch(`http://localhost:3000/api/tasks/${TaskID}`,{
            method:"PUT",
            headers: {
              "Content-Type": "application/json", // JSON formatında veri gönderildiğini belirtiyor
            }
          })
          .then((response)=>{
            if(!response.ok) {
              throw new Error("Apı isteği başarısız oldu.", response.statusText);
            }
            console.log("Güncelleme isteği başarılı: ",TaskID);
            return response.json();
          })
          .then((data)=>{
            console.log("Görev başarıyla güncellendi.",data);
            p.style.textDecoration = "line-through";
          })
          .catch((error)=> console.error("Hata:", error));
        });

        checkBox.addEventListener("click", function () {
          let TaskID = missionDiv.getAttribute("data-task-id"); //TaskID nesnesini id bilgisiyle dolduruyonuz.
          console.log("Silinecek görev ID'si:", TaskID);
          // Görevi veritabanından silmek için API'ye DELETE isteği gönder
          fetch(`http://localhost:3000/api/tasks/${TaskID}`, {
            method: "DELETE",
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  "API isteği başarısız oldu: " + response.statusText
                );
              }
              console.log("Silme isteği başarılı:", TaskID);
              return response.json();
            })

            .then((data) => {
              console.log("Görev başarıyla silindi.", data);
              missionDiv.remove();
            })
            .catch((error) => console.error("Hata:", error));
        });
      });
    })
    .catch((error) => console.error("Hata:", error));
};

///////////////////////////////////////////////////////////////////////////////////////////////////
//add button
addButton.addEventListener("click", function () {
  console.log("Add button clicked!");
  let txtMission = document.getElementById("textArea").value;
  console.log("Task text:", txtMission);
  //if we have a mission, continue.
  if (txtMission.length != 0) {
    //If emptyMission is exist. Delete this before add new mission.
    if ((emptyMissionText.value = "Eklediğiniz görevler burada görünür.")) {
      emptyMission.remove();
    }

    //POST İSTEĞİNİ ÖNCE GÖNDERİP SQL İÇİNDE TASKID oluşturuyoruz. Sonra div elementleriyle yeni görevi yaratıp içerisine
    //TaskID'yi ekliyoruz.
    //API ye yeni görev eklemek için bir POST isteği gönder.
    fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Basic YWRtaW46cGFzc3dvcmQ=", //"admin:password" base64 formatında.
      },
      body: JSON.stringify({ TaskText: txtMission }), //görev metni json formatına çeviriliyor.
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("API isteği başarısız oldu: " + response.statusText);
        }
        return response.json(); ///////////////////////////////////////////////------bu noktada TaskText: p.textContent yerine txtMission
      })
      .then((data) => {
        //create elements
        let missionDiv = document.createElement("div");
        missionDiv.className = "mission";
        missionDiv.setAttribute("data-task-id", data.TaskID); // TaskID'yi div'e ekleyin.

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

        console.log("Görev eklendi.", data);
        // Sayfada eklenen görevi göstermek için gerekli işlemleri burada yapabilirsiniz

        //draw cross out the paragraph
        p.addEventListener("click", function () {
          //data-task-ıd den ID bilgisini tekrar TaskID değişkenine at
          let TaskID = missionDiv.getAttribute("data-task-id");
          console.log("TaskID:", TaskID); // TaskID'yi güncelleme isteği öncesi kontrol edelim
  
          //fetch ile post route oluşturup data ID sine göre strikethrough true olacak.
          fetch(`http://localhost:3000/api/tasks/${TaskID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json", // JSON formatında veri gönderildiğini belirtiyor
            },
          })
            .then((response) => {
              if (!response) {
                throw new Error(
                  "Api isteği başarısız oldu." + response.statusText
                );
              }
              console.log("Güncelleme isteği başarılı." + TaskID);
              return response.json();
            })
            .then((data) => {
              console.log("Başarıyla güncellendi", data);
              p.style.textDecoration = "line-through";
            })
            .catch((error) => console.log("hata:", error));
        });

        //checkboxa tıklandığında görev silinecek
        checkBox.addEventListener("click", function () {
          let TaskID = missionDiv.getAttribute("data-task-id");
          console.log("Silinecek görev ID'si:", TaskID);

          fetch(`http://localhost:3000/api/tasks/${TaskID}`, {
            method: "DELETE",
          })
          .then((response)=>{
            if(!response.ok) {
              console.log("Silme isteği başarısız oldu." +response.statusText);
            }
            return response.json();
          })
          .then((data)=>{
            console.log("Görev başarıyla silindi", data);
            missionDiv.remove();
          })
          .catch((error)=>{console.error("Hata:",error)});
        });
      })

      .catch((error) => console.error("Hata:", error));
  }
  console.log("Fetching data...");
});
