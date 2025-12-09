/* eslint-disable */
import React from "react";
import { Card, Row, Col, Timeline, Statistic } from "antd";
import SiteLayout from "../SiteLayout.jsx";

const AboutPage = () => {
  // Sample doctors data
  const doctors = [
    {
      id: 1,
      name: "BS. Nguyễn Văn An",
      title: "Bác sĩ Đông y - Trưởng khoa",
      specialization: "Châm cứu, Bấm huyệt",
      experience: "25 năm kinh nghiệm",
      education: "Đại học Y Dược TP.HCM",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
      description:
        "Chuyên gia hàng đầu về châm cứu và điều trị đau mãn tính. Đã điều trị thành công hơn 10,000 bệnh nhân.",
    },
    {
      id: 2,
      name: "BS. Trần Thị Bảo",
      title: "Bác sĩ Y học cổ truyền",
      specialization: "Thuốc nam, Nội khoa",
      experience: "18 năm kinh nghiệm",
      education: "Đại học Y Hà Nội",
      image:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
      description:
        "Chuyên điều trị các bệnh mãn tính bằng thuốc nam. Giàu kinh nghiệm trong điều trị viêm dạ dày, gan mật.",
    },
    {
      id: 3,
      name: "Lương y Lê Minh Châu",
      title: "Lương y 5 đời",
      specialization: "Đông y truyền thống",
      experience: "30 năm kinh nghiệm",
      education: "Truyền thừa gia học",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
      description:
        "Kế thừa 5 đời lương y trong gia đình. Chuyên điều trị bệnh hiểm nghèo bằng phương pháp đông y.",
    },
    {
      id: 4,
      name: "BS. Phạm Văn Đức",
      title: "Bác sĩ Nội khoa - Đông y",
      specialization: "Massage, Vật lý trị liệu",
      experience: "15 năm kinh nghiệm",
      education: "Đại học Y Dược Cần Thơ",
      image:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
      description:
        "Chuyên điều trị đau cột sống, thoát vị đĩa đệm bằng kỹ thuật massage và vật lý trị liệu.",
    },
  ];

  const achievements = [
    {
      year: "1995",
      title: "Thành lập phòng khám",
      description:
        "Phòng khám Y học cổ truyền được thành lập với sứ mệnh mang lại sức khỏe cho cộng đồng",
    },
    {
      year: "2005",
      title: "Mở rộng quy mô",
      description:
        "Nâng cấp cơ sở vật chất, trang thiết bị hiện đại, tăng đội ngũ bác sĩ lên 15 người",
    },
    {
      year: "2015",
      title: "Giải thưởng xuất sắc",
      description:
        "Nhận bằng khen của Bộ Y tế về thành tích điều trị bệnh nhân bằng y học cổ truyền",
    },
    {
      year: "2020",
      title: "Chuyển đổi số",
      description:
        "Ứng dụng công nghệ 4.0, hệ thống đặt lịch online, quản lý hồ sơ bệnh nhân điện tử",
    },
    {
      year: "2025",
      title: "Phát triển toàn diện",
      description:
        "Hơn 50,000 lượt khám mỗi năm, mở rộng dịch vụ khám từ xa và tư vấn online",
    },
  ];

  const stats = [
    { value: 50000, suffix: "+", title: "Bệnh nhân mỗi năm", icon: "👥" },
    { value: 30, suffix: "+", title: "Năm kinh nghiệm", icon: "⭐" },
    { value: 20, suffix: "+", title: "Bác sĩ chuyên môn", icon: "👨‍⚕️" },
    { value: 98, suffix: "%", title: "Hài lòng dịch vụ", icon: "💚" },
  ];

  const services = [
    {
      icon: "💉",
      title: "Châm cứu",
      description:
        "Điều trị đau mãn tính, đau lưng, đau đầu, mất ngủ bằng phương pháp châm cứu truyền thống",
    },
    {
      icon: "👐",
      title: "Bấm huyệt",
      description:
        "Xoa bóp bấm huyệt giúp lưu thông khí huyết, giảm stress, cải thiện sức khỏe tổng thể",
    },
    {
      icon: "🌿",
      title: "Thuốc nam",
      description:
        "Bài thuốc gia truyền, thuốc nam thiên nhiên điều trị các bệnh mãn tính hiệu quả",
    },
    {
      icon: "💆",
      title: "Massage trị liệu",
      description:
        "Massage y học, vật lý trị liệu điều trị đau cột sống, vai gáy, phục hồi chức năng",
    },
    {
      icon: "🔥",
      title: "Giác hơi",
      description:
        "Giác hơi, cạo gió giúp thải độc tố, tăng cường tuần hoàn máu, điều trị cảm lạnh",
    },
    {
      icon: "🧘",
      title: "Tư vấn sức khỏe",
      description:
        "Tư vấn chế độ dinh dưỡng, lối sống lành mạnh, phòng ngừa bệnh tật",
    },
  ];

  return (
    <SiteLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #ecfdf5 0%, #ffffff 100%)",
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            padding: "80px 20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "white",
                marginBottom: "20px",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              🏥 Phòng Khám Y Học Cổ Truyền
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "white",
                marginBottom: "12px",
                opacity: 0.95,
                maxWidth: "800px",
                margin: "0 auto 12px",
              }}
            >
              Hơn 30 năm kinh nghiệm mang lại sức khỏe và niềm tin cho hàng
              nghìn bệnh nhân
            </p>
            <p
              style={{
                fontSize: "16px",
                color: "white",
                opacity: 0.9,
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              "Chữa bệnh bằng y đức, điều trị bằng tâm huyết"
            </p>
          </div>
        </div>

        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}
        >
          {/* Stats Section */}
          <Row gutter={[24, 24]} style={{ marginBottom: "80px" }}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  style={{
                    textAlign: "center",
                    borderRadius: "16px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: "30px 20px" }}
                  hoverable
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(5, 150, 105, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "12px" }}>
                    {stat.icon}
                  </div>
                  <Statistic
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{
                      fontSize: "36px",
                      fontWeight: "700",
                      background:
                        "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "8px",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "15px",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    {stat.title}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* About Section */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "50px 40px",
              marginBottom: "60px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#065f46",
                marginBottom: "30px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Về chúng tôi
            </h2>
            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.8",
                color: "#374151",
              }}
            >
              <p style={{ marginBottom: "20px" }}>
                <strong style={{ color: "#059669" }}>
                  Phòng Khám Y Học Cổ Truyền
                </strong>{" "}
                được thành lập từ năm 1995 với sứ mệnh kế thừa và phát huy những
                giá trị y học cổ truyền Việt Nam, mang lại giải pháp chữa bệnh
                an toàn, hiệu quả cho cộng đồng.
              </p>
              <p style={{ marginBottom: "20px" }}>
                Với đội ngũ bác sĩ, lương y giàu kinh nghiệm, được đào tạo bài
                bản từ các trường y dược hàng đầu cả nước, chúng tôi tự hào đã
                điều trị thành công cho hơn{" "}
                <strong style={{ color: "#059669" }}>50,000 bệnh nhân</strong>{" "}
                mỗi năm với các bệnh lý từ cấp tính đến mãn tính.
              </p>
              <p style={{ marginBottom: "20px" }}>
                Phòng khám được trang bị cơ sở vật chất hiện đại, kết hợp hài
                hòa giữa công nghệ và y học truyền thống. Chúng tôi sử dụng các
                bài thuốc gia truyền, nguyên liệu thảo dược thiên nhiên 100%
                được kiểm định chất lượng, đảm bảo an toàn tuyệt đối cho người
                bệnh.
              </p>
              <p>
                Phương châm hoạt động của chúng tôi là{" "}
                <strong style={{ color: "#059669" }}>
                  "Lấy y đức làm gốc, lấy tâm huyết làm nghề"
                </strong>
                . Chúng tôi cam kết luôn đặt sức khỏe và quyền lợi của bệnh nhân
                lên hàng đầu, mang đến dịch vụ chăm sóc sức khỏe tận tâm, chuyên
                nghiệp.
              </p>
            </div>
          </div>

          {/* Services Section */}
          <div style={{ marginBottom: "80px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#065f46",
                marginBottom: "40px",
                textAlign: "center",
              }}
            >
              🌟 Dịch vụ của chúng tôi
            </h2>
            <Row gutter={[24, 24]}>
              {services.map((service, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <Card
                    style={{
                      height: "100%",
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                    }}
                    bodyStyle={{ padding: "30px" }}
                    hoverable
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = "#10b981";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(5, 150, 105, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "48px",
                        marginBottom: "16px",
                        textAlign: "center",
                      }}
                    >
                      {service.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#059669",
                        marginBottom: "12px",
                        textAlign: "center",
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        lineHeight: "1.6",
                        textAlign: "center",
                      }}
                    >
                      {service.description}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Doctors Section */}
          <div style={{ marginBottom: "80px" }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#065f46",
                marginBottom: "40px",
                textAlign: "center",
              }}
            >
              👨‍⚕️ Đội ngũ bác sĩ
            </h2>
            <Row gutter={[24, 24]}>
              {doctors.map((doctor) => (
                <Col xs={24} sm={12} lg={6} key={doctor.id}>
                  <Card
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                      height: "100%",
                    }}
                    bodyStyle={{ padding: 0 }}
                    hoverable
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.boxShadow =
                        "0 12px 24px rgba(5, 150, 105, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 0, 0, 0.08)";
                    }}
                  >
                    <div
                      style={{
                        height: "280px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                          padding: "40px 20px 20px",
                        }}
                      >
                        <div
                          style={{
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "700",
                            marginBottom: "4px",
                          }}
                        >
                          {doctor.name}
                        </div>
                        <div
                          style={{
                            color: "#d1fae5",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          {doctor.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: "20px" }}>
                      <div style={{ marginBottom: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>🎯</span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#059669",
                              fontWeight: "600",
                            }}
                          >
                            {doctor.specialization}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>⭐</span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              fontWeight: "500",
                            }}
                          >
                            {doctor.experience}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>🎓</span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              fontWeight: "500",
                            }}
                          >
                            {doctor.education}
                          </span>
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          lineHeight: "1.6",
                          marginTop: "12px",
                          paddingTop: "12px",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        {doctor.description}
                      </p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Timeline Section */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "50px 40px",
              marginBottom: "60px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#065f46",
                marginBottom: "40px",
                textAlign: "center",
              }}
            >
              📅 Hành trình phát triển
            </h2>
            <Timeline
              style={{ maxWidth: "800px", margin: "0 auto" }}
              items={achievements.map((item) => ({
                color: "#10b981",
                dot: (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      boxShadow: "0 0 0 4px #d1fae5",
                    }}
                  />
                ),
                children: (
                  <div style={{ paddingBottom: "30px" }}>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#059669",
                        marginBottom: "8px",
                      }}
                    >
                      {item.year}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#065f46",
                        marginBottom: "8px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "15px",
                        color: "#6b7280",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>

          {/* Contact Section */}
          <div
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              borderRadius: "20px",
              padding: "50px 40px",
              color: "white",
              boxShadow: "0 10px 40px rgba(5, 150, 105, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "30px",
                textAlign: "center",
                color: "white",
              }}
            >
              📞 Liên hệ với chúng tôi
            </h2>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    📍
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "12px",
                      color: "white",
                    }}
                  >
                    Địa chỉ
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.6",
                      opacity: 0.95,
                    }}
                  >
                    123 Đường Nguyễn Văn Linh
                    <br />
                    Phường Tân Phú, Quận 7<br />
                    TP. Hồ Chí Minh
                  </p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    📞
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "12px",
                      color: "white",
                    }}
                  >
                    Điện thoại
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.6",
                      opacity: 0.95,
                    }}
                  >
                    Hotline: 1900 xxxx
                    <br />
                    Di động: 0909 xxx xxx
                    <br />
                    (7:00 - 21:00 hàng ngày)
                  </p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                    ✉️
                  </div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "12px",
                      color: "white",
                    }}
                  >
                    Email & Social
                  </h3>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.6",
                      opacity: 0.95,
                    }}
                  >
                    info@yhoccotruyenhcm.vn
                    <br />
                    Facebook: /yhoccotruyenhcm
                    <br />
                    Zalo: 0909 xxx xxx
                  </p>
                </div>
              </Col>
            </Row>
            <div
              style={{
                marginTop: "40px",
                padding: "24px",
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "12px",
                  color: "white",
                }}
              >
                🕐 Giờ làm việc
              </h3>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.8",
                  opacity: 0.95,
                }}
              >
                <strong>Thứ 2 - Thứ 7:</strong> 7:00 - 20:00
                <br />
                <strong>Chủ nhật:</strong> 8:00 - 17:00
                <br />
                <em style={{ fontSize: "14px" }}>(Nghỉ các ngày lễ, tết)</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default AboutPage;
