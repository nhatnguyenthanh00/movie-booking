import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { getMovieDetail, addReview } from "../../api/MovieApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieDetail.css";
import { Link } from "react-router-dom";
const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push("★");
      } else {
        stars.push("☆");
      }
    }
    return stars.join("");
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.slice(0, 2) + "*".repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Vui lòng nhập bình luận trước khi gửi đánh giá.");
      return;
    }

    try {
      const reviewData = { rating, comment };
      const newReview = await addReview(movieId, reviewData);
      setReviews([...reviews, newReview]);
      setRating(1);
      setComment("");
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  if (!movie) return <p>Loading...</p>;

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
                  <div className="play-button-overlay">
                    <div className="play-button">
                      <i className="bi bi-play play-icon"></i>
                    </div>
                  </div>
                </div>
              )}

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
              <strong>Rated:</strong> Phim dành cho khán giả{" "}
              {movie.rating === "P"
                ? "mọi lứa tuổi"
                : `từ ${movie.rating.replace("C", "")} tuổi trở lên`}
            </p>
            <p>
              <strong>Nội dung:</strong> {movie.description}
            </p>
            <Link
              to={`/showtime/${movie._id}`}
              className="btn btn-primary fw-bold px-4 py-2 rounded shadow-lg text-white text-decoration-none"
            >
              Đặt vé
            </Link>
          </Col>
        </Row>
      </Container>

      {/* Phần 3: Đánh giá */}
      <Container className="my-5">
        <h3 className="fw-bold mb-4">Đánh giá</h3>

        {/* Form thêm đánh giá */}
        <Form onSubmit={handleSubmitReview} className="mb-5">
          <Form.Group className="mb-3">
            <Form.Label>Đánh giá của bạn (1-5 sao)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bình luận</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Gửi đánh giá
          </Button>
        </Form>

        {/* Hiển thị danh sách đánh giá */}
        {reviews.map((review, index) => (
          <Row className="mb-4 border-bottom" key={index}>
            <Col md={9}>
              <div>
                {/* Hiển thị rating dưới dạng sao */}
                <strong className="mb-2 text-muted">
                  Khách: {renderStars(review.rating)}
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

            <Col md={3}>
              <div className="text-center">
                {/* Che đi phần giữa của email */}
                <div>{maskEmail(review.user.email)}</div>
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </Container>
  );
};

export default MovieDetail;
