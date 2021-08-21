import moment from "moment"

export default function getDocDefinition(
  printParams,
  agGridApi,
  agGridColumnApi,
  startdate,
  enddate,
  report_Type
) {
  const {
    PDF_HEADER_COLOR,
    PDF_INNER_BORDER_COLOR,
    PDF_OUTER_BORDER_COLOR,
    PDF_ODD_BKG_COLOR,
    PDF_EVEN_BKG_COLOR,
    PDF_HEADER_HEIGHT,
    PDF_ROW_HEIGHT,
    PDF_PAGE_ORITENTATION,
    PDF_WITH_CELL_FORMATTING,
    PDF_WITH_COLUMNS_AS_LINKS,
    PDF_SELECTED_ROWS_ONLY,
    PDF_WITH_HEADER_IMAGE,
    PDF_WITH_FOOTER_PAGE_COUNT,
    PDF_LOGO
  } = printParams;

  return (function() {
    const columnGroupsToExport = getColumnGroupsToExport();

    const columnsToExport = getColumnsToExport();

    const widths = getExportedColumnsWidths(columnsToExport);

    const rowsToExport = getRowsToExport(columnsToExport);

    const body = columnGroupsToExport
      ? [columnGroupsToExport, columnsToExport, ...rowsToExport]
      : [columnsToExport, ...rowsToExport];

    const headerRows = columnGroupsToExport ? 2 : 1;

    const header = PDF_WITH_HEADER_IMAGE
      ? {
          image: "ag-grid-logo",
          width: 150,
          alignment: "center",
          margin: [0, 10, 0, 10]
        }
      : null;

    const footer = PDF_WITH_FOOTER_PAGE_COUNT
      ? function(currentPage, pageCount) {
          return {
            text: currentPage.toString() + " of " + pageCount,
            margin: [20]
          };
        }
      : null;

    const pageMargins = [
      10,
      PDF_WITH_HEADER_IMAGE ? 70 : 20,
      10,
      PDF_WITH_FOOTER_PAGE_COUNT ? 40 : 10
    ];

    const heights = rowIndex =>
      rowIndex < headerRows ? PDF_HEADER_HEIGHT : PDF_ROW_HEIGHT;

    const fillColor = (rowIndex, node, columnIndex) => {
      if (rowIndex < node.table.headerRows) {
        return PDF_HEADER_COLOR;
      }
      // return rowIndex % 2 === 0 ? PDF_ODD_BKG_COLOR : PDF_EVEN_BKG_COLOR;
      return "white";
    };

    const hLineWidth = (i, node) =>
      i === 0 || i === node.table.body.length ? 0 : 0;

    const vLineWidth = (i, node) =>
      i === 0 || i === node.table.widths.length ? 0 : 0;

    const hLineColor = (i, node) =>
      i === 0 || i === node.table.body.length
        ? PDF_OUTER_BORDER_COLOR
        : PDF_INNER_BORDER_COLOR;

    const vLineColor = (i, node) =>
      i === 0 || i === node.table.widths.length
        ? PDF_OUTER_BORDER_COLOR
        : PDF_INNER_BORDER_COLOR;

    const docDefintiion = {
      pageOrientation: PDF_PAGE_ORITENTATION,
      header,
      footer,
      content: [
        {
          stack:[
            {
              // text: `Report Name : Noon Model - ${localStorage.getItem('reportType')}`,
              text: `Report Name: ${report_Type}`,
              margin:[0,10]
            },
            {
              // text: `Report Data Date Range : ${localStorage.getItem('start_date')} - ${localStorage.getItem('end_date')}`,
              text: `Report Data Date Range : ${startdate}-${enddate}`,
              margin:[0,10]
            },            
            {
              text: `Report Printed On : ${moment().format('MMMM Do YYYY, h:mm:ss a')}`,
              margin: [0,10]
            },
          ],
          bold: true,
          fontSize: 14.5,
          margin:[0,25]
        },
        {
          style: "myTable",
          table: {
            headerRows,
            widths,
            body,
            heights
          },
          layout: {
            fillColor,
            hLineWidth,
            vLineWidth,
            hLineColor,
            vLineColor
          }
        },
        // {
        //   stack:[
        //     {
        //       text: "Report Overview : ",
        //       margin: [0,45],
        //       bold: true,
        //       fontSize: 17,
        //     },
        //     {
        //       text: `Total Amount : ${localStorage.getItem("total_amount")}`,
        //       margin:[0,10]
        //     },
        //     {
        //       text: `Total Payment Made : ${localStorage.getItem("payment_made")}`,
        //       margin:[0,10]
        //     },            
        //     {
        //       text: `Total Refund : ${localStorage.getItem("refund")}`,
        //       margin: [0,10]
        //     },
        //     {
        //       text: `Total External Payment : ${localStorage.getItem("external_payment")}`,
        //       margin: [0,10]
        //     },
        //     {
        //       text: `Total External Card Payment : ${localStorage.getItem("external_payment_card")}`,
        //       margin: [0,10]
        //     },
        //   ],
        //   fontSize: 14.5,
        //   margin:[0,25]
        // },
      ],
      images: {
        "ag-grid-logo": PDF_LOGO
      },
      styles: {
        myTable: {
          margin: [0, 0, 0, 0]
        },
        tableHeader: {
          bold: true,
          margin: [0, PDF_HEADER_HEIGHT / 3, 0, 0]
        },
        tableCell: {
          // margin: [0, 15, 0, 0]
        },
        tablePinnedCell: {
          margin: [0, 25],
          bold: true,
          fontSize: 10.5,
        }
      },
      pageMargins
    };

    return docDefintiion;
  })();

  function getColumnGroupsToExport() {
    let displayedColumnGroups = agGridColumnApi.getAllDisplayedColumnGroups();

    let isColumnGrouping = displayedColumnGroups.some(col =>
      col.hasOwnProperty("children")
    );

    if (!isColumnGrouping) {
      return null;
    }

    let columnGroupsToExport = [];

    displayedColumnGroups.forEach(colGroup => {
      let isColSpanning = colGroup.children.length > 1;
      let numberOfEmptyHeaderCellsToAdd = 0;

      if (isColSpanning) {
        let headerCell = createHeaderCell(colGroup);
        columnGroupsToExport.push(headerCell);
        // subtract 1 as the column group counts as a header
        numberOfEmptyHeaderCellsToAdd--;
      }

      // add an empty header cell now for every column being spanned
      colGroup.displayedChildren.forEach(childCol => {
        let pdfExportOptions = getPdfExportOptions(childCol.getColId());
        if (!pdfExportOptions || !pdfExportOptions.skipColumn) {
          numberOfEmptyHeaderCellsToAdd++;
        }
      });

      for (let i = 0; i < numberOfEmptyHeaderCellsToAdd; i++) {
        columnGroupsToExport.push({});
      }
    });

    return columnGroupsToExport;
  }

  function getColumnsToExport() {
    let columnsToExport = [];

    agGridColumnApi.getAllDisplayedColumns().forEach(col => {
      let pdfExportOptions = getPdfExportOptions(col.getColId());
      if (pdfExportOptions && pdfExportOptions.skipColumn) {
        return;
      }
      let headerCell = createHeaderCell(col);
      columnsToExport.push(headerCell);
    });

    return columnsToExport;
  }

  function getRowsToExport(columnsToExport) {
    let rowsToExport = [];

    agGridApi.forEachNodeAfterFilterAndSort(node => {
      if (PDF_SELECTED_ROWS_ONLY && !node.isSelected()) {
        return;
      }
      let rowToExport = columnsToExport.map(({ colId }) => {
        let cellValue = agGridApi.getValue(colId, node);
        let tableCell = createTableCell(cellValue, colId);
        return tableCell;
      });
      rowsToExport.push(rowToExport);
    });

    let pinnedRowToExport = columnsToExport.map(({colId}) => {
      let cellValue = typeof agGridApi.pinnedRowModel.pinnedBottomRows[0].data[colId] === "number" ? agGridApi.pinnedRowModel.pinnedBottomRows[0].data[colId].toFixed(2) : agGridApi.pinnedRowModel.pinnedBottomRows[0].data[colId]
      let tablePinnedCell = createTablePinnedCell(cellValue, colId);
      return tablePinnedCell
  })
  rowsToExport.push(pinnedRowToExport);

    return rowsToExport;
  }

  function getExportedColumnsWidths(columnsToExport) {
    return columnsToExport.map(() => 100 / columnsToExport.length + "%");
    // return columnsToExport.map(() => 20 + "%");
  }

  function createHeaderCell(col) {
    let headerCell = {};

    let isColGroup = col.hasOwnProperty("children");

    if (isColGroup) {
      headerCell.text = col.originalColumnGroup.colGroupDef.headerName;
      headerCell.colSpan = col.children.length;
      headerCell.colId = col.groupId;
    } else {
      let headerName = col.colDef.headerName;

      if (col.sort) {
        headerName += ` (${col.sort})`;
      }
      if (col.filterActive) {
        headerName += ` [FILTERING]`;
      }

      headerCell.text = headerName;
      headerCell.colId = col.getColId();
    }

    headerCell["style"] = "tableHeader";

    return headerCell;
  }

  function createTableCell(cellValue, colId) {
    const tableCell = {
      text: cellValue !== undefined ? cellValue : "",
      style: "tableCell"
    };

    const tablePinnedCell = {
      text: cellValue !== undefined ? cellValue : "",
      style: "tablePinnedCell"
    };

    const pdfExportOptions = getPdfExportOptions(colId);

    if (pdfExportOptions) {
      const { styles, createURL } = pdfExportOptions;

      if (PDF_WITH_CELL_FORMATTING && styles) {
        Object.entries(styles).forEach(
          ([key, value]) => (tableCell[key] = value)
        );
      }

      if (PDF_WITH_COLUMNS_AS_LINKS && createURL) {
        tableCell["link"] = createURL(cellValue);
        tableCell["color"] = "blue";
        tableCell["decoration"] = "underline";

      }
    }

    return tableCell;
  }

  function createTablePinnedCell(cellValue, colId) {

    const tablePinnedCell = {
      text: cellValue !== undefined ? cellValue : "",
      style: "tablePinnedCell"
    };

    const pdfExportOptions = getPdfExportOptions(colId);

    if (pdfExportOptions) {
      const { styles, createURL } = pdfExportOptions;

      if (PDF_WITH_CELL_FORMATTING && styles) {
        Object.entries(styles).forEach(
          ([key, value]) => (tablePinnedCell[key] = value)
        );
      }

      if (PDF_WITH_COLUMNS_AS_LINKS && createURL) {
        tablePinnedCell["link"] = createURL(cellValue);
        tablePinnedCell["color"] = "blue";
        tablePinnedCell["decoration"] = "underline";

      }
    }

    return tablePinnedCell;
  }

  function getPdfExportOptions(colId) {
    let col = agGridColumnApi.getColumn(colId);
    return col.colDef.pdfExportOptions;
  }
}
