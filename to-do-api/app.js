const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//gelen isteklerdeki json formatındaki verileri otomatik ayrıştırır.
app.use(express.json());
app.use(cors());

//sql yapılandırması
const sql = require("mssql/msnodesqlv8"); // mssql modülünü dahil edin
const config = require("./dbConfig"); // dbConfig.js dosyasını içe aktarın

//CONFIG NESNESIYLE BAĞLANMA
// SQL Server'a bağlanma
sql.connect(config, (err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err);
    console.log("Detaylı hata bilgisi:", err);
  } else {
    console.log("Veritabanına başarıyla bağlandı!");

    // Bağlantı başarılıysa bir sorgu çalıştır
    const request = new sql.Request();
    request.query("SELECT * FROM Tasks", (err, result) => {
      if (err) {
        console.error("Sorgu hatası:", err);
        console.log("Detaylı hata bilgisi:", err);
      } else {
        console.log("Sorgu sonuçları:", result.recordset);
      }
    });
  }
});

//API TESTİ İÇİN GET
app.get("/api/tasks", (req, res) => {
  const query = "SELECT * FROM Tasks";

  sql.connect(config, (err) => {
    if (err) return res.status(500).send("Veritabanı bağlantı hatası");

    const request = new sql.Request();
    request.query(query, (err, result) => {
      if (err) return res.status(500).send("SQL sorgu hatası");

      res.status(200).json(result.recordset);
    });
  });
});

// web sayfasından gelen görevi sql'e eklemek için post route u oluştur.
app.post("/api/tasks", (req, res) => {
  //web sayfasından gelen görev metinin al.
  const { TaskText } = req.body;

  //Sql sorgusu
  const query =
    "INSERT INTO Tasks (Tasktext,IsStrikeThrough) OUTPUT INSERTED.TaskID VALUES (@TaskText, 0)";

  //veritabanı bağlantısı kurun ve sorguyu çalıştırın.
  sql.connect(config, (err) => {
    if (err) return res.status(500).send(err); //bağlantı hatası varsa 500 döndür

    const request = new sql.Request(); //request sınıfından bir nesne oluştur
    request.input("TaskText", sql.NVarChar, TaskText); //görev metnini sql sorgusuna eklemek için kullanılır.
    request.query(query, (err, result) => {
      if (err) return res.status(500).send(err); //sorguda hata varsa 500 döndür.
      console.log("SQL Sorgu Sonucu:", result.recordset);
      // Eklenen görevin TaskID'sini döndür
     // TaskID'yi içeren sonucu JSON formatında gönder
     res.status(201).json({ message: "Görev başarıyla eklendi!", TaskID: result.recordset[0].TaskID });
    });
  });
});


//görev silmek için Delete route u oluştur
app.delete("/api/tasks/:TaskID", (req, res) => {
  
  const TaskID = parseInt(req.params.TaskID);
  const query = "DELETE FROM Tasks WHERE TaskID = @TaskID";
  sql.connect(config,(err)=>{
    if(err) return res.status(500).send("veritabanı bağlantı hatası");

    const request = new sql.Request(); // request sınıfından bir nesne oluştur
    request.input("TaskID",sql.Int,TaskID); //TaskID yi sql sorgusuna eklemek için kullanılır.
    request.query(query,(err, result)=> {
      if (err) return res.status(500).send("SQL Sorgu hatası");
      res.status(200).json({message: "Görev başarıyla silindi!"}); // 200 OK
    });

  });
 
});

//Güncelleme route'u.
app.put("/api/tasks/:TaskID", (req, res) => {
  const TaskID = parseInt(req.params.TaskID);
  const query = "UPDATE Tasks SET IsStrikethrough = 1 WHERE TaskID = @TaskID";
  sql.connect(config, (err) => {
    if (err) return res.status(500).send("Veritabanı bağlantı hatası.");
    
    const request = new sql.Request();
    request.input("TaskID", sql.Int, TaskID);
    request.query(query, (err, result) => {
      if (err) return res.status(500).send("SQL Sorgu hatası");
      
      res.status(200).json({ message: "Görev güncellendi." });
    });
  });
});

// //GET İsteği ile Belirli Bir Veriyi ID ile Döndürme
// app.get("/api/data/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const item = data.find((d) => d.id === id);
//   if (!item) {
//     return res.status(404).json({ message: "Böyle bir veri bulunamadı." });
//   }
//   res.status(200).json(item);
// });

// //POST İsteği ile Yeni Bir Veri Ekleme
// app.post("/api/data", (req, res) => {
//   const newItem = {
//     id: data.lenght + 1,
//     name: req.body.name,
//   };
//   data.push(newItem);
//   res.status(201).json(newItem);
// });

//sunucuyu dinlemeye başlama

//basit authenticator için middleware
// const basicAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     //authHeaderdan gelen kodu çözümle ve giriş bilgilerini ayıkla
//     const [username, password] = Buffer.from(authHeader.split(" ")[1], "base64")
//       .toString()
//       .split(":");
//     //kullanıcı adı ve şifreyi kontrol et
//     if (username === "admin" && password === "password") {
//       //eğer eşleşiyorsa bir sonraki middleware ya da route'a geç.
//       return next();
//     }
//   }
//   //kullanıcı adı veya şifre hatalıysa ya da autHeader boş ise 401 hatası ver.
//   res.status(401).json({ message: "unauthorized" });
// };

//basic auth ile veri getirme
// app.get("/api/data",basicAuth,(req,res)=> {
//     res.status(200).json(data);
// });

//basic auth ile id ye göre getirme
// app.get("api/data/:id", basicAuth, (req,res) => {
// // req.params.id ile id parametresi okunabilir.
// const id = parseInt(req.params.id);
// const item =data.find(d=>d.id ===id);

// if(!item) {
//     return res.status(404).json({message:"Böyle bir veri bulunamadı."});
// }
// res.status(200).json(item);
// });

//doğrumaa sonrası yeni veri eklenebilir
// app.post("api/data",basicAuth,(req,res)=> {
//     //req.body.name ile request in bodysindeki json nesneye erişilir.
//     new item = {
//         id: data.lenght+1,
//         name: req.body.name,
//     };

//     data.push(newItem);
//     res.status(201).json(newItem);
// });

//bu kısım express uygulamamızı belirli bir port üzerinde çalıştırır ve  terminalde hangi adreste çalıştığını bildirir.
app.listen(port, () => {
  console.log(`API http://localhost:${port} üzerinde çalışıyor.`);
});
