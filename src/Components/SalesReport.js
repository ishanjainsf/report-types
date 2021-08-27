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

function SalesReport() {

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

    const reportType = "Sales Report"

    // filter params for the date filter 
    const filterParams = {
            debounceMs: 500,
            suppressAndOrCondition: true,
            comparator: function(filterLocalDateAtMidnight, cellValue) {
              if (cellValue == null) {
                return 0;
              }
              var dateParts = cellValue.split('-');
              console.log(dateParts)
              var year = Number(dateParts[0]); 
              var month = Number(dateParts[1]) - 1;
              var day = Number(dateParts[2]);
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

    // currency formatter
    function currencyFormatter(data, sign){
        var sansDesc = data.toFixed(2);
        return sign + `${data}`
    }

    // column definitions

    // defining the column headers, etc. 
    const columns = [
        {field:"metric", headerName:"Date", filter:'agDateColumnFilter', filterParams:filterParams, floatingFilterComponentParams: {suppressFilterButton: true} },
        {field:"occupancy", headerName:"Occupany %", aggFunc:"sum", enableValue:true, valueFormatter : params => params.value + "%", filter:"agNumberColumnFilter" },
        {field:"adr", headerName:"ADR (₹)", aggFunc:"sum", enableValue: true, valueFormatter : params => currencyFormatter(params.data.adr, '₹')},
        {field:"revpar", headerName:"RevPAR (₹)", aggFunc:"sum", enableValue:true,valueFormatter : params => currencyFormatter(params.data.revpar, '₹') },
        {field:"net_rooms", headerName:"Net Rooms Sold", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => {return Number(params.value.toFixed(2))} },
        {field:"nc_res_amount", headerName:"NC Res Revenue (₹)", aggFunc:"sum", enableValue:true, valueFormatter : params => currencyFormatter(params.data.nc_res_amount, '₹') },
        {field:"s_amount", headerName:"Net Services Amount (₹)", aggFunc:"sum", enableValue:true, valueFormatter : params => currencyFormatter(params.data.s_amount, '₹') },
        {field:"total_revenue", headerName:"Net Total Revenue (₹)", aggFunc:"sum", enableValue:true, valueFormatter : params => currencyFormatter(params.data.total_revenue, '₹') },
        {field:"net_tax", headerName:"Net Total Tax (₹)", aggFunc:"sum", enableValue:true, valueFormatter : params => currencyFormatter(params.data.net_tax, '₹') },
        {field:"payment_made", headerName:"Payment Made (₹)", aggFunc:"sum", enableValue:true, valueFormatter : params => currencyFormatter(params.data.payment_made, '₹') },
        {field:"c_res_amount", headerName:"Cancellations Revenue (₹)", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.c_res_amount, '₹') },
        {field:"c_res_count", headerName:"Cancellations", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => {return Number(params.value.toFixed(2))} },
        {field:"c_res_tax", headerName:"Cancellations Revenue Tax (₹)", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.c_res_tax, '₹') },
        {field:"nc_res_count", headerName:"NC Res Count", aggFunc:"sum", enableValue:true, valueFormatter : params => {return Number(params.value.toFixed(2))}, hide:true },
        {field:"ooo_occupancy", headerName:"Out of order occupancy", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => {return Number(params.value.toFixed(2))} },
        {field:"ooo_revpar", headerName:"Out of order RevPar (₹)", hide:true, valueFormatter : params => currencyFormatter(params.data.ooo_revpar, '₹')},
        {field:"s_tax", headerName:"Net Services Tax (₹)", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.s_tax, '₹') },
        {field:"taxable_amount", headerName:"Taxable Revenue (₹)", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.taxable_amount, '₹') },
        {field:"texmpt_amount", headerName:"Tax Exempt Amount (₹)", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.texmpt_amount, '₹') },
        {field:"total_rooms", headerName:"Total Rooms", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => {return Number(params.value.toFixed(2))} }
    ]

    // ₹

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
        // handleDataRequest("https://beta.stayflexi.com/api/v2/reports/getReportData/?hotel_id=12354&report_type=salesReport&start_date=2021-01-01&end_date=2021-12-31&date_filter_mode=checkout")
        // .then((res) => setRowsData(res.report_data))
        // .then((res) => console.log(console.log(res)))
        // .then((res) => params.api.applyTransaction({add:res}))
    }


    // settings the grid Option
    const gridOptions = {
        pagination: true,
        // generation of the pinned bottom row data
        onFilterChanged:(params)=>{
            let result = {
                metric:"Total",
                adr: 0,
                c_res_amount:0,
                c_res_count:0,
                c_res_tax:0,
                nc_res_amount:0,
                nc_res_count:0,
                net_rooms:0,
                net_tax:0,
                payment_made:0,
                revpar:0,
                s_amount:0,
                s_tax:0,
                taxable_amount:0,
                texempt_amount:0,
                total_revenue:0,
                total_rooms:0,
                occupancy:0,
            }
            setTimeout(()=>{
                params.api.forEachNodeAfterFilter(i=>{
                    result.adr += i.data.adr
                    result.c_res_amount += i.data.c_res_amount
                    result.c_res_count += i.data.c_res_count
                    result.c_res_tax += i.data.c_res_tax
                    result.nc_res_amount += i.data.nc_res_amount
                    result.nc_res_count += i.data.nc_res_count
                    result.net_rooms += i.data.net_rooms
                    result.net_tax += i.data.net_tax
                    result.payment_made += i.data.payment_made
                    result.revpar += i.data.revpar
                    result.s_amount += i.data.s_amount
                    result.s_tax += i.data.s_tax
                    result.taxable_amount += i.data.taxable_amount
                    result.texempt_amount += i.data.texempt_amount
                    result.total_revenue += i.data.total_revenue
                    result.total_rooms += i.data.total_rooms
                    result.occupancy += i.data.occupancy

                });
                params.api.setPinnedBottomRowData([result]);
            },0)
        },
    }

    // getting the total of pinned row data in case of external filters (in this case date filter)
    function updatePinnedRowonDateChange(){
        let result = [
            {
                metric:"Total",
                adr: 0,
                c_res_amount:0,
                c_res_count:0,
                c_res_tax:0,
                nc_res_amount:0,
                nc_res_count:0,
                net_rooms:0,
                net_tax:0,
                payment_made:0,
                revpar:0,
                s_amount:0,
                s_tax:0,
                taxable_amount:0,
                texempt_amount:0,
                total_revenue:0,
                total_rooms:0,
                occupancy: 0 
            }
        ]
        rowsData.forEach(data => {
           result[0].adr += data.adr
           result[0].c_res_amount += data.c_res_amount
           result[0].c_res_count += data.c_res_count
           result[0].c_res_tax += data.c_res_tax
           result[0].nc_res_amount += data.nc_res_amount
           result[0].nc_res_count += data.nc_res_count
           result[0].net_rooms += data.net_rooms
           result[0].net_tax += data.net_tax
           result[0].payment_made += data.payment_made
           result[0].revpar += data.revpar
           result[0].s_amount += data.s_amount
           result[0].s_tax += data.s_tax
           result[0].taxable_amount += data.taxable_amount
           result[0].texempt_amount += data.texempt_amount
           result[0].total_revenue += data.total_revenue
           result[0].total_rooms += data.total_rooms
           result[0].occupancy += data.occupancy
           
        })
        gridApi.setPinnedBottomRowData(result)
    }
    useEffect(() => {
        rowsData && updatePinnedRowonDateChange()
    })

    // console.log(typeof gridApi.pinnedRowModel.pinnedBottomRows[0].data["adr"])

    // ----- end of the total row pinned data -----

    // Date Picker and setting the properties on date change 
    // Customised Calendar Filter 
    const [display, setDisplay] = useState("none")
    const [dates, setDates] = useState([
        {
            startDate : moment('2021-01-01').format('YYYY-MM-DD'),
            endDate : moment('2021-03-31').format('YYYY-MM-DD'),
            displayStartDate: moment('2021-01-01').format("MMM DD, YYYY"),
            displayEndDate: moment('2021-03-31').format("MMM DD, YYYY")
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
    const [filterDateType, setFilterDateType] = useState("Date")
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

    // calling the api on change of the 
    const calendarData = () => {
        handleDataRequest(`reports/getReportData/?hotel_id=12354&report_type=salesReport&start_date=${dates[0].startDate}&end_date=${dates[0].endDate}`)
        .then((res) => setRowsData(res.report_data))
    }   

    useEffect(() => {
        calendarData()
    }, [dates, filterDateType])
    // console.log(rowsData)

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
            Sales Report
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
                                Date
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
                            // groupIncludeTotalFooter = {true}
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
                    <PDFExportPanel gridApi={gridApi} columnApi={gridColumnApi} report_Type={reportType} startdate={dates[0].displayStartDate} enddate={dates[0].displayEndDate} />
                </div>
            </Modal>
        </div>
    )
}

export default SalesReport
