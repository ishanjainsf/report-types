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
        </div>
    )
}

export default Reports
