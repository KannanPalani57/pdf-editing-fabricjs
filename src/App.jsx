import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fabric } from 'fabric'
import output from './output'

function App() {




  const [pdfInstance, setPdfInstance] = useState(null)



  const handleFileUpload = (e) => {


    const pdfFile = e.target.files[0]

    var fileReader = new FileReader();

    fileReader.onload = function () {

      var typedarray = new Uint8Array(this.result);

      var pdf = new PDFAnnotate('pdf-container', typedarray, {
        onPageUpdated(page, oldData, newData) {
          console.log(page, oldData, newData);


        },
        ready(canvases) {
          console.log('Plugin initialized successfully');
          pdf.loadFromJSON(output);
          console.log({
            canvases
          })

          canvases?.forEach(canvas => {
            canvas.on("mouse:up", (e) => {
              console.log("mouse clicked", e)
            })


            canvas?.on("mouse:dblclick", (e) => {
              if (e.target) {
                console.log(e.target, "-----e", e.target.left)
                if (e.target.type === "rect") {
                  var text = new fabric.Text('Updated Sign', {
                    fill: 'green',
                    left: e.target.left,
                    top: e.target.top,
                    selectable: false
                  });

                  canvas.remove(e.target)


                  // Render the Text on Canvas
                  canvas.add(text);

                  canvas.requestRenderAll()
                }
              }
            })
          })
        },
        scale: 1.5,
        pageImageCompression: 'MEDIUM', // FAST, MEDIUM, SLOW(Helps to control the new PDF file size)
      });
      setPdfInstance(pdf)


    };
    fileReader.readAsArrayBuffer(pdfFile);
  }


  useEffect(() => {


  }, [pdfInstance])

  console.log(pdfInstance?.fabricObjects)

  const addRectangle = () => {
    pdfInstance.setColor('white');
    pdfInstance.setBorderColor('black');
    pdfInstance.enableRectangle();
  }


  const showPdfData = () => {
    pdfInstance.serializePdf(function (string) {
      console.log({ string: JSON.parse(string) })
    })
  }

  const downloadPDF= () =>{
    console.log("downlod")
    pdfInstance.savePdf("output.pdf")
  }

  return (
    <>
      <div>
        <h2>Editing PDF</h2>

        <input type='file' onChange={handleFileUpload} accept=".pdf" />

        <button onClick={addRectangle}>Add Rectangle</button>

        <button onClick={showPdfData}>Show pdf data</button>

        <button onClick={downloadPDF}>Download PDF</button>

        <div id="pdf-container"></div>

      </div>
    </>
  )
}


export default App
