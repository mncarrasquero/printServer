const express = require('express')
const path = require('path')
var fs = require('fs');
var printer = require("pdf-to-printer");
var download = require('download-file')

const {
  PDFDocumentFactory,
  PDFDocumentWriter,
  StandardFonts,
  drawLinesOfText,
  drawImage,
  drawRectangle,
} = require('pdf-lib');



const PORT = process.env.PORT || 5000




// var url = "https://api.mercadolibre.com/shipment_labels?shipment_ids=28018420154&savePdf=Y&access_token=APP_USR-2296962313426801-072116-fb9504672f3b683db092c8cce1e1e7b8-288767758"
 
// var options = {
//     directory: "./guias/",
//     filename: "123.pdf"
// }
 
// download(url, options, function(err){
//     if (err) throw err
//     console.log("meow")

//     const assets = {
//       guiaEnvioBytes: fs.readFileSync('./guias/123.pdf'),
//     };
//     const pdfDoc = PDFDocumentFactory.load(assets.guiaEnvioBytes);
    
//     pdfDoc.removePage(0)
//     const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
    
//     /* ========================== 7. Write PDF to File ========================== */
//     // This step is platform dependent. Since this is a Node script, we can just
//     // save the `pdfBytes` to the file system, where it can be opened with a PDF
//     // reader.
//     const filePath = `${__dirname}/guias/123.pdf`;
//     fs.writeFileSync(filePath, pdfBytes);
//     console.log(`PDF file written to: ${filePath}`);
    
    
    
    
//     const optionsPrinter = {
//       printer: "M2070",
//       copies: 3,
//       copie: 3
//     };
    
//     printer
//      .print("./guias/123.pdf",optionsPrinter)
//       .then(console.log)
//       .catch(console.error);
// }) 










express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get("/printGuiaServientrega/:printerName/:idVenta/:url", function (req, res) {
    var idVenta = req.params.idVenta;
    var url = req.params.url;
    var printerName = req.params.printerName;
    var url = req.params.url; 
    var options = {
    directory: "./guias/",
    filename: idVenta+".pdf"
}
 
download(url, options, function(err){
    if(err){
      res.send({ 
        status: '400',
        msg : 'no se pudo descargar',
        url: url
      })      
    }else{
    

      //ya se decargo 
      //ahora modificar 
          const assets = {
          guiaEnvioBytes: fs.readFileSync('./guias/'+idVenta+'.pdf'),
        };
        const pdfDoc = PDFDocumentFactory.load(assets.guiaEnvioBytes);
        
        pdfDoc.removePage(0)
        const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
      
        const filePath = `${__dirname}/guias/`+idVenta+`.pdf`;
        fs.writeFileSync(filePath, pdfBytes);
        console.log(`PDF file written to: ${filePath}`);

          const optionsPrinter = {
            printer: printerName,
            copies: 3,
            copie: 3
          };
          
          printer
          .print("./guias/"+idVenta+".pdf",optionsPrinter)
          .then(function(value) {
            res.send({ 
              status: '200',
              msg : 'ok',
              url: url
            })
          })
         
          .catch(function(error) {
            res.send({ 
              status: '400',
              msg : 'ERROR AL IMPRIMIR',
              error : error,
              url: url
            })
          })
         

      }   
})
})
 
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
