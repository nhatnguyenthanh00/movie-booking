import React from "react";
import "./promotion.css";
export default function Promotion() {
  //hoang
  return (
    <>
      <div className="container ">
        <div className="container-promotion">
          <div className="d-flex justify-content-between w-100">
            <h3 className="fw-bold title-main">Promiton</h3>
            <div className="d-flex">
              <input type="text" className="form-control ipt_txt no-radius " />
              <button className="btn btn-dark no-radius btn-search">
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="mt-3 row">
            <div className="pt-3 col-lg-3 col-sm-12 col-md-6">
              <div className="e-list">
                <img
                  src="https://media.lottecinemavn.com/Media/Event/3fdee6202b0e4f7b9370eccfe7370574.jpg"
                  alt=""
                  className="w-100"
                />
                <div className="p-1 text-center">20/02/2025 ~ 30/04/2025</div>
              </div>
            </div>
            <div className="pt-3 col-lg-3 col-sm-12 col-md-6">
              <div className="e-list">
                <img
                  src="https://media.lottecinemavn.com/Media/Event/8ce02beafdc14952bc964d9bb4d9affb.jpg"
                  alt=""
                  className="w-100"
                />
                <div className="p-1 text-center">20/02/2025 ~ 30/04/2025</div>
              </div>
            </div>
            <div className="pt-3 col-lg-3 col-sm-12 col-md-6">
              <div className="e-list">
                <img
                  src="https://media.lottecinemavn.com/Media/Event/8ce02beafdc14952bc964d9bb4d9affb.jpg"
                  alt=""
                  className="w-100"
                />
                <div className="p-1 text-center">20/02/2025 ~ 30/04/2025</div>
              </div>
            </div>
            <div className="pt-3 col-lg-3 col-sm-12 col-md-6">
              <div className="e-list">
                <img
                  src="https://media.lottecinemavn.com/Media/Event/8ce02beafdc14952bc964d9bb4d9affb.jpg"
                  alt=""
                  className="w-100"
                />
                <div className="p-1 text-center">20/02/2025 ~ 30/04/2025</div>
              </div>
            </div>
            <div className="pt-3 col-lg-3 col-sm-12 col-md-6">
              <div className="e-list">
                <img
                  src="https://media.lottecinemavn.com/Media/Event/8ce02beafdc14952bc964d9bb4d9affb.jpg"
                  alt=""
                  className="w-100"
                />
                <div className="p-1 text-center">20/02/2025 ~ 30/04/2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
