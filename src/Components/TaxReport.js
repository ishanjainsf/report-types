import React, {useState, useEffect} from 'react'
import {AgGridReact} from 'ag-grid-react'
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css"
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import {colData} from "../Helper/DataGrid.json"
import * as BsIcons from "react-icons/bs";
import PDFExportPanel from "../pdfExport/PDFExportPanel.js";
import 'ag-grid-enterprise';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker, DateRange } from 'react-date-range';
import moment from 'moment';
import flatpickr from 'flatpickr';
import CustomDateComponent from "./customDateComponent.js"
import CustomStatsToolPanel from './customStatsToolPanel.jsx';
import { ca } from 'date-fns/locale';
import {handleDataRequest} from "../api/index"
import axios from 'axios';
import CustomPinnedRowRenderer from "./customPinnedRowRenderer";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function AgGridTable() {

    // defining variables and setting the state
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [selectedRowsLength, setSelectedRowsLength] = useState(0);
    const [filterCount, setFilterCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState(null)
    const [rowsData, setRowsData] = useState(null)
    // defining modal variables 
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const reportType = "Tax Report"


    // filter params for the date filter 
    const filterParams = {
            debounceMs: 500,
            suppressAndOrCondition: true,
            comparator: function(filterLocalDateAtMidnight, cellValue) {
              if (cellValue == null) {
                return 0;
              }
              var dateParts = cellValue.split(' ');
              const modifiedDate = dateParts[0] + " " + dateParts[1] + " " + dateParts[2] + " " + dateParts[3]
              const formattedDate = moment(`${modifiedDate}`).format("DD-MM-YYYY")
              const formattedDateParts = formattedDate.split('-')
              var year = Number(formattedDateParts[2]);
              var month = Number(formattedDateParts[1]) - 1;
              var day = Number(formattedDateParts[0]);
              var cellDate = new Date(year, month, day);
    
              if (cellDate < filterLocalDateAtMidnight) {
                return -1;
              } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
              } else {
                return 0;
              }
            },
    }

    // column definitions

    // defining the column headers, etc. 
    const columns = [
        // {field:"id",headerName: "Id"},
        {field:"booking_id", headerName:"Booking Id",
        checkboxSelection:true, 
        headerCheckboxSelection: true,
        },
        {field:"date", headerName:"Date", filter:"agDateColumnFilter", filterParams: filterParams},
        {field:"CGST", headerName:"CGST (₹)", aggFunc:"sum", valueFormatter : (params) => {return params.value.toFixed(2)}, hide:true},
        {field:"SGST", headerName:"SGST (₹)", aggFunc:"sum", valueFormatter : (params) => {return params.value.toFixed(2)}, hide:true},
        {field:"per_day_amount", headerName:"Per Day Amount (₹)", aggFunc:"sum"},
        {field:"per_day_taxes", headerName:"Per Day Tax (₹)", aggFunc:"sum"},
        {field:"GST", headerName:"GST (₹)", aggFunc:"sum"},

        {field:"booking_amount", headerName:"Booking Amount (₹)", aggFunc:"sum", hide:true},
        {field:"booking_status", headerName:"Booking Status", hide:true},
        {field:"booking_tax", headerName:"Booking Tax (₹)", aggFunc:"sum", hide:true},
        {field:"service_amount", headerName:"Service Amount (₹)", aggFunc:"sum", hide:true},
        {field:"service_taxes", headerName:"Service Taxes (₹)", aggFunc:"sum", hide:true},
        {field:"total_tax", headerName:"Total Tax (₹)", aggFunc:"sum", hide:true},
    ]

    // default column properties
    const defaultColDefs = {
        sortable: true, //sort the table
        filter: true, // returning data based on the condition
        floatingFilter: true, // getting the filter below the columns
        tooltipField:"name",
        filter:"agMultiColumnFilter", // setting the multi column filter for the table
        display : "subMenu", // how the text filter and the set filter will look like
        components : {
            agDateInput: CustomDateComponent,
        },
        resizable: true,
    }

    // assigning the data to the grid api and calling the external API
    // on grid ready function
    const onGridReady = (params) => {
        setGridApi(params.api)
        setGridColumnApi(params.columnApi);
        // handleDataRequest("https://beta.stayflexi.com/api/v2/reports/getReportData/?hotel_id=12354&report_type=unifiedBookingReport&start_date=2021-01-01&end_date=2021-12-31&date_filter_mode=checkout")
        // .then((res) => setRowsData(res.report_data))
        // // .then((res) => console.log(console.log(res)))
        // .then((res) => params.api.applyTransaction({add:res}))
    }

    // settings the grid Option
    const gridOptions = {
        pagination: true,
        // generation of the pinned bottom row data
        onFilterChanged:(params)=>{
            let result = {
                booking_id:"Total",
                GST: 0,
                per_day_amount: 0,
                per_day_taxes: 0,
                service_amount: 0,
                service_taxes: 0
            }
            setTimeout(()=>{
                params.api.forEachNodeAfterFilter(i=>{
                    result.GST +=i.data.GST;
                    result.per_day_amount +=i.data.per_day_amount;
                    result.per_day_taxes +=i.data.per_day_taxes;
                    result.service_amount +=i.data.service_amount;
                    result.service_taxes +=i.data.service_taxes;
                });
                params.api.setPinnedBottomRowData([result]);
            },0)
        },
    }

    // getting the total of pinned row data in case of external filters (in this case date filter)
    function updatePinnedRowonDateChange(){
        let result = [
            {
                booking_id:"Total",
                CGST: 0,
                SGST: 0,
                booking_amount: 0,
                booking_tax: 0,
                pos_amount: 0,
                pos_tax: 0,
                service_amount: 0,
                service_tax:0,
                total_tax:0
            }
        ]
        rowsData.forEach(data => {
            result[0].CGST += data.CGST;
            result[0].SGST += data.SGST; 
            result[0].booking_amount += data.booking_amount;
            result[0].booking_tax += data.booking_tax;
            result[0].pos_amount += data.pos_amount;
            result[0].pos_tax += data.pos_tax;
            result[0].service_amount += data.service_amount;
            result[0].service_tax += data.service_tax;
            result[0].total_tax +=  data.total_tax;
        })
        gridApi.setPinnedBottomRowData(result)
    }
    useEffect(() => {
        rowsData && updatePinnedRowonDateChange()
    })

    console.log(rowsData)
    // ----- end of the total row pinned data -----

    // Date Picker and setting the properties on date change 
    // Customised Calendar Filter 
    const [display, setDisplay] = useState("none")
    const [dates, setDates] = useState([
        {
            startDate : moment('2021-01-01').format('YYYY-MM-DD'),
            endDate : moment('2021-12-31').format('YYYY-MM-DD'),
            displayStartDate: moment('2021-01-01').format("MMM DD, YYYY"),
            displayEndDate: moment('2021-12-31').format("MMM DD, YYYY")
        }
    ])
    const [datePicker, setDatePicker] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection'
        }
    ])

    const selectionRange = {
        startDate : new Date(),
        endDate: new Date(),
        key: 'selection',
    }

    // different date type fiters eg : checkin date, check out date, etc.
    const [filterDateType, setFilterDateType] = useState("staythrough")
    const onChangeDateFilter = (filterType) => {
        console.log("date filter type", filterType)
        setFilterDateType(filterType)
    } 

    // Date Filter using the calendar
    const updateDate = () => {
        setDates([
            {
                ...dates,
                startDate : moment(datePicker[0].startDate).format('YYYY-MM-DD'),
                displayStartDate : moment(datePicker[0].startDate).format('MMM DD, YYYY'),
                endDate : moment(datePicker[0].endDate).format('YYYY-MM-DD'),
                displayEndDate : moment(datePicker[0].endDate).format('MMM DD, YYYY')
            }
        ])
        setDisplay("none")
    }

    // setting the display dates into the local storage for pdf make 
    useEffect(() => {
        localStorage.setItem('start_date', dates[0].displayStartDate ? dates[0].displayStartDate : moment().format("MMM DD, YYYY"))
        localStorage.setItem('end_date', dates[0].displayEndDate ? dates[0].displayEndDate : moment().format("MMM DD, YYYY"))
    }, [dates, filterDateType])

    // calling the api 
    const calendarData = () => {
        handleDataRequest(`reports/getReportData/?hotel_id=12354&report_type=taxReport&start_date=${dates[0].startDate}&end_date=${dates[0].endDate}&date_filter_mode=${filterDateType}`)
        .then((res) => setRowsData(res.report_data))
    }   

    useEffect(() => {
        calendarData()
    }, [dates, filterDateType])



    // calling the grid api and then exporting the data into the csv format
    const onExportClick = () => {
      selectedRowsLength === 0 ? gridApi.exportDataAsCsv() : gridApi.exportDataAsCsv({onlySelected:true})

    }

    const getDownloadType = (dType) => {
        console.log("download type", dType)
        dType === "1" && onExportClick();
        dType === "2" && onOpenModal();
    }

    const rowSelectionType = "multiple"

    // on selection of a row get its data
    const onSelectionChanged = (event) => {
        setSelectedRowsLength(event.api.getSelectedRows().length);
        setSelectedRows(event.api.getSelectedRows())
        // console.log("Selected rows length", event.api.getSelectedRows().length)
    }

    // dynamically change the page size
    const onPaginationChange = (pageSize) => {
        gridApi.paginationSetPageSize(pageSize)
        console.log("")
    }

    // quick search
    const onFilterTextChange = (event) => {
        // console.log(event.target.value)
        setFilterCount(prevCount => prevCount + 1)
        // console.log("filterCount", filterCount)
        gridApi.setQuickFilter(event.target.value)
    }


    return (
        <div className="agGridWrapr">
            Tax Report
            <div className="agGridTableWrapper">
                <div className="headerOptions">
                    <div className="searchFunctionality">
                        <input className="searchInp" type="search" onChange={onFilterTextChange} placeholder="Search..." />
                    </div>
                    <div className="paginationWrapper">
                        <select className="paginationSelection" onChange={(e) => onPaginationChange(e.target.value)}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="datePickerWrapper">
                        <div className="startEndDate" onClick={() => setDisplay("block")}>
                            <div className="startDate">
                                {dates[0].startDate ? dates[0].displayStartDate  : "Start Date"}
                            </div>
                            <div className="hyphen">
                                -
                            </div>
                            <div className="endDate">
                                {dates[0].endDate ? dates[0].displayEndDate  : "End Date"}
                            </div>
                        </div>
                        <div className="dateRangePicker" style={{display:display}}>
                            <DateRange
                            className="datePick"
                            editableDateInputs = {false} 
                            ranges={[selectionRange]}
                            onChange = {item => setDatePicker([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={datePicker}
                            startDatePlaceholder = "Start Date"
                            endDatePlaceholder = "End Date"
                            showDateDisplay = {true}
                            />
                            <div className="setDateWrapper">
                                <button className="setDateBtn" onClick={() => {updateDate()}}>
                                    Set Range
                                </button>
                                <button className="closeBtn" onClick={() => setDisplay("none")}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="dateFilterType">
                        <select className="dateFilterWrapper" onChange={(e) => {onChangeDateFilter(e.target.value)}}>
                            <option value="staythrough" selected>
                                Stay Through
                            </option>
                            <option value="checkin">
                                Checkin Date
                            </option>
                            <option value="checkout">
                                Checkout Date
                            </option>
                            <option value="booking_made_on">
                                Booking Made Date
                            </option>
                        </select>
                    </div>
                    <div className="exportWrapper">
                        {/* <BsIcons.BsDownload size="17" color="black" /> */}
                        <select value="0" className="exportOptionsWrapper" onChange={(e) => getDownloadType(e.target.value)}>
                            <option value="0" selected>Export As...</option>
                            <option value="1">
                                Export as CSV
                            </option>
                            <option value="2">
                                Export as PDF
                            </option>
                        </select>
                    </div>
                </div>
                <div className="agTable">
                    <div className="ag-theme-alpine">
                        <AgGridReact
                            className = "agGridTable"
                            rowData={rowsData}
                            onGridReady = {onGridReady}
                            columnDefs = {columns}
                            defaultColDef = {defaultColDefs}
                            enableBrowserTooltips = {true}
                            rowSelection = {rowSelectionType}
                            onSelectionChanged = {onSelectionChanged}
                            rowMultiSelectWithClick = {true}
                            paginationPageSize = {10}
                            alwaysShowBothConditions = {true}
                            groupIncludeTotalFooter = {true}
                            sideBar = {{
                                toolPanels:[
                                    {
                                        id: 'columns',
                                        labelDefault: 'Columns',
                                        labelKey: 'columns',
                                        iconKey: 'columns',
                                        toolPanel: 'agColumnsToolPanel',
                                    },
                                    // {
                                    //     id: 'filters',
                                    //     labelDefault: 'Filters',
                                    //     labelKey: 'filters',
                                    //     iconKey: 'filter',
                                    //     toolPanel: 'agFiltersToolPanel',
                                    // },
                                    {
                                        id: 'customStats',
                                        labelDefault: 'Custom Stats',
                                        // labelKey: 'customStats',
                                        iconKey: 'stats',
                                        toolPanel: 'customStatsToolPanel',
                                    },
                                ],
                                defaultToolPanel: 'none'
                            }}
                            groupMultiAutoColumn = {true}
                            suppressAggFuncInHeader = {true}
                            // groupRowAggNodes = {getTotalValue}
                            // suppressAggFilteredOnly = {true}
                            // getRowNodeId= {getRowNodeId}
                            statusBar = {{
                                statusPanels: [
                                    {
                                    statusPanel: 'agTotalAndFilteredRowCountComponent',
                                    align: 'left',
                                    },
                                    {
                                    statusPanel: 'agTotalRowCountComponent',
                                    align: 'center',
                                    },
                                    { statusPanel: 'agFilteredRowCountComponent' },
                                    { statusPanel: 'agSelectedRowCountComponent' },
                                    { statusPanel: 'agAggregationComponent' },
                                ],
                            }}
                            frameworkComponents={{
                                customStatsToolPanel: CustomStatsToolPanel
                            }}
                            gridOptions = {gridOptions}

                        />
                    </div>
                </div>
            </div>
            <Modal classNames={{ overlay: 'customOverlay', modal: 'customModal'}} open={open} onClose={onCloseModal} center>
                <div className="pdfExportWrapper">
                    <PDFExportPanel gridApi={gridApi} columnApi={gridColumnApi} report_Type={reportType} startdate={dates[0].displayStartDate} enddate = {dates[0].displayEndDate} />
                </div>
            </Modal>
        </div>
    )
}

export default AgGridTable
