import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Badge, Card, ListGroup } from 'react-bootstrap';
import { FaEye, FaCalendarAlt, FaUser, FaArrowLeft, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './BlogDetailAdmin.css';

const BlogDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blog details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        const response = await axios.get(
          `http://localhost:3001/api/blog/get-detail-blog/${id}`,
          {
            headers: { token: `Bearer ${token}` }
          }
        );

        if (response.data.status === "OK") {
          setBlog(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch blog details");
        }
      } catch (error) {
        setError("Error fetching blog details: " + error.message);
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('access_token');

        console.log("Admin - Fetching comments with token:", token ? "YES" : "NO");

        const response = await axios.get(
          `http://localhost:3001/api/blog/get-blog-comments/${id}`,
          {
            headers: { token: `Bearer ${token}` }
          }
        );

        if (response.data.status === "OK") {
          console.log("Admin - Fetched comments data:", response.data.data);

          // Debug first comment if exists
          if (response.data.data && response.data.data.length > 0) {
            const firstComment = response.data.data[0];
            console.log("Admin - First comment:", firstComment);
            console.log("Admin - First comment user:", firstComment.user);
            if (firstComment.user) {
              console.log("Admin - User properties:", Object.keys(firstComment.user));
              console.log("Admin - User name value:", firstComment.user.userName);
            }
          }

          setComments(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  // Get appropriate user name from user object
  const getUserName = (user) => {
    if (!user) return 'Anonymous';

    // User object might have userName instead of name
    if (user.userName) return user.userName;

    // Fallbacks
    if (user.name) return user.name;
    if (user.userEmail) return user.userEmail.split('@')[0];
    if (user.email) return user.email.split('@')[0];

    // Last resort
    return user._id ? `User-${user._id.toString().substring(0, 5)}` : 'Anonymous';
  };

  // Handle edit blog
  const handleEditBlog = () => {
    navigate(`/admin/blog/edit-blog/${id}`);
  };

  // Handle delete blog
  const handleDeleteBlog = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài blog này? Thao tác này không thể hoàn tác.')) {
      try {
        const token = localStorage.getItem('access_token');

        const response = await axios.delete(
          `http://localhost:3001/api/blog/delete-blog/${id}`,
          {
            headers: { token: `Bearer ${token}` }
          }
        );

        if (response.data.status === "OK") {
          navigate('/admin/blogs');
        } else {
          alert(response.data.message || 'Có lỗi xảy ra khi xóa bài viết');
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert('Có lỗi xảy ra khi xóa bài viết');
      }
    }
  };

  // Handle toggle blog status (active/inactive)
  const handleToggleStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.patch(
        `http://localhost:3001/api/blog/update-status-blog/${id}`,
        { isActive: !blog.isActive },
        {
          headers: { token: `Bearer ${token}` }
        }
      );

      if (response.data.status === "OK") {
        // Update blog status in the local state
        setBlog({
          ...blog,
          isActive: !blog.isActive
        });
      } else {
        alert(response.data.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error("Error updating blog status:", error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  // Go back to blog list
  const handleGoBack = () => {
    navigate('/admin/blogs');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <h2>Error</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={handleGoBack}>
          <FaArrowLeft /> Back to Blogs
        </Button>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="text-center py-5">
        <h2>Blog not found</h2>
        <Button variant="primary" onClick={handleGoBack}>
          <FaArrowLeft /> Back to Blogs
        </Button>
      </Container>
    );
  }

  // Process image URL if needed
  const imageUrl = blog.blogImage.startsWith("http")
    ? blog.blogImage
    : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${blog.blogImage.replace("\\", "/")}`;

  return (
    <Container className="blog-detail-admin py-4">
      <Row className="mb-4">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={handleGoBack}
            className="back-button"
          >
            <FaArrowLeft /> Quay lại
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h1>{blog.blogTitle}</h1>
          <div className="admin-actions">
            <Button
              variant="warning"
              onClick={handleEditBlog}
              className="me-2"
            >
              <FaEdit /> Chỉnh sửa
            </Button>
            <Button
              variant={blog.isActive ? "success" : "secondary"}
              onClick={handleToggleStatus}
              className="me-2"
            >
              {blog.isActive ? <><FaToggleOn /> Đang hiển thị</> : <><FaToggleOff /> Đang ẩn</>}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBlog}
            >
              <FaTrash /> Xóa
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={6}>
              <div className="blog-meta">
                <div className="meta-item">
                  <FaUser />
                  <span>Tác giả: {blog.author?.userName || blog.author?.name || 'Admin'}</span>
                </div>
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>Ngày tạo: {formatDate(blog.createdAt)}</span>
                </div>
                <div className="meta-item">
                  <FaEye />
                  <span>Lượt xem: {blog.viewCount}</span>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <Badge
                bg={blog.isActive ? "success" : "secondary"}
                className="status-badge"
              >
                {blog.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
              </Badge>
            </Col>
          </Row>

          <div className="blog-image-container">
            <img src={imageUrl} alt={blog.blogTitle} className="blog-image" />
          </div>

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.blogContent }}></div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="mb-0">Bình luận ({comments.length})</h3>
        </Card.Header>
        <Card.Body>
          <div className="comments-section">
            {comments.length > 0 ? (
              <ListGroup variant="flush">
                {comments.map((comment) => (
                  <ListGroup.Item key={comment._id}>
                    <div className="d-flex justify-content-between">
                      <h6><FaUser /> {getUserName(comment.user)}</h6>
                      <small className="text-muted">{formatDate(comment.createdAt)}</small>
                    </div>
                    <p>{comment.content}</p>
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="replies-section">
                        {comment.replies.map((reply) => (
                          <ListGroup.Item key={reply._id} className="reply-item">
                            <div className="d-flex justify-content-between">
                              <h6><FaUser /> {getUserName(reply.user)}</h6>
                              <small className="text-muted">{formatDate(reply.createdAt)}</small>
                            </div>
                            <p>{reply.content}</p>
                          </ListGroup.Item>
                        ))}
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-center">Chưa có bình luận nào</p>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogDetailAdmin;