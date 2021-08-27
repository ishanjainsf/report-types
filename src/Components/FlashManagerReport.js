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

function FlashManagerReport() {

    const currentDate = moment().format("ddd, DD MMM")
    const currentTime = moment().format("MMMM DD, YYYY HH:MM:SS")
    const hotelName = "Noon Model"
    const hotelAddress = "Bangalore, Karnataka, India 560076"

    // function getReportData(){
    //     handleDataRequest('reports/getReportData/?hotel_id=12570&report_type=getFlashManagerData&date=2021-08-25&is_summary_only=true')
    //     .then((res) => console.log(res))
    //     .catch((err) => console.log(err))
    // }

    // useEffect(() => {
    //     getReportData()
    // })

    return (
        <div className="flashManagerReportWrapper">
            <div className="flashManagerHeader">
                Flash Manager Report
            </div>
            <div className="reportGeneralInfo">
                <div className="leftHeading">
                    <div className="currentDate"> Flash Manager Report - {currentDate} </div>
                    <div className="currentTime"> Report Printed On: {currentTime} </div>
                </div>
                <div className="rightHeading">
                    <div className="hotelName"> {hotelName} </div>
                    <div className="hotelAddress"> {hotelAddress} </div>
                </div>
            </div>
            <div className="reportsSection">
                <div className="reportHeading">
                    Property Report
                </div>
                <div className="reportSummary">
                    <div className="reportHeaders">
                        {/* <table> */}
                            <div className="reportTable">
                                <div className="headers">
                                    {/* <tr> */}
                                       <div className="headerNames"> 
                                           Metric 
                                        </div>
                                       <div> Today </div>
                                       <div> Month To Date (MTD) </div>
                                       <div> Year To Date (YTD) </div>

                                    {/* </tr> */}
                                </div>
                                <div className="reportData">
                                        <div>Room Solid</div>
                                        <div>2</div>
                                        <div>5</div>
                                        <div>18</div>
                                </div>
                                <div>
                                    <tr>
                                        <td>Occupancy</td>
                                        <td>13.0%</td>
                                        <td>1.0%</td>
                                        <td>1.0%</td>
                                    </tr>
                                </div>
                                <div>
                                    <tr>
                                        <td>ADR-Average Daily Rate</td>
                                        <td>Rs. 3000.0</td>
                                        <td>Rs. 3000.0</td>
                                        <td>Rs. 3045.63</td>
                                    </tr>
                                </div>
                                <div>
                                    <tr>
                                        <td>RevPAR-Revenue Per Available Room</td>
                                        <td>Rs.400.0</td>
                                        <td>Rs.38.46</td>
                                        <td>Rs.15.36</td>
                                    </tr>
                                </div>
                            </div>
                        {/* </table> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlashManagerReport
