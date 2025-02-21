const router = require("express").Router();
const Room = require("../models/Room");
const Seat = require("../models/Seat");
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


module.exports = router;