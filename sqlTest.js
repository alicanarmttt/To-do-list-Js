
//CONNECTION STRING ILE BAĞLANMA
const sql = require('mssql/msnodesqlv8');  // mssql modülünü dahil edin
const config = require('./dbConfig');  // dbConfig.js dosyasını içe aktarın
//CONFIG NESNESIYLE BAĞLANMA
// SQL Server'a bağlanma
sql.connect(config, err => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err);
    console.log('Detaylı hata bilgisi:', err);
    
  } else {
    console.log('Veritabanına başarıyla bağlandı!');
    
    // Bağlantı başarılıysa bir sorgu çalıştır
    const request = new sql.Request();
    request.query('SELECT * FROM Tasks', (err, result) => {
      if (err) {
        console.error('Sorgu hatası:', err);
        console.log('Detaylı hata bilgisi:', err);
      } else {
        console.log('Sorgu sonuçları:', result.recordset);
      }
    });
  }
});


// // Doğrudan bağlantı dizesi kullanarak SQL Server'a bağlanma
// sql.connect("Data Source=192.168.1.11,1433;Initial Catalog=DBToDo;Integrated Security=True", function(err) { 
//   if (err) {
//       console.error("Connection error: ", err);
//   } else {
//       console.log("Connected to the database!");

//       // Bağlantı başarılıysa bir sorgu çalıştır
//       const request = new sql.Request();
//       request.query('SELECT * FROM Tasks', (err, result) => {
//         if (err) {
//           console.error('Sorgu hatası:', err);
//         } else {
//           console.log('Sorgu sonuçları:', result.recordset);
//         }
//       });
//   }
// });
