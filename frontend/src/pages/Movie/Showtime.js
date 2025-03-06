import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { getShowtimeByDay } from "../../api/showtimeApi";
import "bootstrap/dist/css/bootstrap.min.css";

const Showtime = () => {
  const { movieId } = useParams();
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const data = await getShowtimeByDay(movieId, selectedDate);
        setShowtimes(data);
      } catch (error) {
        console.error("Lỗi khi lấy suất chiếu:", error);
        setShowtimes([]);
      }
    };
    fetchShowtimes();
  }, [movieId, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Container className="my-5">
      <h1 className="fw-bold mb-2">Lịch chiếu</h1>
      {showtimes.length > 0 && (
        <h2 className="mb-4 text-primary">
          {showtimes[0].movie?.title || "Không có thông tin phim"}
        </h2>
      )}
      <Row className="mb-4">
        <Col md={4}>
          <label htmlFor="date" className="form-label">
            Chọn ngày:
          </label>
          <input
            type="date"
            id="date"
            className="form-control"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </Col>
      </Row>
      {showtimes.length > 0 ? (
        showtimes.map((showtime) => (
          <Row key={showtime._id} className="mb-3 border-bottom pb-3">
            <Col md={8}>
              <p className="fs-5">
                <strong>Thời gian:</strong>{" "}
                {new Date(showtime.startTime).toLocaleTimeString()} -{" "}
                {new Date(showtime.endTime).toLocaleTimeString()}
              </p>

              <p className="fs-5">
                <strong>Phòng:</strong>{" "}
                {showtime.room?.name || "Không có thông tin phòng"}
              </p>

              <p className="fs-5">
                <strong>Loại:</strong> {showtime.type}
              </p>

              <p className="fs-5">
                <strong>Giá vé:</strong>{" "}
                {showtime.pricing?.normal || "Không có thông tin giá"} VNĐ
              </p>

              <p className="fs-5">
                <strong>Ghế:</strong> {showtime.seats?.length || 0} / 100 ghế
              </p>
            </Col>

            <Col md={4} className="text-end d-flex align-items-center">
              <Button variant="danger" className="fw-bold px-4 py-2">
                Chọn ghế
              </Button>
            </Col>
          </Row>
        ))
      ) : (
        <p>Không có suất chiếu nào trong ngày này.</p>
      )}
    </Container>
  );
};

export default Showtime;
