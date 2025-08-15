# BookStore - Hệ Thống Quản Lý và Bán Sách Trực Tuyến

## Giới Thiệu
BookStore là một ứng dụng web hiện đại được xây dựng để quản lý và bán sách trực tuyến. Dự án được phát triển với kiến trúc microservices, sử dụng MERN Stack (MongoDB, Express.js, React.js, Node.js) để tạo ra một trải nghiệm người dùng mượt mà và hiệu quả.

## Tính Năng Chính

### Cho Người Dùng
- Đăng ký và đăng nhập tài khoản
- Tìm kiếm sách theo nhiều tiêu chí (tên, tác giả, thể loại)
- Xem chi tiết sách (mô tả, giá, đánh giá)
- Thêm sách vào giỏ hàng
- Thanh toán trực tuyến
- Theo dõi đơn hàng
- Đánh giá và bình luận về sách
- Quản lý thông tin cá nhân

### Cho Quản Trị Viên
- Quản lý danh mục sách
- Thêm, sửa, xóa sách
- Quản lý đơn hàng
- Thống kê doanh thu
- Quản lý người dùng
- Quản lý khuyến mãi

## Công Nghệ Sử Dụng

### Frontend
- React.js - Thư viện JavaScript cho giao diện người dùng
- Redux - Quản lý state
- React Router - Điều hướng
- Axios - Gọi API
- Material-UI - Framework UI
- Styled Components - CSS-in-JS
- React Hook Form - Xử lý form
- JWT - Xác thực người dùng

### Backend
- Node.js - Runtime JavaScript
- Express.js - Framework web
- MongoDB - Cơ sở dữ liệu NoSQL
- Mongoose - ODM cho MongoDB
- JWT - Xác thực và phân quyền
- Bcrypt - Mã hóa mật khẩu
- Express Validator - Validation dữ liệu
- Multer - Upload file
- Nodemailer - Gửi email

## Cấu Trúc Dự Án

### Frontend (`jasmine---FE/`)
```
src/
├── assets/         # Hình ảnh, fonts, và tài nguyên tĩnh
├── components/     # Các component tái sử dụng
├── context/        # React Context
├── hooks/          # Custom React Hooks
├── pages/          # Các trang chính của ứng dụng
├── redux/          # Redux store, actions, reducers
├── routes/         # Cấu hình routing
├── services/       # API services
├── styles/         # Global styles và themes
└── utils/          # Các hàm tiện ích
```

### Backend (`jasmine---BE/`)
```
src/
├── config/         # Cấu hình ứng dụng
├── controllers/    # Xử lý logic nghiệp vụ
├── Helper/         # Các hàm tiện ích
├── middleware/     # Middleware Express
├── models/         # Schema MongoDB
├── routes/         # Định nghĩa API endpoints
├── services/       # Business logic
└── validators/     # Validation schemas
```

## Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- Node.js (v14 trở lên)
- MongoDB
- npm hoặc yarn

### Frontend
```bash
cd jasmine---FE
npm install
npm start
```

### Backend
```bash
cd jasmine---BE
npm install
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Đăng ký
- POST /api/auth/login - Đăng nhập
- GET /api/auth/profile - Lấy thông tin người dùng

### Books
- GET /api/books - Lấy danh sách sách
- GET /api/books/:id - Lấy chi tiết sách
- POST /api/books - Thêm sách mới (Admin)
- PUT /api/books/:id - Cập nhật sách (Admin)
- DELETE /api/books/:id - Xóa sách (Admin)

### Orders
- POST /api/orders - Tạo đơn hàng mới
- GET /api/orders - Lấy danh sách đơn hàng
- GET /api/orders/:id - Lấy chi tiết đơn hàng
- PUT /api/orders/:id - Cập nhật trạng thái đơn hàng

## Bảo Mật
- Xác thực JWT
- Mã hóa mật khẩu với bcrypt
- CORS protection
- Rate limiting
- Input validation
- Sanitization

## Tối Ưu Hóa
- Lazy loading
- Code splitting
- Caching
- Image optimization
- Performance monitoring

## Đóng Góp
Mọi đóng góp đều được hoan nghênh. Vui lòng tạo issue hoặc pull request để đóng góp vào dự án.

## Giấy Phép
MIT License