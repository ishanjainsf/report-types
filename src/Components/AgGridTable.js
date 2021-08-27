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
    const reportType = "Master Report"


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

    // Currency formatter
    function currencyFormatter(data, symbol){
        var formattedData = data.toFixed(2)
        return symbol + " " + `${formattedData}`
    }

    // column definitions

    // defining the column headers, etc. 
    const columns = [
        // {field:"id",headerName: "Id"},
        {field:"bookingid", headerName:"Booking Id",
        checkboxSelection:true, 
        headerCheckboxSelection: true,
        },
        {field:"customer_name", headerName:"Customer Name",},
        {   field:"checkin", 
            headerName:"Check In", 
            filter:'agDateColumnFilter', 
            floatingFilterComponentParams: {
            suppressFilterButton: true,
            },
        filterParams: filterParams
        },
        {   field:"checkout", headerName:"Check Out", filter:'agDateColumnFilter', 
            floatingFilterComponentParams: {
            suppressFilterButton: true,
            },
            filterParams: filterParams
        },
        {field:"source", headerName:"Source"},
        {field:"identification", headerName:"Customer Identification", hide:true},

        {field:"booking_email", headerName:"Booking Email", hide:true},
        {field:"email", headerName:"User Email", hide:true},
        {field:"actual_checkin", headerName:"Actual Check In", filter:'agDateColumnFilter', filterParams: filterParams, hide:true},
        {field:"actual_checkout", headerName:"Actual Check Out", filter:'agDateColumnFilter', filterParams: filterParams, hide:true},
        {field:"status", headerName:"Booking Status"},
        {field:"rooms", headerName:"Rooms"},
        {field:"roomtypes", headerName:"Room Types", enableValue:true, rowGroup: false},
        {
            field:"total_amount_with_services", headerName:"Total Amount (₹)", enableValue: true, aggFunc:"sum", valueFormatter : params => currencyFormatter(params.data.total_amount_with_services, '₹')   
        },
        {
            field:"payment_made", headerName:"Payment Made (₹)", enableValue: true, aggFunc:"sum", valueFormatter : params => currencyFormatter(params.data.payment_made, '₹')
        },
        {field:"rate_plans", headerName:"Rate Plans", hide:true},

        {
            field: "booking_made_on", headerName: "Booking Made On", filter:'agDateColumnFilter', filterParams: filterParams, hide:true
        },
        {field:"room_ids", headerName:"Room ID(s)", hide:true},
        {field:"pax", headerName:"PAX", hide:true},
        {field:"customer_phone", headerName:"Customer Phone", hide:true},
        {field:"customer_city", headerName:"Customer City", hide:true},
        {field:"customer_zipcode", headerName:"Customer Zipcode", hide:true},
        {field:"customer_state", headerName:"Customer State", hide:true},
        {field:"customer_country", headerName:"Customer Country", hide:true},
        {field:"customer_invoice_id", headerName:"Customer Invoice Id", hide:true},
        {field:"booking_amount", headerName:"Booking Amount (₹)", enableValue:true, aggFunc:"sum", valueFormatter : params => currencyFormatter(params.data.booking_amount, '₹'), hide:true},
        {field:"service_amount", headerName:"Service Amount (₹)", enableValue:true, aggFunc:"sum", hide:true, valueFormatter : params => currencyFormatter(params.data.service_amount, '₹')},



        {
            field:"external_payment", headerName:"External Source Payment", aggFunc:"sum", enableValue:true, hide: true,
            valueFormatter : params => currencyFormatter(params.data.external_payment, '₹')
        },
        {
            field:"external_payment_card", headerName:"External Card Payment", aggFunc:"sum", enableValue:true, hide:true
        },
        {
            field:"refund", headerName:"Refund", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.refund, '₹')
        },
        {
            field:"balance_due", headerName:"Balance Due", aggFunc:"sum",
            valueGetter : params => {
                return '₹' + Number(((params.data.total_amount_with_services) - (params.data.payment_made)).toFixed(2))
            },
            hide: true
        },
        {
            field:"offline_payment", headerName:"Offline Payment", aggFunc:"sum", hide:true,
            valueFormatter : params => currencyFormatter(params.data.offline_payment, '₹')
        },
        {field:"ota_commission", headerName:"OTA Commission", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.ota_commission, '₹') },
        {field:"ota_tax", headerName:"OTA Tax", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.ota_tax, '₹') },
        {field:"ota_net_amount", headerName:"OTA Net Amount", aggFunc:"sum", enableValue:true, hide:true, valueFormatter : params => currencyFormatter(params.data.ota_net_amount, '₹') },
        {field:"special_requests", headerName:"Special Requests", hide:true},
        {
            field:"online_payment", headerName:"Online Payment", aggFunc:"sum", hide:true, valueFormatter : params => currencyFormatter(params.data.online_payment, '₹')
        },
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
                bookingid:"Total",
                total_amount_with_services: 0,
                payment_made:0,
                offline_payment:0,
                refund:0,
                services_amount:0,
                ota_net_amount:0,
                external_payment:0,
                external_payment_card:0,
                rooms: 0,
                online_payment: 0,
            }
            setTimeout(()=>{
                params.api.forEachNodeAfterFilter(i=>{
                    result.total_amount_with_services +=i.data.total_amount_with_services;
                    result.payment_made +=i.data.payment_made;
                    result.offline_payment +=i.data.offline_payment;
                    result.online_payment +=i.data.online_payment;
                    result.refund +=i.data.refund;
                    result.services_amount +=i.data.services_amount;
                    result.ota_net_amount +=i.data.ota_net_amount;
                    result.external_payment +=i.data.external_payment;
                    result.external_payment_card +=i.data.external_payment_card;
                    result.rooms +=i.data.rooms;
                    result.online_payment +=i.data.online_payment;

                });
                params.api.setPinnedBottomRowData([result]);
            },0)
        },
    }

    // getting the total of pinned row data in case of external filters (in this case date filter)
    function updatePinnedRowonDateChange(){
        let result = [
            {
                bookingid:"Total",
                total_amount_with_services: 0,
                payment_made:0,
                offline_payment:0,
                online_payment:0,
                refund:0,
                services_amount:0,
                ota_net_amount:0,
                external_payment:0,
                external_payment_card:0,
                rooms:0,
                online_payment: 0,
            }
        ]
        rowsData.forEach(data => {
           result[0].total_amount_with_services += data.total_amount_with_services
           result[0].payment_made += data.payment_made
           result[0].offline_payment += data.offline_payment
           result[0].online_payment += data.online_payment
           result[0].refund += data.refund
           result[0].services_amount += data.services_amount
           result[0].ota_net_amount += data.ota_net_amount
           result[0].external_payment += data.external_payment
           result[0].external_payment_card += data.external_payment_card
           result[0].rooms += data.rooms
           result[0].online_payment += data.online_payment;


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
        handleDataRequest(`reports/getReportData/?hotel_id=12354&report_type=unifiedBookingReport&start_date=${dates[0].startDate}&end_date=${dates[0].endDate}&date_filter_mode=${filterDateType}`)
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
            Master Report
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
                    <PDFExportPanel gridApi={gridApi} columnApi={gridColumnApi} report_Type={reportType} startdate={dates[0].displayStartDate} enddate = {dates[0].displayEndDate} />
                </div>
            </Modal>
        </div>
    )
}

export default AgGridTable
