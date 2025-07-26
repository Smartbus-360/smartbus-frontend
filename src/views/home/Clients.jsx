import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import client1 from "../../assets/img/institute5.png";
import client2 from "../../assets/img/institute.jpg";
import client3 from "../../assets/img/institute3.png";
import client4 from "../../assets/img/institute2.jpg";
import client5 from "../../assets/img/institute4.png";

const clientLogos = [client1, client2, client3, client4, client5];

const Clients = () => {
  const settings = {
    dots: false, // Hide navigation dots
    infinite: true, // Infinite looping
    speed: 1000, // Transition speed
    slidesToShow: 5, // Number of logos per slide
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2500, // Time between slides
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Trusted by Industry Leaders
        </h2>
        <Slider {...settings}>
          {clientLogos.map((logo, index) => (
            <div key={index} className="px-4">
              <div className="flex justify-center items-center h-24">
                <img
                  src={logo}
                  alt={`Client ${index + 1}`}
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Clients;
