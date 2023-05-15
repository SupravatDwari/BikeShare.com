import { Col, Row, Divider, DatePicker, Checkbox, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllBikes } from "../redux/actions/bikeActions";
import moment from "moment";
import { bookBike } from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import { useParams } from 'react-router-dom';

import 'aos/dist/aos.css'; // You can also use <link> for styles
const { RangePicker } = DatePicker;
function BookingBike(props) {
  const { bikes } = useSelector((state) => state.bikesReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [bike, setBike] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setdriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { bikeid } = useParams();

  useEffect(() => {
    if (bikes.length === 0) {
      dispatch(getAllBikes());
    } else {
      setBike(bikes.find((o) => o._id === bikeid));
    }
  }, [bikes, bike.rentPerHour, totalAmount]);


  useEffect(() => {
    setTotalAmount(totalHours * bike.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + 30 * totalHours);
    }
  }, [driver, totalHours]);

  function selectTimeSlots(values) {
    setFrom(moment(values[0]).format("MMM DD YYYY HH:mm"));
    setTo(moment(values[1]).format("MMM DD YYYY HH:mm"));

    setTotalHours(values[1].diff(values[0], "hours"));
  }



  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      bike: bike._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };

    dispatch(bookBike(reqObj));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <Row
        justify="center"
        className="d-flex align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Col lg={10} sm={24} xs={24} className='p-3'>
          <img src={bike.image} className="bikeimg2 bs1 w-100" data-aos='flip-left' data-aos-duration='1500' />
        </Col>
        <Col lg={10} sm={24} xs={24} className="text-right">
          <Divider type="horizontal" >
            Bike Info
          </Divider>
          <div style={{ textAlign: "right", fontWeight: "bold" }}>
            <p>{bike.name}</p>
            <p>Rent: Rs {bike.rentPerHour}/hr  </p>
            <p>Fuel Tank : {bike.fuelTank}</p>
            <p>Mileage : {bike.mileage}</p>
          </div>

          <Divider type="horizontal" dashed>
            Select Time Slots
          </Divider>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="MMM DD YYYY HH:mm"
            onChange={selectTimeSlots}
          />
          <br />
          {from && to && (
            <div>
              <p>
                Total Hours : <b>{totalHours}</b>
              </p>
              <p>
                Rent: Rs <b>{bike.rentPerHour}</b>/hr 
              </p>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setdriver(true);
                  } else {
                    setdriver(false);
                  }
                }}
              >
                Driver Required
              </Checkbox>

              <h3>Total Amount : {totalAmount}</h3>

              <StripeCheckout
                shippingAddress
                token={onToken}
                currency='inr'
                amount={totalAmount * 100}
                // stripeKey="pk_test_51MrnpsSEjOieUZgYdmEJyFBoy6sSBgV8dSHDHB3Nd8HTOerqiY0ZX9DtWVJyQgZL1QPyJU5hITOOHaMUqE0Mta1w00ZUNf2EOz"
                stripeKey="pk_test_51MrnpsSEjOieUZgYdmEJyFBoy6sSBgV8dSHDHB3Nd8HTOerqiY0ZX9DtWVJyQgZL1QPyJU5hITOOHaMUqE0Mta1w00ZUNf2EOz"
              >
                <button className="btn1">
                  Book Now
                </button>
              </StripeCheckout>


            </div>
          )}
        </Col>
        {bike.name && (
          <Modal
            visible={showModal}
            closable={false}
            footer={false}
            title="Booked time slots"
          >
            <div className="p-2">
              {bike.bookedTimeSlots.map((slot) => {
                return (
                  <button className="btn1 mt-2">
                    {slot.from} - {slot.to}
                  </button>
                );
              })}

              <div className="text-right mt-5">
                <button
                  className="btn1"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </Modal>
        )}
      </Row>
    </DefaultLayout>
  );
}

export default BookingBike;
