const router = require("express").Router();
const Room = require("../models/Room");
const Seat = require("../models/Seat");
const Movie = require("../models/Movie");
router.post("/add-seat/:id", (req, res) => {
  try {
    const roomId = req.params.id;
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let seatData = [];
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        const seatNumber = rows[i] + cols[j];

        seatData.push({
          seatNumber,
          room: roomId,
          type:
            rows[i] >= "D" && rows[i] <= "G" && cols[j] >= 3 && cols[j] <= 8
              ? "vip"
              : "normal",
          status: true,
        });
      }
    }
    const result = Seat.insertMany(seatData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/update-movie-end-date", async (req, res) => {
  try {
    const movies = await Movie.find({ endDate: { $exists: false } });

    for (const movie of movies) {
      if (movie.releaseDate) {
        movie.endDate = new Date(
          movie.releaseDate.getTime() + 2 * 30 * 24 * 60 * 60 * 1000
        ); // Thêm 2 tháng
        await movie.save();
        console.log(`Updated endDate for movie: ${movie.title}`);
      } else {
        console.log(`Skipping movie: ${movie.title}, no releaseDate`);
      }
    }
    res.status(200).json({ message: "Updated endDate for all movies" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/delete-status-seat", async (req, res) => {
  try {
    const result = await Seat.updateMany({}, { $unset: { status: 1 } });

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Không có document nào bị thay đổi. Kiểm tra lại dữ liệu trong DB.",
      });
    }

    res.status(200).json({
      message: "Field 'status' đã bị xóa khỏi tất cả documents.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
});


module.exports = router;
