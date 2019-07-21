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
    
      setTimeout(function(){ 
           //ya se decargo 
      //ahora modificar 
      const arichivo = './guias/'+idVenta+'.pdf';
      var direccionArchivo = path.dirname(arichivo);
      
      
      console.log( path.join('guias',idVenta+'.pdf') );
        //   const assets = {
        //   guiaEnvioBytes: fs.readFileSync(path.resolve('./guias/'+idVenta+'.pdf')),
        // };
        const pdfDoc = PDFDocumentFactory.load(fs.readFileSync(path.resolve('./guias/'+idVenta+'.pdf')));
        
        pdfDoc.removePage(0)
        const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc);
      
        const filePath = path.join('guias',idVenta+'.pdf');
        fs.writeFileSync(filePath, pdfBytes);
        console.log(`PDF file written to: ${filePath}`);

          const optionsPrinter = {
            printer: printerName,
            copies: 3,
            copie: 3
          };
          //maldito maduro
          console.log(path.resolve('guias', idVenta+'.pdf'));
          printer
          .print(path.resolve('guias', idVenta+'.pdf'))
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
      
      }, 2000);

   
         

      }   
})
})
 
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
