/* eslint-disable */

import React, { useState } from "react";
import { Input, Card, Tag, Pagination, Select } from "antd";
import SiteLayout from "../SiteLayout.jsx";

const { Search } = Input;
const { Option } = Select;

// Sample blog data - replace with your actual data from API
const sampleBlogs = [
  {
    id: 1,
    title: "Phương pháp chữa đau lưng bằng y học cổ truyền",
    excerpt:
      "Đau lưng là một trong những vấn đề sức khỏe phổ biến nhất hiện nay. Bài viết này sẽ hướng dẫn các phương pháp điều trị hiệu quả từ y học cổ truyền...",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    category: "Châm cứu",
    author: "BS. Nguyễn Văn A",
    date: "2024-12-05",
    readTime: "5 phút đọc",
    tags: ["Đau lưng", "Châm cứu", "Y học cổ truyền"],
  },
  {
    id: 2,
    title: "Lợi ích của bấm huyệt trong điều trị stress",
    excerpt:
      "Bấm huyệt là phương pháp trị liệu không xâm lấn, giúp giảm căng thẳng, lo âu và cải thiện giấc ngủ. Tìm hiểu các huyệt đạo quan trọng...",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    category: "Bấm huyệt",
    author: "BS. Trần Thị B",
    date: "2024-12-03",
    readTime: "7 phút đọc",
    tags: ["Bấm huyệt", "Stress", "Sức khỏe tâm thần"],
  },
  {
    id: 3,
    title: "Thuốc nam chữa viêm họng mãn tính",
    excerpt:
      "Viêm họng mãn tính gây khó chịu và ảnh hưởng đến cuộc sống. Các bài thuốc nam truyền thống đã được chứng minh hiệu quả trong điều trị...",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80",
    category: "Thuốc nam",
    author: "Lương y Lê Văn C",
    date: "2024-12-01",
    readTime: "6 phút đọc",
    tags: ["Thuốc nam", "Viêm họng", "Đông y"],
  },
  {
    id: 4,
    title: "Massage trị liệu: Giảm đau vai gáy hiệu quả",
    excerpt:
      "Vai gáy đau mỏi là triệu chứng phổ biến ở dân văn phòng. Các kỹ thuật massage truyền thống giúp giảm đau nhanh chóng và an toàn...",
    image:
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=800&q=80",
    category: "Massage",
    author: "BS. Phạm Minh D",
    date: "2024-11-28",
    readTime: "8 phút đọc",
    tags: ["Massage", "Vai gáy", "Thư giãn"],
  },
  {
    id: 5,
    title: "Điều trị mất ngủ bằng phương pháp tự nhiên",
    excerpt:
      "Mất ngủ ảnh hưởng nghiêm trọng đến sức khỏe. Khám phá các liệu pháp tự nhiên từ y học cổ truyền để có giấc ngủ ngon...",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
    category: "Sức khỏe",
    author: "BS. Hoàng Thị E",
    date: "2024-11-25",
    readTime: "6 phút đọc",
    tags: ["Mất ngủ", "Điều trị tự nhiên", "Giấc ngủ"],
  },
  {
    id: 6,
    title: "Huyệt đạo quan trọng trong điều trị đau đầu",
    excerpt:
      "Đau đầu có thể được giảm bớt hiệu quả thông qua bấm huyệt. Tìm hiểu về các huyệt đạo chính và cách bấm đúng kỹ thuật...",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    category: "Châm cứu",
    author: "Lương y Vũ Văn F",
    date: "2024-11-22",
    readTime: "5 phút đọc",
    tags: ["Đau đầu", "Huyệt đạo", "Bấm huyệt"],
  },
];

const categories = [
  "Tất cả",
  "Châm cứu",
  "Bấm huyệt",
  "Thuốc nam",
  "Massage",
  "Sức khỏe",
];

const BlogPage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Filter blogs based on search and category
  const filteredBlogs = sampleBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginate results
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  return (
    <SiteLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #ecfdf5 0%, #ffffff 100%)",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header Section */}
          <div
            style={{
              background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              borderRadius: "20px",
              padding: "50px 40px",
              marginBottom: "40px",
              boxShadow: "0 10px 40px rgba(5, 150, 105, 0.2)",
              color: "white",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  margin: "0 0 16px 0",
                  color: "white",
                }}
              >
                📚 Blog Y Học Cổ Truyền
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  margin: "0 0 30px 0",
                  opacity: 0.95,
                  maxWidth: "700px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Khám phá kiến thức quý báu về y học cổ truyền, phương pháp điều
                trị tự nhiên và bí quyết chăm sóc sức khỏe
              </p>

              {/* Search Bar */}
              <div
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <Search
                  placeholder="Tìm kiếm bài viết..."
                  size="large"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{
                    borderRadius: "12px",
                  }}
                  prefix={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px 30px",
              marginBottom: "30px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontWeight: "600",
                color: "#065f46",
                fontSize: "15px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Danh mục:
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  style={{
                    background:
                      selectedCategory === category
                        ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                        : "#f3f4f6",
                    color: selectedCategory === category ? "white" : "#374151",
                    border: "none",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow:
                      selectedCategory === category
                        ? "0 2px 8px rgba(5, 150, 105, 0.3)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.background = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.background = "#f3f4f6";
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            <div
              style={{
                color: "#6b7280",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {filteredBlogs.length} bài viết
            </div>
          </div>

          {/* Blog Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "30px",
              marginBottom: "40px",
            }}
          >
            {paginatedBlogs.map((blog) => (
              <Card
                key={blog.id}
                hoverable
                cover={
                  <div
                    style={{
                      height: "220px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background:
                          "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "600",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {blog.category}
                    </div>
                  </div>
                }
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: "24px" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(5, 150, 105, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.08)";
                }}
              >
                <h3
                  style={{
                    fontSize: "19px",
                    fontWeight: "700",
                    color: "#065f46",
                    marginBottom: "12px",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {blog.title}
                </h3>

                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {blog.excerpt}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    marginBottom: "16px",
                  }}
                >
                  {blog.tags.map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        background: "#ecfdf5",
                        color: "#059669",
                        border: "1px solid #a7f3d0",
                        borderRadius: "12px",
                        padding: "2px 10px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      #{tag}
                    </Tag>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "16px",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#065f46",
                      }}
                    >
                      {blog.author}
                    </span>
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {blog.date} • {blog.readTime}
                    </span>
                  </div>

                  <button
                    onClick={() => (window.location.href = `/blog/${blog.id}`)}
                    style={{
                      background:
                        "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 6px rgba(5, 150, 105, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(5, 150, 105, 0.3)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 2px 6px rgba(5, 150, 105, 0.2)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Đọc thêm
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Không tìm thấy bài viết
              </h3>
              <p style={{ color: "#6b7280", fontSize: "15px" }}>
                Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredBlogs.length > pageSize && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
              }}
            >
              <Pagination
                current={currentPage}
                total={filteredBlogs.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                style={{
                  background: "white",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
};

export default BlogPage;
