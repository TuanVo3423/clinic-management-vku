/* eslint-disable */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/no-deprecated */
/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-render-return-value */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-string-refs */
/* eslint-disable react/no-set-state */
import React from "react";
import "./styles.css";
import aboutImg from "./assets/about.jpg";
import chooseImg from "./assets/choose-us.jpg";
import doc1 from "./assets/doctor-1.jpg";
import doc2 from "./assets/doctor-2.jpg";
import doc3 from "./assets/doctor-3.jpg";
import ChatWidget from "../components/ChatWidget";
import SiteLayout from "./SiteLayout";

export default function Landing() {
  const patient = JSON.parse(localStorage.getItem("patientInfo")) || null;
  
  return (
    <>
      <SiteLayout className={patient ? "header-side" : "header-main"}>
        
        {/* SERVICE SECTION */}
        <section className="section__container service__container">
          <div className="service__header">
            <div className="service__header__content">
              <h2 className="section__header">Dịch vụ Chuyên khoa</h2>
              <p>
                Không chỉ đơn thuần là cung cấp dịch vụ y tế, cam kết của chúng tôi nằm ở việc 
                mang đến sự chăm sóc tận tâm, phù hợp với nhu cầu riêng biệt của bạn.
              </p>
            </div>
            <button type="button" className="service__btn">Tư vấn Dịch vụ</button>
          </div>

          <div className="service__grid">
            <div className="service__card">
              <span>
                <i className="ri-microscope-line" />
              </span>
              <h4>Xét nghiệm Y khoa</h4>
              <p>
                Chẩn đoán chính xác, kết quả nhanh chóng: Trải nghiệm dịch vụ 
                xét nghiệm hàng đầu tại cơ sở vật chất hiện đại của chúng tôi.
              </p>
              <a>Xem thêm</a>
            </div>

            <div className="service__card">
              <span>
                <i className="ri-mental-health-line" />
              </span>
              <h4>Khám Sức khỏe</h4>
              <p>
                Các đánh giá kỹ lưỡng và chuyên môn của chúng tôi giúp bạn 
                chủ động hơn trong việc bảo vệ và duy trì sức khỏe của mình.
              </p>
              <a>Xem thêm</a>
            </div>

            <div className="service__card">
              <span>
                <i className="ri-hospital-line" />
              </span>
              <h4>Khám tổng quát</h4>
              <p>
                Trải nghiệm chăm sóc cơ thể toàn diện. Hãy tin tưởng để chúng tôi 
                giữ cho cơ thể của bạn luôn khỏe mạnh và rạng rỡ.
              </p>
              <a>Xem thêm</a>
            </div>
          </div>
        </section>

        {/* ABOUT US SECTION */}
        <section className="section__container about__container">
          <div className="about__content">
            <h2 className="section__header">Về Chúng tôi</h2>
            <p>
              Chào mừng bạn đến với trang web của chúng tôi, điểm đến tin cậy cho 
              thông tin chăm sóc sức khỏe toàn diện. Chúng tôi cam kết thúc đẩy 
              lối sống khỏe mạnh và cung cấp các nguồn lực giá trị để hỗ trợ hành trình sức khỏe của bạn.
            </p>
            <p>
              Khám phá kho tàng bài viết và hướng dẫn chuyên sâu về nhiều chủ đề sức khỏe. 
              Từ việc tìm hiểu các bệnh lý thường gặp đến mẹo duy trì lối sống lành mạnh, 
              nội dung của chúng tôi nhằm giáo dục, truyền cảm hứng và hỗ trợ bạn đưa ra những lựa chọn sáng suốt.
            </p>
          </div>

          <div className="about__image">
            <img src={aboutImg} alt="about" />
          </div>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="section__container why__container">
          <div className="why__image">
            <img src={chooseImg} alt="why choose us" />
          </div>

          <div className="why__content">
            <h2 className="section__header">Tại sao chọn chúng tôi?</h2>
            <p>
              Với cam kết kiên định về sức khỏe của bạn, đội ngũ chuyên gia y tế 
              được đào tạo bài bản của chúng tôi đảm bảo mang lại trải nghiệm bệnh nhân tuyệt vời nhất.
            </p>

            <div className="why__grid">
              <span>
                <i className="ri-hand-heart-line" />
              </span>
              <div>
                <h4>Chăm sóc tích cực</h4>
                <p>
                  Đơn vị Chăm sóc Tích cực của chúng tôi được trang bị công nghệ tiên tiến 
                  và vận hành bởi đội ngũ chuyên gia giàu kinh nghiệm.
                </p>
              </div>

              <span>
                <i className="ri-truck-line" />
              </span>
              <div>
                <h4>Tư vấn miễn phí</h4>
                <p>
                  Một sáng kiến nhân văn nhằm ưu tiên sức khỏe của bạn mà không 
                  phải lo lắng về gánh nặng tài chính.
                </p>
              </div>

              <span>
                <i className="ri-hospital-line" />
              </span>
              <div>
                <h4>Xoa bóp, bấm huyệt</h4>
                <p>
                  Chúng tôi cung cấp các giải pháp chăm sóc sức khỏe tiên tiến 
                  và các phương pháp điều trị y học cổ truyền hiệu quả.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DOCTORS SECTION */}
        <section className="section__container doctors__container">
          <div className="doctors__header">
            <div className="doctors__header__content">
              <h2 className="section__header">Đội ngũ Bác sĩ Ưu tú</h2>
              <p>
                Chúng tôi tự hào về đội ngũ bác sĩ xuất sắc, mỗi người là một 
                chuyên gia hàng đầu trong lĩnh vực của mình.
              </p>
            </div>

            <div className="doctors__nav">
              <span>
                <i className="ri-arrow-left-line" />
              </span>
              <span>
                <i className="ri-arrow-right-line" />
              </span>
            </div>
          </div>

            <div className="doctors__grid">
            <div className="doctors__card">
              <div className="doctors__card__image">
                <img src={"https://benhvienyhoccotruyendanang.vn/wp-content/uploads/2025/01/CAM06630-scaled.jpeg"} alt="doctor" />
                <div className="doctors__socials">
                  <span><i className="ri-instagram-line" /></span>
                  <span><i className="ri-facebook-fill" /></span>
                  <span><i className="ri-heart-fill" /></span>
                  <span><i className="ri-twitter-fill" /></span>
                </div>
              </div>
              <h4>BS.CKI PHAN NGUYỄN NHƯ PHƯƠNG</h4>
              <p>Bác sĩ</p>
            </div>

            <div className="doctors__card">
              <div className="doctors__card__image">
                <img src={"https://benhvienyhoccotruyendanang.vn/wp-content/uploads/2025/01/CAM06594-1024x1536.jpeg"} alt="doctor" />
                <div className="doctors__socials">
                  <span><i className="ri-instagram-line" /></span>
                  <span><i className="ri-facebook-fill" /></span>
                  <span><i className="ri-heart-fill" /></span>
                  <span><i className="ri-twitter-fill" /></span>
                </div>
              </div>
              <h4>BS.CKI HOÀNG VIỆT DŨNG</h4>
              <p>Bác sĩ</p>
            </div>

            {/* <div className="doctors__card">
              <div className="doctors__card__image">
                <img className="h-full" src={"https://img.freepik.com/premium-vector/free-vector-cartoon-nurse-illustration_1060459-111.jpg"} alt="doctor" />
                <div className="doctors__socials">
                  <span><i className="ri-instagram-line" /></span>
                  <span><i className="ri-facebook-fill" /></span>
                  <span><i className="ri-heart-fill" /></span>
                  <span><i className="ri-twitter-fill" /></span>
                </div>
              </div>
              <h4>Đội ngũ điều dưỡng</h4>
              <p>Điều dưỡng</p>
            </div> */}
          </div>
        </section>

      </SiteLayout>
    </>
  );
}