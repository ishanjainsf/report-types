import React, {useState, useEffect} from 'react'
import {DataGrid, GridRowsProp, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbar, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector} from "@material-ui/data-grid";
import {colData, rowData} from "../Helper/DataGrid.json"
import { isTSEnumDeclaration } from '@babel/types';
import {createMuiTheme} from '@material-ui/core/styles'
import {makeStyles} from '@material-ui/styles'

function DataGridTable() {

    const [totalA, setTotalA] = useState(0)

    useEffect(() => {
        rowData.map((item) => {
            setTotalA(totalA => totalA + item.tAmount)
        })
    }, [])

    console.log("total AMount", totalA)

    const columns : GridColDef = [
        {field:"bId", headerName:"Booking Id", width: 150},
        {field:"cName", headerName:"Customer Name", width: 150},
        {field:"cEmail", headerName:"Customer Email", width: 150},
        {field:"cIn", headerName:"Check In", width: 150},
        {field:"cOut", headerName:"Check Out", width: 150},
        {field:"src", headerName:"Source", width: 150},
        {field:"cId", headerName:"Customer Identification", width: 150},
        {field:"bStatus", headerName:"Booking Status", width: 150},
        {field:"rooms", headerName:"Rooms", width: 150, type:"number"},
        {field:"rTypes", headerName:"Room Types", width: 150},
        {field:"tAmount", headerName:"Total Amount", width: 150, type:"number"},
        {field:"payMade", headerName:"Payment Made", width: 150},
    ]

    function customCheckbox(theme){
        return{
            '& .MuiCheckbox-root svg':{
                width: 16,
                height: 16,
                backgrounColor:'transparent',
                border: '1px solid #1AB394',
                borderRadius: 2,
            },
            '& .MuiCheckbox-root svg path':{
                display: 'none',
            },
            '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-intermediate) svg':{
                backgrounColor : '#1890ff',
                borderColor: '#1AB394'
            },
            '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after':{
                position:"absolute",
                display:'table',
                border: '2px solid fff',
                borderTop: 0,
                borderLeft:0,
                transform: 'rotate(45deg) translate(-50%, -50%)',
                opacity: 1,
                transition: 'all .2s cubic-bezier(.12, .4, .29, 1.46) .1s',
                content: '""',
                top:'50%',
                left:'39%'
            }
        }
    }

    // const rows : GridRowsProp = [
    //     rowData.map((item, index) => {
    //         return(
    //             {
    //                 id : item.id,
    //                 bId : item.bId,
    //                 cName : item.cName,
    //                 cIn : item.cIn,
    //                 cOut : item.cOut,
    //                 src: item.src,
    //                 cId : item.src,
    //                 bStatus : item.bStatus,
    //                 rooms : item.rooms,
    //                 rTypes :  item.rTypes,
    //                 tAmount : item.tAmount,
    //                 payMade : item.payMade,
    //             }
    //         )
    //     })
    // ]


    function CustomToolbar() {
        return (
            <>
            {/* <div className="hello World">
                Hello World
            </div> */}
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </GridToolbarContainer>
          </>
        );
      }


    return (
        <div className="agGridWrapper">
            Data Grid Table 
            <div className="agGridTableWrapper">
                < 
                    DataGrid
                    rows = {rowData}
                    columns = {columns}
                    className="dataGridTable"
                    checkboxSelection = {true}
                    components = {{
                        Toolbar : CustomToolbar,
                    }}
                    />
            </div>
        </div>
    )
}

export default DataGridTable
