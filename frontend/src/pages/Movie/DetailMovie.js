import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import { getMovieDetail } from "../../api/MovieApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      const data = await getMovieDetail(movieId);
      if (data) {
        setMovie(data.movie);
        setReviews(data.reviews);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  // Hàm để thêm tham số autoplay vào URL trailer
  const getTrailerUrlWithAutoplay = (url) => {
    const urlObj = new URL(url);
    urlObj.searchParams.set("autoplay", "1");
    return urlObj.toString();
  };

  return (
    <Container fluid className="p-0">
      {/* Phần 1: Trailer */}
      <div className="bg-dark text-white py-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              {/* Hiển thị hình ảnh poster nếu trailer chưa được phát */}
              {!showTrailer && (
                <div
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => setShowTrailer(true)}
                >
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "500px", width: "100%" }}
                  />
                  {/* Nút play đơn giản */}
                  <div className="play-button-overlay">
                    <div className="play-button">
                      <i className="bi bi-play play-icon"></i>{" "}
                      {/* Sử dụng className thay vì class */}
                    </div>
                  </div>
                </div>
              )}

              {/* Hiển thị trailer khi người dùng nhấn vào ảnh */}
              {showTrailer && (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={getTrailerUrlWithAutoplay(movie.trailerUrl)}
                    title="trailer"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="rounded shadow"
                  ></iframe>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Phần 2: Thông tin phim */}
      <Container className="my-5">
        <Row>
          <Col md={4} className="text-center">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: "500px" }}
            />
          </Col>
          <Col md={8}>
            <h2 className="fw-bold mb-4">{movie.title}</h2>
            <p>
              <strong>Đạo diễn:</strong> {movie.director?.join(", ")}
            </p>
            <p>
              <strong>Diễn viên:</strong> {movie.casts?.join(", ")}
            </p>
            <p>
              <strong>Thể loại:</strong> {movie.genre?.join(", ")}
            </p>
            <p>
              <strong>Khởi chiếu:</strong>{" "}
              {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Thời lượng:</strong> {movie.duration} phút
            </p>
            <p>
              <strong>Ngôn ngữ:</strong> {movie.language}
            </p>
            <p>
              <strong>Rated:</strong> Phim dành cho khán giả từ{" "}
              <strong>{movie.rating}</strong> tuổi trở lên
            </p>
            <p>
              <strong>Nội dung:</strong> {movie.description}
            </p>
            <div className="d-flex gap-3 mt-4">
              <Button variant="danger" className="fw-bold px-4">
                MUA VÉ
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="my-5">
        <h3 className="fw-bold mb-4">Đánh giá</h3>

        {reviews.map((review, index) => (
          <Row className="mb-4 border-bottom">
            <Col md={9} key={index}>
              <div>
                <strong className="mb-2 text-muted">
                  Đánh giá: {review.rating}/5
                </strong>
                <br />
                <strong>{review.comment}</strong>
                <div className="text-muted">
                  <small>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </Col>

            <Col md={3} key={index}>
              <div className="text-center">
                <div>{review.user.email}</div>
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
};

export default MovieDetail;
