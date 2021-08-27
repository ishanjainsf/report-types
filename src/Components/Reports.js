import React from 'react'
import {Link} from "react-router-dom"

function Reports() {
    return (
        <div style={{display:"flex", flexDirection:"column", textAlign:"center", marginTop:"25px"}}>
            <Link to="/master">
                <div className="masterReport" 
                onClick={() => localStorage.setItem("reportType", "Master Report")}>
                    Master Report
                </div>
            </Link>
            <Link to="/sales">
                <div className="salesReport"
                onClick = {() => localStorage.setItem("reportType", "Sales Report")}
                >
                    Sales Report
                </div>
            </Link>
            <Link to="/payments">
                <div className="paymentsReport"
                onClick = {() => localStorage.setItem("reportType", "Payments Report")}
                >
                    Payments Report
                </div>
            </Link>
            <Link to="/counter">
                <div className="counterReport"
                onClick = {() => localStorage.setItem("reportType", "Counter Report")}
                >
                    Counter Report
                </div>
            </Link>
            <Link to="/inventory">
                <div className="inventoryReport"
                onClick = {() => localStorage.setItem("reportType", "Inventory Report")}
                >
                    Inventory Report
                </div>
            </Link>
            <Link to="/roomRevenue">
                <div className="roomRevenueReport"
                onClick = {() => localStorage.setItem("reportType", "Room Revenue Report")}
                >
                    Room Revenue Report
                </div>
            </Link>
            <Link to="/taxReport">
                <div className="taxReport"
                onClick = {() => localStorage.setItem("reportType", "Tax Report")}
                >
                    Tax Report
                </div>
            </Link>
            <Link to="/roomBookings">
                <div className="roomBookingsReport"
                onClick = {() => localStorage.setItem("reportType", "Room Bookings Report")}
                >
                    Room Bookings Report
                </div>
            </Link>
            <Link to="/occupancy">
                <div className="occupancy"
                onClick = {() => localStorage.setItem("reportType", "Occupancy Report")}
                >
                    Occupancy Report
                </div>
            </Link>
            <Link to="/channelManager">
                <div className="channelManagerReport"
                onClick = {() => localStorage.setItem("reportType", "Channel Manager Report")}
                >
                    Channel Manager Report
                </div>
            </Link>
            <Link to="/bookingEngine">
                <div className="bookingEngineReport"
                onClick = {() => localStorage.setItem("reportType", "Booking Engine Report")}
                >
                    Booking Engine Report
                </div>
            </Link>
            <Link to="/customer">
                <div className="customerReport"
                onClick = {() => localStorage.setItem("reportType", "Customer Report")}
                >
                    Customer Report
                </div>
            </Link>
            <Link to="/flexCollect">
                <div className="flexCollectReport"
                onClick = {() => localStorage.setItem("reportType", "Flex Collect Report")}
                >
                    Flex Collect Report
                </div>
            </Link>
            <Link to="/travelAgent">
                <div className="travelAgentReport"
                onClick = {() => localStorage.setItem("reportType", "Travel Agent Report")}
                >
                    Travel Agent Report
                </div>
            </Link>
            <Link to="/pos">
                <div className="posReport"
                onClick = {() => localStorage.setItem("reportType", "POS Report")}
                >
                    POS Report
                </div>
            </Link>
            <Link to="/posDetail">
                <div className="posDetailReport"
                onClick = {() => localStorage.setItem("reportType", "POS Detail Report")}
                >
                    POS Detail Report
                </div>
            </Link>
            <Link to="/services">
                <div className="servicesReport"
                onClick = {() => localStorage.setItem("reportType", "Servicesl Report")}
                >
                    Services Report
                </div>
            </Link>
            <Link to="/roomRevenueSource">
                <div className="roomRevenueReportSource"
                onClick = {() => localStorage.setItem("reportType", "Room Revenue Report Source")}
                >
                    Room Revenue Report Source
                </div>
            </Link>
            <Link to="/flashManager">
                <div className="flashManagerReport"
                onClick = {() => localStorage.setItem("reportType", "Flash Manager Report")}
                >
                    Flash Manager Report
                </div>
            </Link>
            <Link to="/audit">
                <div className="auditReport"
                onClick = {() => localStorage.setItem("reportType", "Audit Report")}
                >
                    Audit Report
                </div>
            </Link>

        </div>
    )
}

export default Reports
