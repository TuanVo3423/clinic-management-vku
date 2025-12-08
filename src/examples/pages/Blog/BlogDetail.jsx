import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Divider } from "antd";
import SiteLayout from "../SiteLayout.jsx";

// Sample blog data - should match the data from index.jsx
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
    content: `
      <h2>Đau lưng - Vấn đề phổ biến của thời đại hiện đại</h2>
      <p>Đau lưng là một trong những vấn đề sức khỏe phổ biến nhất hiện nay, ảnh hưởng đến hơn 80% dân số ít nhất một lần trong đời. Theo y học cổ truyền, đau lưng không chỉ là vấn đề về cơ xương mà còn liên quan đến sự mất cân bằng trong cơ thể.</p>
      
      <h3>Nguyên nhân gây đau lưng theo Y học cổ truyền</h3>
      <p>Theo quan điểm của y học cổ truyền, đau lưng có thể xuất phát từ nhiều nguyên nhân:</p>
      <ul>
        <li><strong>Phong hàn thấp tà:</strong> Do cơ thể bị nhiễm phong, hàn, thấp khí từ môi trường bên ngoài</li>
        <li><strong>Khí huyết không lưu thông:</strong> Khí huyết bị ứ trệ, không tuần hoàn tốt ở vùng lưng</li>
        <li><strong>Thận hư:</strong> Suy giảm chức năng thận theo y học cổ truyền</li>
        <li><strong>Tư thế và lao động sai:</strong> Do làm việc, sinh hoạt không đúng tư thế</li>
      </ul>

      <h3>Phương pháp điều trị bằng Châm cứu</h3>
      <p>Châm cứu là phương pháp điều trị hiệu quả, đã được UNESCO công nhận là di sản văn hóa phi vật thể của nhân loại. Các huyệt đạo quan trọng trong điều trị đau lưng:</p>
      
      <h4>1. Huyệt Thận Du (BL23)</h4>
      <p>Vị trí: Nằm ở lưng, ngang với khoảng giữa hai đốt sống L2-L3, cách đường giữa 1,5 thốn. Đây là huyệt quan trọng nhất trong điều trị đau lưng do thận hư.</p>
      
      <h4>2. Huyệt Khí Hải Du (BL24)</h4>
      <p>Vị trí: Ngang với khoảng giữa L3-L4, cách đường giữa 1,5 thốn. Huyệt này giúp bổ khí, điều hòa khí huyết vùng lưng.</p>
      
      <h4>3. Huyệt Ủy Trung (BL40)</h4>
      <p>Vị trí: Ở giữa nếp gấp khoeo, giữa hai gân cơ. Đây là huyệt đặc hiệu điều trị đau lưng, có câu "Yêu bối ủy trung cầu" (Đau lưng thì tìm đến Ủy Trung).</p>

      <h3>Kết hợp Bấm huyệt tại nhà</h3>
      <p>Ngoài châm cứu tại cơ sở y tế, bạn có thể tự bấm huyệt tại nhà để giảm đau:</p>
      <ul>
        <li>Bấm huyệt Thận Du: Dùng hai ngón cái bấm vào hai bên lưng, mỗi lần 3-5 phút</li>
        <li>Bấm huyệt Ủy Trung: Ngồi gập chân, dùng ngón cái bấm vào giữa khoeo, giữ 2-3 phút</li>
        <li>Thực hiện 2-3 lần mỗi ngày để đạt hiệu quả tốt nhất</li>
      </ul>

      <h3>Bài thuốc nam hỗ trợ</h3>
      <p>Kết hợp với châm cứu, có thể sử dụng các bài thuốc nam để tăng hiệu quả điều trị:</p>
      <ul>
        <li><strong>Độc hoạt tang ký sinh thang:</strong> Điều trị đau lưng do phong hàn thấp</li>
        <li><strong>Tả hỏa thang:</strong> Điều trị đau lưng cấp tính</li>
        <li><strong>Lục vị địa hoàng hoàn:</strong> Bổ thận, điều trị đau lưng do thận hư</li>
      </ul>

      <h3>Lưu ý khi điều trị</h3>
      <p>Để đạt hiệu quả điều trị tốt nhất, bạn cần:</p>
      <ul>
        <li>Tìm đến cơ sở y tế uy tín, bác sĩ có chuyên môn</li>
        <li>Kiên trì điều trị theo liệu trình (thường 10-15 lần)</li>
        <li>Kết hợp với vận động nhẹ nhàng, không nằm lì một chỗ</li>
        <li>Giữ ấm vùng lưng, tránh gió lạnh</li>
        <li>Điều chỉnh tư thế làm việc và sinh hoạt</li>
      </ul>

      <h3>Kết luận</h3>
      <p>Y học cổ truyền, đặc biệt là châm cứu, đã chứng minh hiệu quả trong điều trị đau lưng. Đây là phương pháp an toàn, không xâm lấn và ít tác dụng phụ. Tuy nhiên, để đạt kết quả tốt nhất, bạn nên kết hợp nhiều phương pháp và kiên trì điều trị theo hướng dẫn của bác sĩ.</p>
    `,
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
    content: `
      <h2>Stress - Căn bệnh thời đại</h2>
      <p>Trong nhịp sống hiện đại, stress đã trở thành vấn đề sức khỏe phổ biến, ảnh hưởng nghiêm trọng đến chất lượng cuộc sống. Bấm huyệt là giải pháp tự nhiên, hiệu quả mà bạn có thể tự thực hiện tại nhà.</p>

      <h3>Bấm huyệt là gì?</h3>
      <p>Bấm huyệt (acupressure) là phương pháp điều trị bằng cách tác động lực vào các huyệt đạo trên cơ thể để điều hòa khí huyết, giúp cơ thể tự chữa lành. Đây là phương pháp an toàn, không cần dụng cụ và có thể tự thực hiện.</p>

      <h3>5 Huyệt đạo quan trọng giảm stress</h3>
      
      <h4>1. Huyệt Thần Môn (HT7)</h4>
      <p>Vị trí: Ở cổ tay, nếp gấp cổ tay, phía trong gân cơ gấp trụ cổ tay. Đây là huyệt "thần kỳ" giúp an thần, giảm lo âu hiệu quả nhất.</p>
      
      <h4>2. Huyệt Nội Quan (PC6)</h4>
      <p>Vị trí: Ở mặt trong cẳng tay, cách nếp gấp cổ tay 2 thốn (3 ngón tay ngang). Huyệt này giúp điều hòa tâm thần, giảm buồn nôn do căng thẳng.</p>
      
      <h4>3. Huyệt Hợp Cốc (LI4)</h4>
      <p>Vị trí: Ở mu bàn tay, giữa xương bàn tay thứ nhất và thứ hai. Huyệt giảm đau đầu, căng thẳng hiệu quả.</p>
      
      <h4>4. Huyệt Ấn Đường (EX-HN3)</h4>
      <p>Vị trí: Giữa hai lông mày. Bấm huyệt này giúp tỉnh táo, giảm mệt mỏi tinh thần.</p>
      
      <h4>5. Huyệt Thái Dương</h4>
      <p>Vị trí: Ở hai bên thái dương, chỗ lõm giữa đuôi mắt và đuôi lông mày. Giảm đau đầu do căng thẳng.</p>

      <h3>Cách bấm huyệt đúng kỹ thuật</h3>
      <ul>
        <li><strong>Tìm đúng huyệt:</strong> Sờ tìm vị trí, thường có cảm giác hơi đau, hơi tê khi bấm đúng</li>
        <li><strong>Lực bấm:</strong> Vừa phải, tạo cảm giác đau nhẹ nhưng chịu được</li>
        <li><strong>Thời gian:</strong> Mỗi huyệt bấm 2-3 phút, có thể lặp lại 3-5 lần/ngày</li>
        <li><strong>Kỹ thuật:</strong> Dùng đầu ngón tay bấm theo chiều kim đồng hồ</li>
      </ul>

      <h3>Lợi ích của bấm huyệt</h3>
      <ul>
        <li>✅ Giảm căng thẳng, lo âu tức thì</li>
        <li>✅ Cải thiện giấc ngủ</li>
        <li>✅ Giảm đau đầu, đau vai gáy</li>
        <li>✅ Tăng cường tuần hoàn máu</li>
        <li>✅ Không tác dụng phụ</li>
        <li>✅ Có thể tự thực hiện mọi lúc mọi nơi</li>
      </ul>

      <h3>Kết luận</h3>
      <p>Bấm huyệt là phương pháp đơn giản nhưng hiệu quả trong việc quản lý stress. Hãy dành 10-15 phút mỗi ngày để chăm sóc bản thân bằng phương pháp tự nhiên này!</p>
    `,
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
    content: `
      <h2>Viêm họng mãn tính - Căn bệnh dai dẳng</h2>
      <p>Viêm họng mãn tính là tình trạng viêm nhiễm kéo dài ở niêm mạc họng, gây khó chịu và ảnh hưởng đến chất lượng cuộc sống. Y học cổ truyền có nhiều bài thuốc hiệu quả điều trị căn bệnh này.</p>

      <h3>3 Bài thuốc nam điều trị hiệu quả</h3>
      
      <h4>Bài 1: Trà bạc hà kim ngân</h4>
      <p><strong>Thành phần:</strong></p>
      <ul>
        <li>Kim ngân hoa (hoa kim ngân): 15g</li>
        <li>Bạc hà: 10g</li>
        <li>Cam thảo: 6g</li>
        <li>Cát căn: 10g</li>
      </ul>
      <p><strong>Cách dùng:</strong> Sắc với 500ml nước, uống ấm trong ngày. Dùng liên tục 7-10 ngày.</p>
      
      <h4>Bài 2: Nước ngậm họng thần hiệu</h4>
      <p><strong>Thành phần:</strong></p>
      <ul>
        <li>Bồ công anh: 20g</li>
        <li>Kim ngân hoa: 15g</li>
        <li>Mật ong: 2 thìa</li>
      </ul>
      <p><strong>Cách dùng:</strong> Sắc lấy nước, thêm mật ong, ngậm họng 3-4 lần/ngày.</p>

      <h4>Bài 3: Cao chữa viêm họng</h4>
      <p><strong>Thành phần:</strong></p>
      <ul>
        <li>Bạch truật: 15g</li>
        <li>Đương quy: 10g</li>
        <li>Trần bì: 8g</li>
        <li>Cam thảo: 6g</li>
      </ul>
      <p><strong>Cách dùng:</strong> Sắc đặc, uống 2 lần/ngày sau ăn.</p>

      <h3>Chế độ ăn uống hỗ trợ</h3>
      <ul>
        <li>Uống nhiều nước ấm</li>
        <li>Ăn nhiều rau xanh, trái cây</li>
        <li>Tránh đồ cay, nóng, chiên rán</li>
        <li>Không uống đồ lạnh, có ga</li>
      </ul>

      <h3>Kết luận</h3>
      <p>Thuốc nam điều trị viêm họng mãn tính hiệu quả nhưng cần kiên trì. Nên kết hợp với chế độ sinh hoạt hợp lý để đạt kết quả tốt nhất.</p>
    `,
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
    content: `
      <h2>Đau vai gáy - Nỗi khổ của dân văn phòng</h2>
      <p>Làm việc với máy tính nhiều giờ liên tục, tư thế ngồi không đúng khiến vai gáy đau mỏi trở thành căn bệnh phổ biến. Massage trị liệu là giải pháp hiệu quả, an toàn giúp giảm đau nhanh chóng.</p>

      <h3>Các kỹ thuật massage vai gáy cơ bản</h3>
      
      <h4>1. Xoa bóp cơ thang</h4>
      <p>Cơ thang là cơ quan trọng nối cổ với vai. Dùng ngón tay xoa bóp nhẹ nhàng từ gốc cổ xuống vai, mỗi bên 3-5 phút.</p>
      
      <h4>2. Bấm huyệt Phong Trì</h4>
      <p>Vị trí: Ở đáy hộp sọ, chỗ lõm giữa hai gân cơ. Bấm mạnh 2-3 phút mỗi bên, giúp giảm đau đầu và vai gáy hiệu quả.</p>
      
      <h4>3. Massage cơ vai</h4>
      <p>Dùng tay đối diện massage cơ vai theo chuyển động tròn, từ trong ra ngoài. Mỗi bên 5 phút.</p>

      <h4>4. Kéo giãn cổ</h4>
      <p>Nghiêng đầu sang hai bên, giữ mỗi tư thế 15-20 giây. Lặp lại 5 lần mỗi bên.</p>

      <h3>Các bước massage đúng cách</h3>
      <ol>
        <li><strong>Khởi động:</strong> Xoa nhẹ vùng vai gáy để làm ấm cơ (2 phút)</li>
        <li><strong>Xoa bóp:</strong> Tăng dần lực, tập trung vào vùng đau (5-7 phút)</li>
        <li><strong>Bấm huyệt:</strong> Bấm các huyệt quan trọng (3-5 phút)</li>
        <li><strong>Thư giãn:</strong> Xoa nhẹ để kết thúc (2 phút)</li>
      </ol>

      <h3>Lưu ý khi massage</h3>
      <ul>
        <li>⚠️ Không massage quá mạnh gây bầm tím</li>
        <li>⚠️ Tránh massage khi mới chấn thương</li>
        <li>⚠️ Ngừng ngay nếu đau tăng</li>
        <li>✅ Nên kết hợp với vận động nhẹ</li>
        <li>✅ Massage 2-3 lần/tuần để duy trì</li>
      </ul>

      <h3>Bài tập phòng ngừa đau vai gáy</h3>
      <ul>
        <li>Xoay cổ theo chiều kim đồng hồ và ngược lại (10 lần/chiều)</li>
        <li>Nhún vai lên xuống (15 lần)</li>
        <li>Gập duỗi cổ trước sau (10 lần)</li>
        <li>Thực hiện 2-3 lần/ngày, đặc biệt khi làm việc lâu</li>
      </ul>

      <h3>Kết luận</h3>
      <p>Massage trị liệu là phương pháp an toàn, hiệu quả giảm đau vai gáy. Kết hợp với tư thế làm việc đúng và vận động thường xuyên sẽ giúp bạn loại bỏ hoàn toàn tình trạng này.</p>
    `,
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
    content: `
      <h2>Mất ngủ - Căn bệnh thầm lặng</h2>
      <p>Mất ngủ không chỉ khiến bạn mệt mỏi mà còn ảnh hưởng đến sức khỏe tổng thể. Y học cổ truyền có nhiều phương pháp tự nhiên giúp cải thiện giấc ngủ mà không cần dùng thuốc.</p>

      <h3>5 Phương pháp tự nhiên điều trị mất ngủ</h3>
      
      <h4>1. Bấm huyệt An Miên</h4>
      <p><strong>Vị trí:</strong> Sau tai, chỗ lõm dưới xương chũm. Bấm nhẹ nhàng 5 phút trước khi ngủ.</p>
      <p><strong>Hiệu quả:</strong> Giúp an thần, dễ ngủ, giảm ác mộng.</p>
      
      <h4>2. Ngâm chân nước ấm</h4>
      <p><strong>Cách làm:</strong> Ngâm chân trong nước ấm 40-42°C, thêm muối hoặc gừng, ngâm 15-20 phút trước khi ngủ 30 phút.</p>
      <p><strong>Lợi ích:</strong> Thư giãn cơ thể, tăng tuần hoàn máu, dễ ngủ hơn.</p>

      <h4>3. Uống trà thảo mộc</h4>
      <p><strong>Công thức:</strong></p>
      <ul>
        <li>Hoa cúc: 5g</li>
        <li>Táo đỏ: 3 quả</li>
        <li>Long nhãn: 10g</li>
        <li>Cam thảo: 3g</li>
      </ul>
      <p>Sắc uống trước khi ngủ 1 giờ.</p>

      <h4>4. Thiền định và hít thở sâu</h4>
      <p><strong>Kỹ thuật 4-7-8:</strong></p>
      <ul>
        <li>Hít vào 4 giây</li>
        <li>Nín thở 7 giây</li>
        <li>Thở ra 8 giây</li>
        <li>Lặp lại 4-5 lần</li>
      </ul>

      <h4>5. Massage đầu và thái dương</h4>
      <p>Massage nhẹ nhàng vùng đầu, thái dương theo chiều tròn 5-10 phút giúp thư giãn tâm trí.</p>

      <h3>Thói quen tốt cho giấc ngủ</h3>
      <ul>
        <li>🕐 Đi ngủ và thức dậy đúng giờ</li>
        <li>📱 Tránh điện thoại trước khi ngủ 1 giờ</li>
        <li>🌡️ Giữ phòng mát mẻ (18-22°C)</li>
        <li>☕ Không uống cafe sau 3 giờ chiều</li>
        <li>🏃 Vận động đều đặn nhưng không tập trước khi ngủ 3 giờ</li>
        <li>🍽️ Ăn nhẹ buổi tối, không ăn quá no</li>
      </ul>

      <h3>Khi nào cần gặp bác sĩ?</h3>
      <p>Bạn nên đi khám nếu:</p>
      <ul>
        <li>Mất ngủ kéo dài hơn 1 tháng</li>
        <li>Ảnh hưởng nghiêm trọng đến công việc, sinh hoạt</li>
        <li>Có các triệu chứng khác kèm theo (đau đầu, khó thở...)</li>
      </ul>

      <h3>Kết luận</h3>
      <p>Điều trị mất ngủ bằng phương pháp tự nhiên an toàn và hiệu quả. Hãy kiên trì thực hiện ít nhất 2-3 tuần để thấy kết quả rõ rệt. Kết hợp nhiều phương pháp sẽ mang lại hiệu quả tốt nhất.</p>
    `,
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
    content: `
      <h2>Đau đầu - Cách giảm đau tức thì bằng bấm huyệt</h2>
      <p>Đau đầu là tình trạng phổ biến, có thể xuất hiện do nhiều nguyên nhân. Bấm huyệt là phương pháp đơn giản, hiệu quả giúp giảm đau nhanh chóng mà không cần dùng thuốc.</p>

      <h3>7 Huyệt đạo đặc hiệu trị đau đầu</h3>
      
      <h4>1. Huyệt Thái Dương</h4>
      <p><strong>Vị trí:</strong> Ở hai bên thái dương, chỗ lõm giữa đuôi mắt và lông mày.</p>
      <p><strong>Cách bấm:</strong> Dùng hai ngón trỏ bấm theo chiều tròn, áp lực vừa phải, 2-3 phút.</p>
      <p><strong>Chỉ định:</strong> Đau đầu thái dương, đau nửa đầu migraine.</p>

      <h4>2. Huyệt Hợp Cốc (LI4)</h4>
      <p><strong>Vị trí:</strong> Mu bàn tay, giữa xương bàn tay thứ nhất và thứ hai.</p>
      <p><strong>Cách bấm:</strong> Dùng ngón cái và trỏ tay đối diện kẹp và bấm mạnh, 3-5 phút mỗi tay.</p>
      <p><strong>Chỉ định:</strong> Đau đầu trán, đau mặt, đau răng.</p>

      <h4>3. Huyệt Ấn Đường (EX-HN3)</h4>
      <p><strong>Vị trí:</strong> Giữa hai lông mày.</p>
      <p><strong>Cách bấm:</strong> Dùng ngón trỏ hoặc cái bấm theo chiều tròn, 2 phút.</p>
      <p><strong>Chỉ định:</strong> Đau đầu trán, chóng mặt, mất ngủ.</p>

      <h4>4. Huyệt Phong Trì (GB20)</h4>
      <p><strong>Vị trí:</strong> Đáy hộp sọ, chỗ lõm giữa hai gân cơ cổ.</p>
      <p><strong>Cách bấm:</strong> Dùng hai ngón cái bấm vào hai bên, hơi ngửa đầu, 3-5 phút.</p>
      <p><strong>Chỉ định:</strong> Đau đầu sau gáy, cảm cúm, chóng mặt.</p>

      <h4>5. Huyệt Bách Hội (GV20)</h4>
      <p><strong>Vị trí:</strong> Đỉnh đầu, giao điểm của đường nối hai đỉnh tai.</p>
      <p><strong>Cách bấm:</strong> Dùng đầu ngón giữa bấm theo chiều kim đồng hồ, 2-3 phút.</p>
      <p><strong>Chỉ định:</strong> Đau đầu đỉnh, chóng mặt, mất trí nhớ.</p>

      <h4>6. Huyệt Thiên Trụ (BL10)</h4>
      <p><strong>Vị trí:</strong> Sau gáy, 1,3 thốn ngoài đường giữa, chỗ lõm dưới xương chẩm.</p>
      <p><strong>Cách bấm:</strong> Dùng ngón cái bấm vào hai bên, 2-3 phút.</p>
      <p><strong>Chỉ định:</strong> Đau đầu sau, mỏi cổ gáy.</p>

      <h4>7. Huyệt Nội Quan (PC6)</h4>
      <p><strong>Vị trí:</strong> Mặt trong cẳng tay, cách nếp gấp cổ tay 2 thốn.</p>
      <p><strong>Cách bấm:</strong> Dùng ngón cái bấm mạnh, 2-3 phút mỗi tay.</p>
      <p><strong>Chỉ định:</strong> Đau đầu kèm buồn nôn, chóng mặt.</p>

      <h3>Các loại đau đầu và huyệt đặc hiệu</h3>
      
      <h4>Đau đầu trán:</h4>
      <p>Bấm: Ấn Đường + Hợp Cốc + Thái Dương</p>

      <h4>Đau đầu sau gáy:</h4>
      <p>Bấm: Phong Trì + Thiên Trụ + Bách Hội</p>

      <h4>Đau nửa đầu (migraine):</h4>
      <p>Bấm: Thái Dương + Hợp Cốc + Phong Trì</p>

      <h4>Đau đầu đỉnh:</h4>
      <p>Bấm: Bách Hội + Phong Trì + Hợp Cốc</p>

      <h3>Nguyên tắc bấm huyệt hiệu quả</h3>
      <ul>
        <li><strong>Tìm đúng vị trí:</strong> Huyệt thường ở chỗ lõm, khi bấm có cảm giác đau tê</li>
        <li><strong>Lực bấm:</strong> Từ nhẹ đến mạnh, chịu được nhưng hơi đau</li>
        <li><strong>Thời gian:</strong> 2-5 phút mỗi huyệt</li>
        <li><strong>Tần suất:</strong> Có thể lặp lại 2-3 lần/ngày</li>
        <li><strong>Thời điểm:</strong> Ngay khi bắt đầu đau sẽ hiệu quả nhất</li>
      </ul>

      <h3>Lưu ý quan trọng</h3>
      <ul>
        <li>⚠️ Không bấm quá mạnh gây bầm tím</li>
        <li>⚠️ Phụ nữ có thai tránh bấm huyệt Hợp Cốc</li>
        <li>⚠️ Nếu đau đầu dữ dội, đột ngột cần đi khám ngay</li>
        <li>✅ Kết hợp với nghỉ ngơi, uống đủ nước</li>
        <li>✅ Tránh ánh sáng mạnh, tiếng ồn khi đau đầu</li>
      </ul>

      <h3>Kết luận</h3>
      <p>Bấm huyệt là phương pháp an toàn, hiệu quả giúp giảm đau đầu nhanh chóng. Tuy nhiên, nếu đau đầu thường xuyên hoặc dữ dội, bạn nên đi khám để tìm nguyên nhân và điều trị đúng cách.</p>
    `,
  },
];

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("id hehehe", id);

  // Find the blog post by ID
  const blog = sampleBlogs.find((b) => b.id === parseInt(id));

  // Get related blogs (same category, exclude current)
  const relatedBlogs = sampleBlogs
    .filter((b) => b.category === blog?.category && b.id !== blog?.id)
    .slice(0, 3);

  if (!blog) {
    return (
      <SiteLayout>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom, #ecfdf5 0%, #ffffff 100%)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "72px", marginBottom: "20px" }}>📄</div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "12px",
              }}
            >
              Không tìm thấy bài viết
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/blog")}
              style={{
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                borderColor: "#059669",
                height: "45px",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "10px",
              }}
            >
              ← Quay lại trang blog
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #ecfdf5 0%, #ffffff 100%)",
          paddingBottom: "60px",
        }}
      >
        {/* Back Button */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "30px 20px 0",
          }}
        >
          <Button
            onClick={() => navigate("/blog")}
            style={{
              border: "none",
              background: "white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              borderRadius: "10px",
              padding: "8px 20px",
              height: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#059669",
              fontWeight: "500",
            }}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            }
          >
            Quay lại
          </Button>
        </div>

        {/* Hero Image */}
        <div
          style={{
            maxWidth: "900px",
            margin: "20px auto",
            padding: "0 20px",
          }}
        >
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
              position: "relative",
              height: "450px",
            }}
          >
            <img
              src={blog.image}
              alt={blog.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "25px",
                fontSize: "15px",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
              }}
            >
              {blog.category}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 20px",
          }}
        >
          {/* Article Header */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              marginTop: "30px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#065f46",
                marginBottom: "24px",
                lineHeight: "1.3",
              }}
            >
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                alignItems: "center",
                paddingBottom: "24px",
                borderBottom: "2px solid #e5e7eb",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#059669",
                  fontWeight: "600",
                  fontSize: "15px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {blog.author}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {blog.date}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {blog.readTime}
              </div>
            </div>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "32px",
              }}
            >
              {blog.tags.map((tag) => (
                <Tag
                  key={tag}
                  style={{
                    background:
                      "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                    color: "#059669",
                    border: "1px solid #a7f3d0",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  #{tag}
                </Tag>
              ))}
            </div>

            {/* Article Content */}
            <div
              style={{
                fontSize: "17px",
                lineHeight: "1.8",
                color: "#374151",
              }}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <Divider style={{ margin: "40px 0" }} />

            {/* Share Section */}
            <div
              style={{
                background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #a7f3d0",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#065f46",
                  marginBottom: "12px",
                }}
              >
                📢 Bạn thấy bài viết hữu ích? Chia sẻ với bạn bè nhé!
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    background: "#1877f2",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Facebook
                </button>
                <button
                  style={{
                    background: "#0088cc",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Telegram
                </button>
                <button
                  style={{
                    background: "#25d366",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedBlogs.length > 0 && (
            <div style={{ marginTop: "60px" }}>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#065f46",
                  marginBottom: "30px",
                  textAlign: "center",
                }}
              >
                📚 Bài viết liên quan
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "24px",
                }}
              >
                {relatedBlogs.map((relatedBlog) => (
                  <div
                    key={relatedBlog.id}
                    onClick={() => {
                      navigate(`/blog/${relatedBlog.id}`);
                      window.scrollTo(0, 0);
                    }}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #e5e7eb",
                    }}
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
                    <div style={{ height: "180px", overflow: "hidden" }}>
                      <img
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div style={{ padding: "20px" }}>
                      <Tag
                        style={{
                          background: "#ecfdf5",
                          color: "#059669",
                          border: "1px solid #a7f3d0",
                          borderRadius: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        {relatedBlog.category}
                      </Tag>
                      <h3
                        style={{
                          fontSize: "17px",
                          fontWeight: "700",
                          color: "#065f46",
                          marginBottom: "8px",
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {relatedBlog.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                        }}
                      >
                        {relatedBlog.readTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global styles for blog content */}
      <style>{`
        .blog-content h2 {
          font-size: 28px;
          font-weight: 700;
          color: #065f46;
          margin-top: 40px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 3px solid #10b981;
        }
        .blog-content h3 {
          font-size: 22px;
          font-weight: 700;
          color: #059669;
          margin-top: 32px;
          margin-bottom: 16px;
        }
        .blog-content h4 {
          font-size: 19px;
          font-weight: 600;
          color: #047857;
          margin-top: 24px;
          margin-bottom: 12px;
        }
        .blog-content p {
          margin-bottom: 16px;
          line-height: 1.8;
        }
        .blog-content ul, .blog-content ol {
          margin: 20px 0;
          padding-left: 28px;
        }
        .blog-content li {
          margin-bottom: 12px;
          line-height: 1.7;
        }
        .blog-content strong {
          color: #059669;
          font-weight: 600;
        }
        .blog-content ul li::marker {
          color: #10b981;
        }
      `}</style>
    </SiteLayout>
  );
};

export default BlogDetail;
