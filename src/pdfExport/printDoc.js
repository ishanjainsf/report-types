import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import getDocDefinition from "./docDefinition";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function printDoc(printParams, gridApi, columnApi, report_Type, startdate, enddate) {
  console.log("Exporting to PDF...");
  const docDefinition = getDocDefinition(
    printParams, 
    gridApi, 
    columnApi,
    report_Type,
    startdate,
    enddate
  // }
  );
  pdfMake.createPdf(docDefinition).download();
}

export default printDoc;
