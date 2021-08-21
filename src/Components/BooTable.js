import React from 'react'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import 'bootstrap/dist/css/bootstrap.min.css';
import filterFactory, { textFilter, multiSelectFilter } from 'react-bootstrap-table2-filter';

function BooTable() {

    const selectOptions = {
        0:'IPhone',
        1:"Samsung",
        2:"One Plus",
        3:"Redmi",
        4:"Asus ROG"
    }

    const headerFormatter = (column, colIndex, { sortElement, filterElement }) => {
        return(
            <div style={{display:"flex", flexDirection:"column"}}>
                {column.text}
                {/* {sortElement} */}
                {filterElement}
            </div>
        )
    }

    const data = [
        {id:1, name:"IPhone", price: 1000},
        {id:2, name:"Samsung", price: 2000},
        {id: 3, name: "One Plus", price:3000},
        {id:4, name:"Redmi", price: 4000},
        {id:5, name:"Asus ROG", price: 5000}
    ]
    const columns = [{
    dataField: 'id',
    text: 'Product ID',
    filter: textFilter(),
    headerFormatter : headerFormatter
    }, {
    dataField: 'name',
    text: 'Product Name',
    filter: textFilter(),
    headerFormatter : headerFormatter
    }, {
    dataField: 'price',
    text: 'Product Price',
    sort: true,
    filter: textFilter(),
    headerFormatter : headerFormatter
    }];

    function indication(){
        return(
            "No data present"
        )
    }


    return (
        <div className="bootstrapTableWrapper">
            Bootstrap Table 
            <div className="bootstrapTable">
                <BootstrapTable 
                keyField='id' 
                data={data} 
                columns={ columns } 
                filter={ filterFactory() }
                remote = {{
                    filter: true,
                    pagination: false,
                    sort: false,
                    cellEdit: false
                }}
                striped
                bordered={false}
                noDataIndication = {indication()}
                />
            </div>
            {/* <button className="btn btn-default" onClick={ handleGetCurrentData }>Get Current Display Rows</button> */}
        </div>
    )
}

export default BooTable
