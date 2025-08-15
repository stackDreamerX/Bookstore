import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogPageAdmin.css';
import { Table, Button, Modal, Pagination } from 'react-bootstrap';
import { FaEye, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import AddBtn from '../../../../components/AddBtn(+)/AddBtn';

const BlogPageAdmin = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  // Fetch blogs function
  const fetchBlogs = async (page = 0, limit = 10) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.error("Access token is missing");
        alert("Bạn cần đăng nhập để xem danh sách blog");
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/blog/get-all-blogs?page=${page}&limit=${limit}`,
        {
          headers: { token: `Bearer ${token}` }
        }
      );

      if (response.data.status === "OK") {
        setBlogs(response.data.data || []);
        setCurrentPage(page);
        setTotalPages(response.data.totalPages || 0);
      } else {
        console.error("Failed to fetch blogs:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle blog detail view
  const handleViewDetail = (blogId) => {
    navigate(`/admin/blog-detail/${blogId}`);
  };

  // Handle edit blog
  const handleEditBlog = (blogId) => {
    navigate(`/admin/blog/edit-blog/${blogId}`);
  };

  // Handle add new blog
  const handleAddBlog = () => {
    navigate('/admin/blog/add-blog');
  };

  // Handle toggle blog status
  const handleToggleStatus = async (blogId, currentStatus) => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này');
        return;
      }

      const response = await axios.patch(
        `http://localhost:3001/api/blog/update-status-blog/${blogId}`,
        { isActive: !currentStatus },
        {
          headers: { token: `Bearer ${token}` }
        }
      );

      if (response.data.status === "OK") {
        // Update blog status in the local state
        setBlogs(blogs.map(blog =>
          blog._id === blogId ? { ...blog, isActive: !currentStatus } : blog
        ));
        alert(currentStatus ? 'Đã ẩn bài viết' : 'Đã hiển thị bài viết');
      } else {
        alert(response.data.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error("Error updating blog status:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Lỗi: ${error.response.data.message || 'Có lỗi xảy ra khi cập nhật trạng thái'}`);
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    }
  };

  // Handle delete blog - show confirm modal
  const confirmDeleteBlog = (blogId) => {
    setSelectedBlogId(blogId);
    setShowModal(true);
  };

  // Handle delete blog - perform delete
  const handleDeleteBlog = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        alert('Bạn cần đăng nhập để thực hiện chức năng này');
        return;
      }

      console.log("Deleting blog with ID:", selectedBlogId);
      console.log("Using token:", token);

      const response = await axios.delete(
        `http://localhost:3001/api/blog/delete-blog/${selectedBlogId}`,
        {
          headers: { token: `Bearer ${token}` }
        }
      );

      console.log("Delete response:", response.data);

      if (response.data.status === "OK") {
        // Remove blog from the local state
        setBlogs(blogs.filter(blog => blog._id !== selectedBlogId));
        setShowModal(false);
        setSelectedBlogId(null);
        alert('Xóa bài viết thành công');
      } else {
        alert(response.data.message || 'Có lỗi xảy ra khi xóa bài viết');
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        alert(`Lỗi: ${error.response.data.message || 'Có lỗi xảy ra khi xóa bài viết'}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert('Không thể kết nối đến server');
      } else {
        console.error("Error message:", error.message);
        alert(`Lỗi: ${error.message}`);
      }
      setShowModal(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="blog-page-admin container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="admin-title">Quản lý Blog</h1>
        <AddBtn path="/admin/blog/add-blog" text="Thêm blog" />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Hình ảnh</th>
                <th>Ngày tạo</th>
                <th>Lượt xem</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => {
                // Process image URL if needed
                const imageUrl = blog.blogImage.startsWith("http")
                  ? blog.blogImage
                  : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${blog.blogImage.replace("\\", "/")}`;

                return (
                  <tr key={blog._id}>
                    <td>{currentPage * 10 + index + 1}</td>
                    <td>{truncateText(blog.blogTitle, 30)}</td>
                    <td>
                      <img
                        src={imageUrl}
                        alt={blog.blogTitle}
                        className="blog-thumbnail"
                      />
                    </td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td>{blog.viewCount}</td>
                    <td>
                      <span className={`status-badge ${blog.isActive ? 'active' : 'inactive'}`}>
                        {blog.isActive ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleViewDetail(blog._id)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEditBlog(blog._id)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant={blog.isActive ? "success" : "secondary"}
                          size="sm"
                          onClick={() => handleToggleStatus(blog._id, blog.isActive)}
                          title={blog.isActive ? "Ẩn bài viết" : "Hiển thị bài viết"}
                        >
                          {blog.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDeleteBlog(blog._id)}
                          title="Xóa bài viết"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {blogs.length === 0 && (
            <div className="text-center my-4">
              <p>Không có bài blog nào</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => fetchBlogs(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                />

                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => fetchBlogs(page)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next
                  onClick={() => fetchBlogs(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa bài blog này? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteBlog}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlogPageAdmin;