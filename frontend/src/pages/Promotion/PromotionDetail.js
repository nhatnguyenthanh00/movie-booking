import React from "react";
import "./promotion.css";
export default function PromotionDetail() {
  return (
    <div className="body pt-5">
      <div className="container">
        <div className="container-promotion-detail">
          <div>
            <h3 className="sub_tit">BÁNH MÌ QUE NÓNG GIÒN</h3>
            <div>
              <img
                src="https://media.lottecinemavn.com/Media/Event/ff450d1e3b454066baffc7bbeabffe46.jpg"
                alt=""
              />
              <div className="event_release">
                <div>
                  Ngon giòn nóng hổi từ lớp vỏ.... đầy đặn đẫm xốt trong lớp
                  nhân, bánh mì que đã sẵn sàng phục vụ quý khách với 03 hương
                  vị:
                </div>
                <div>Sản phẩm có bán lẻ hoặc theo combo bắp nước đi kèm:</div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center m-3">
          <button className="btn btn-dark no-radius btn-search">
            Danh sách
          </button>
        </div>
      </div>
    </div>
  );
}
