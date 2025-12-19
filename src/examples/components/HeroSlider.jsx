/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const images = [
  "https://cdn.tienphong.vn/images/bdfc554ea35983ad68a96e0050b6e2cb46c52704ed73e29298714a74cdf2e4e79f587cdfd08b5f139a6da8b69c824580fe8991d03646e7f1ea1969aa327abce947ddaea4c215f0280b7a08da4f92e15e/img-20231124-075439-2414.jpg.webp",
  "https://benhvienyhoccotruyendanang.vn/wp-content/uploads/2025/08/BANNER-WEB-1.png",
  "https://cdn.nhathuoclongchau.com.vn/v1/static/gioi_thieu_ve_dia_chi_benh_vien_y_hoc_co_truyen_da_nang_5_eec72c18b0.jpg",
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goNext = () => setIndex((index + 1) % images.length);
  const goPrev = () =>
    setIndex((index - 1 + images.length) % images.length);

  return (
    <div
      ref={sliderRef}
      className="relative h-[400px] md:h-[550px] overflow-hidden select-none mt-10 mx-7 rounded-xl"
    >

      {/* SLIDES */}
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="banner"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>

      {/* TEXT OVERLAY */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 md:px-10">
        <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight drop-shadow-lg">
          Chăm sóc sức khỏe toàn diện
          <br />
          <span className="text-emerald-300">Cho bạn và gia đình</span>
        </h1>

        <p className="text-white/90 mt-4 text-sm md:text-lg max-w-xl">
          Đặt lịch khám nhanh chóng – tư vấn tận tâm – dịch vụ chuẩn quốc tế.
        </p>

        <button
          onClick={() => navigate("/scheduler")}
          className="mt-6 px-6 md:px-8 py-3 text-white font-medium rounded-full 
          bg-emerald-600 hover:bg-emerald-700 transition shadow-lg"
        >
          Đặt lịch ngay
        </button>
      </div>

      {/* PREV BUTTON */}
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 
        bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm"
      >
        <i className="ri-arrow-left-s-line text-2xl"></i>
      </button>

      {/* NEXT BUTTON */}
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 
        bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm"
      >
        <i className="ri-arrow-right-s-line text-2xl"></i>
      </button>

      {/* DOT INDICATORS */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition 
              ${i === index ? "bg-emerald-400 scale-110" : "bg-white/60 hover:bg-white"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
