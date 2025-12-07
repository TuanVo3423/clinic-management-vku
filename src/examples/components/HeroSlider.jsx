/*eslint-disable*/
import React, { useEffect, useState } from "react";
import "./HeroSlider.css";

const images = [
  "https://cdn.tienphong.vn/images/bdfc554ea35983ad68a96e0050b6e2cb46c52704ed73e29298714a74cdf2e4e79f587cdfd08b5f139a6da8b69c824580fe8991d03646e7f1ea1969aa327abce947ddaea4c215f0280b7a08da4f92e15e/img-20231124-075439-2414.jpg.webp",
  "https://benhvienyhoccotruyendanang.vn/wp-content/uploads/2025/08/BANNER-WEB-1.png",
  "https://cdn.nhathuoclongchau.com.vn/v1/static/gioi_thieu_ve_dia_chi_benh_vien_y_hoc_co_truyen_da_nang_5_eec72c18b0.jpg",
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slider">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          className={`slide ${i === index ? "active" : ""}`}
          alt="banner"
        />
      ))}

      <div className="hero-slider-overlay">
        <h1>
          Chăm sóc sức khỏe toàn diện
          <br />
          <span>Cho bạn và gia đình</span>
        </h1>
        <p>Đặt lịch khám nhanh chóng – tư vấn tận tâm – dịch vụ chuẩn quốc tế.</p>
        <button>Đặt lịch ngay</button>
      </div>
    </div>
  );
}
