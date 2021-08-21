import axios from 'axios'
import React, {useState, useEffect} from 'react'
import {handleDataRequest} from "../api/index";

function TestApi() {

    const [data, setData] = useState(null)
    const startDate = '2021-01-01'
    const endDate = '2021-12-31'


    const dumpData = () => {
        handleDataRequest(
            "https://beta.stayflexi.com/api/v2/reports/getReportData/?hotel_id=12354&report_type=unifiedBookingReport&start_date=2021-01-01&end_date=2021-12-31"
        ) .then((res) => {
            setData(res)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        dumpData()
    }, [])

    console.log("data", data)

    return (
        <div>
            Hello World
            {data && data.report_data.map((item, idx) => {
                return(
                    item.customer_name
                )
            })}
        </div>
    )
}

export default TestApi
