import React from "react";
import "./Banner.css";

const Banner = () => {
  return (
    <div
      id="homeBanner"
      className="carousel slide sd-banner"
      data-bs-ride="carousel"
    >

      
      <div className="carousel-indicators">

        <button
          type="button"
          data-bs-target="#homeBanner"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>

        <button
          type="button"
          data-bs-target="#homeBanner"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>

        <button
          type="button"
          data-bs-target="#homeBanner"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>

      </div>


    
      <div className="carousel-inner">


        <div className="carousel-item active">

          <div className="banner-slide banner-one">

            <div className="banner-content">

              <p className="banner-small-text">
                BIG SAVINGS
              </p>

              <h1>
                Fashion
                <br />
                Deals
              </h1>

              <p className="banner-description">
                Latest styles at amazing prices
              </p>

              <button className="banner-button">
                SHOP NOW
              </button>

            </div>

            <div className="banner-discount">
              <span>UP TO</span>
              <strong>70%</strong>
              <span>OFF</span>
            </div>

          </div>

        </div>


      
        <div className="carousel-item">

          <div className="banner-slide banner-two">

            <div className="banner-content">

              <p className="banner-small-text">
                ELECTRONICS SALE
              </p>

              <h1>
                Smart
                <br />
                Gadgets
              </h1>

              <p className="banner-description">
                Upgrade your everyday technology
              </p>

              <button className="banner-button">
                SHOP NOW
              </button>

            </div>

            <div className="banner-discount">
              <span>FLAT</span>
              <strong>50%</strong>
              <span>OFF</span>
            </div>

          </div>

        </div>


    
        <div className="carousel-item">

          <div className="banner-slide banner-three">

            <div className="banner-content">

              <p className="banner-small-text">
                HOME COLLECTION
              </p>

              <h1>
                Home &
                <br />
                Kitchen
              </h1>

              <p className="banner-description">
                Make your home beautiful
              </p>

              <button className="banner-button">
                SHOP NOW
              </button>

            </div>

            <div className="banner-discount">
              <span>UP TO</span>
              <strong>60%</strong>
              <span>OFF</span>
            </div>

          </div>

        </div>

      </div>


      
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#homeBanner"
        data-bs-slide="prev"
      >
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
        ></span>

        <span className="visually-hidden">
          Previous
        </span>
      </button>


      
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#homeBanner"
        data-bs-slide="next"
      >
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
        ></span>

        <span className="visually-hidden">
          Next
        </span>
      </button>

    </div>
  );
};

export default Banner;