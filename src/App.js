import DataGridTable from "./Components/DataGridTable"; 
import React from 'react'
import {Switch, BrowserRouter as Router, Route} from "react-router-dom";
import AgGridTable from "./Components/AgGridTable";
import ReactTable from "./Components/ReactTable";
import BootstrapTable from "react-bootstrap-table-next";
import BooTable from "./Components/BooTable";
import TestApi from "./Components/TestApi";
import Reports from "./Components/Reports";
import SalesReport from "./Components/SalesReport";
import PaymentsReport from "./Components/PaymentsReport";
import CounterReport from "./Components/CounterReport";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Reports} />
          <Route path="/master" component={AgGridTable} />
          <Route path="/sales" component={SalesReport} />
          <Route path="/react" component={ReactTable} />
          <Route path="/boo" component={BooTable} />
          <Route path="/test" component={TestApi} />
          <Route path="/payments" component={PaymentsReport} />
          <Route path="/counter" component={CounterReport} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
