import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { getShowtimeById } from "../../api/showtimeApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ShowtimeDetail.css";

const ShowtimeDetail = () => {
  const { showtimeId } = useParams();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchShowtime = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const data = await getShowtimeById(showtimeId, today);
        setShowtime(data);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    fetchShowtime();
  }, [showtimeId]);

  const toggleSeatSelection = (seat) => {
    if (seat.status === "booked") return;

    setSelectedSeats((prev) =>
      prev.includes(seat.seatInfo.seatNumber)
        ? prev.filter((s) => s !== seat.seatInfo.seatNumber)
        : [...prev, seat.seatInfo.seatNumber]
    );
  };

  const groupedSeats = showtime?.seats?.reduce((acc, seat) => {
    const rowLabel = seat.seatInfo.seatNumber[0];
    if (!acc[rowLabel]) acc[rowLabel] = [];
    acc[rowLabel].push(seat);
    return acc;
  }, {});

  Object.keys(groupedSeats || {}).forEach((key) => {
    groupedSeats[key].sort(
      (a, b) =>
        parseInt(a.seatInfo.seatNumber.slice(1)) -
        parseInt(b.seatInfo.seatNumber.slice(1))
    );
  });

  return (
    <Container className="showtime-container">
      <h1 className="text-center mb-4">Chọn Ghế</h1>

      <div className="screen-container">
        <div className="screen">Màn Hình</div>
      </div>

      <div className="seat-map">
        {groupedSeats &&
          Object.entries(groupedSeats).map(([rowLabel, seats]) => (
            <div key={rowLabel} className="seat-row">
              <div className="row-label">{rowLabel}</div>
              <div className="d-flex">
                {seats.map((seat) => (
                  <div
                    key={seat.seatInfo.seatNumber}
                    className={`seat ${seat.status} ${
                      selectedSeats.includes(seat.seatInfo.seatNumber)
                        ? "selected"
                        : ""
                    } ${seat.seatInfo.type}`}
                    onClick={() => toggleSeatSelection(seat)}
                  >
                    {seat.seatInfo.seatNumber.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="legend-container">
        <div className="legend-item">
          <div className="seat available"></div> Trống
        </div>
        <div className="legend-item">
          <div className="seat booked"></div> Đã đặt
        </div>
        <div className="legend-item">
          <div className="seat selected"></div> Đang chọn
        </div>
        <div className="legend-item">
          <div className="seat VIP"></div> VIP
        </div>
      </div>

      <div className="text-center mt-4">
        <Button variant="success" className="btn-book">
          Đặt vé ({selectedSeats.length} ghế)
        </Button>
      </div>
    </Container>
  );
};

export default ShowtimeDetail;
