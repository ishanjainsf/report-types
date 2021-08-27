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
import InventoryReport from "./Components/InventoryReport";
import RoomRevenueReport from "./Components/RoomRevenueReport";
import TaxReport from "./Components/TaxReport";
import RoomBookingsReport from "./Components/RoomBookingsReport";
import OccupancyReport from "./Components/OccupancyReport";
import ChannelManagerReport from "./Components/ChannelManagerReport";
import BookingEngineReport from "./Components/BookingEngineReport";
import CustomerReport from "./Components/CustomerReport";
import FlexCollectReport from "./Components/FlexCollectReport";
import TravelAgentReport from "./Components/TravelAgentReport";
import POSReport from "./Components/POSReport";
import POSDetailReport from "./Components/POSDetailReport";
import ServicesReport from "./Components/ServicesReport";
import RoomRevenueReportSource from "./Components/RoomRevenueReportSource";
import FlashManagerReport from "./Components/FlashManagerReport";
import AuditReport from "./Components/AuditReport";

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
          <Route path="/inventory" component={InventoryReport} />
          <Route path="/roomRevenue" component={RoomRevenueReport} />
          <Route path="/taxReport" component={TaxReport} />
          <Route path="/roomBookings" component={RoomBookingsReport} />
          <Route path="/occupancy" component={OccupancyReport} />
          <Route path="/channelManager" component={ChannelManagerReport} />
          <Route path="/bookingEngine" component={BookingEngineReport} />
          <Route path="/customer" component={CustomerReport} />
          <Route path="/flexCollect" component={FlexCollectReport} />
          <Route path="/travelAgent" component={TravelAgentReport} />
          <Route path="/pos" component={POSReport} />
          <Route path="/posDetail" component={POSDetailReport} />
          <Route path="/services" component={ServicesReport} />
          <Route path="/roomRevenueSource" component={RoomRevenueReportSource} />
          <Route path="/flashManager" component={FlashManagerReport} />
          <Route path="/audit" component={AuditReport} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
