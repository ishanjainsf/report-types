import React, { useEffect, useState } from 'react';

const totalStyle = { paddingBottom: '15px' };

export default (props) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPayMade, setTotalPayMade] = useState(0);
  const [totalFilteredAmount, setTotalFilteredAmount] = useState(0);
  const [totalFilteredPayMade, setTotalFilteredPayMade] = useState(0);
  const [lengthDisplayedData, setLengthDisplayedData] = useState(0)
  const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);
  const [totalSelectedPayMade, setTotalSelectedPayMade] = useState(0);

  const updateTotals = () => {
    let totalAmount = 0;
    let totalPayMade = 0;
    let filteredAmount = 0;
    let filteredPayMade = 0;
    let selectedAmount = 0;
    let selectedPayMade = 0;

    let offline_payment = 0;
    let online_payment = 0;
    let refund = 0;
    let services_amount = 0;
    let ota_net_amount = 0;
    let external_payment = 0;
    let external_payment_card = 0; 

    props.api.forEachNodeAfterFilter(function (rowNode){
        const filteredData = rowNode.data
        // console.log("filtered Data", filteredData)

        // filtered Data 
        if(filteredData.total_amount_with_services) filteredAmount += filteredData.total_amount_with_services
        if(filteredData.payment_made) filteredPayMade += filteredData.payment_made
        if(filteredData.offline_payment) offline_payment += filteredData.offline_payment
        if(filteredData.online_payment) online_payment += filteredData.online_payment
        if(filteredData.refund) refund += filteredData.refund
        if(filteredData.services_amount) services_amount += filteredData.services_amount
        if(filteredData.ota_net_amount) ota_net_amount += filteredData.ota_net_amount
        if(filteredData.external_payment) external_payment += filteredData.external_payment
        if(filteredData.external_payment_card) external_payment_card += filteredData.external_payment_card

        // if any rows are selected
        if(rowNode.selected && filteredData.total_amount_with_services) selectedAmount += filteredData.total_amount_with_services
        if(rowNode.selected && filteredData.payment_made) selectedPayMade += filteredData.payment_made
      
    })
    // storing the values into the local storage
    localStorage.setItem('total_amount', filteredAmount.toFixed(2))
    localStorage.setItem('payment_made', filteredPayMade.toFixed(2))
    localStorage.setItem('offline_payment', offline_payment.toFixed(2))
    localStorage.setItem('online_payment', online_payment.toFixed(2))
    localStorage.setItem('refund', refund.toFixed(2))
    localStorage.setItem('services_amount', services_amount.toFixed(2))
    localStorage.setItem('ota_net_amount', ota_net_amount.toFixed(2))
    localStorage.setItem('external_payment', external_payment.toFixed(2))
    localStorage.setItem('external_payment_card', external_payment_card.toFixed(2))

    setTotalFilteredAmount(filteredAmount)
    setTotalFilteredPayMade(filteredPayMade)
    setTotalSelectedAmount(selectedAmount)
    setTotalSelectedPayMade(selectedPayMade)
    
    props.api.forEachNode(function (rowNode) {
      const data = rowNode.data;
    //   console.log("data", rowNode)

      if (data.total_amount_with_services) totalAmount += data.total_amount_with_services;
      if (data.payment_made) totalPayMade += data.payment_made;

    });
    setTotalAmount(totalAmount)
    setTotalPayMade(totalPayMade)
  };

  useEffect(() => {
    props.api.addEventListener('modelUpdated', updateTotals);
    return () => props.api.removeEventListener('modelUpdated', updateTotals);
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <span>
        <h2>
          <i className="fa fa-calculator"></i> Custom Stats
        </h2>
        <dl style={{ fontSize: 'large', padding: '30px 40px 10px 30px' }}>
          <dt style={totalStyle}>
            Total Amount: <b>{totalAmount}</b>
          </dt>
          <dt style={totalStyle}>
            Total Pay Made: <b>{totalPayMade}</b>
          </dt>
          <dt style={totalStyle}>
            Total Filtered Amount: <b>{totalFilteredAmount}</b>
          </dt>
          <dt style={totalStyle}>
            Total Filtered Pay Made: <b>{totalFilteredPayMade}</b>
          </dt>
          <dt style={totalStyle}>
            Total Selected Amount: <b>{totalSelectedAmount}</b>
          </dt>
          <dt style={totalStyle}>
            Total Selected Pay Made: <b>{totalSelectedPayMade}</b>
          </dt>
        </dl>
      </span>
    </div>
  );
};