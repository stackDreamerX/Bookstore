import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { FaEye, FaCalendarAlt, FaUser, FaArrowLeft, FaReply, FaArrowRight } from 'react-icons/fa';
import './BlogDetailPage.css';
import { useSelector } from 'react-redux';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);

  // Get user from redux store
  const user = useSelector((state) => state.user);
  const isLoggedIn = user?.isLoggedIn;

  // Fetch blog details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/blog/get-detail-blog/${id}`);

        if (response.data.status === "OK") {
          setBlog(response.data.data);
          // After fetching current blog, fetch the next blog
          fetchNextBlog(response.data.data);
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

  // Fetch the next blog
  const fetchNextBlog = async (currentBlog) => {
    try {
      // Get all blogs to find the next one
      const response = await axios.get(`http://localhost:3001/api/blog/get-all-blogs?limit=100&page=0`);

      if (response.data.status === "OK" && response.data.data.length > 0) {
        const blogs = response.data.data;
        // Find the index of the current blog
        const currentIndex = blogs.findIndex(blog => blog._id === currentBlog._id);

        // If current blog is found and it's not the last one, set the next blog
        if (currentIndex !== -1 && currentIndex < blogs.length - 1) {
          setNextBlog(blogs[currentIndex + 1]);
        } else if (blogs.length > 0) {
          // If it's the last blog, we can set the first blog as next (circular navigation)
          setNextBlog(blogs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching next blog:", error);
    }
  };

  // Handle navigation to next blog
  const handleNextBlog = () => {
    if (nextBlog) {
      navigate(`/blog-detail/${nextBlog._id}`);
    }
  };

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = token ? { token: `Bearer ${token}` } : {};

        console.log("Fetching comments with token:", token ? "YES" : "NO");

        const response = await axios.get(
          `http://localhost:3001/api/blog/get-blog-comments/${id}`,
          { headers }
        );

        if (response.data.status === "OK") {
          console.log("Fetched comments data:", response.data.data);

          // Debug first comment if exists
          if (response.data.data && response.data.data.length > 0) {
            const firstComment = response.data.data[0];
            console.log("First comment:", firstComment);
            console.log("First comment user:", firstComment.user);
            if (firstComment.user) {
              console.log("User properties:", Object.keys(firstComment.user));
              console.log("User name value:", firstComment.user.userName);
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

    // Debug user object
    console.log("Getting username for:", user);

    // User object might have userName instead of name
    if (user.userName) return user.userName;

    // Fallbacks
    if (user.name) return user.name;
    if (user.userEmail) return user.userEmail.split('@')[0];
    if (user.email) return user.email.split('@')[0];

    // Last resort
    return user._id ? `User-${user._id.toString().substring(0, 5)}` : 'Anonymous';
  };

  // Handle comment submission
  const handleCommentSubmit = async (e, parentCommentId = null) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để bình luận!');
      return;
    }

    const text = parentCommentId ? replyText : commentText;
    if (!text.trim()) {
      alert(parentCommentId ? 'Vui lòng nhập nội dung trả lời!' : 'Vui lòng nhập nội dung bình luận!');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
        return;
      }

      const requestData = {
        content: text.trim(),
        blog: id,
        ...(parentCommentId && { parentComment: parentCommentId })
      };

      const response = await axios.post(
        'http://localhost:3001/api/blog/add-comment',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            token: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === "OK") {
        if (parentCommentId) {
          // Update the comments list with the new reply
          setComments(comments.map(comment => {
            if (comment._id === parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), response.data.data]
              };
            }
            return comment;
          }));
          setReplyText('');
          setReplyingTo(null);
        } else {
          // Add new comment to the list
          setComments([response.data.data, ...comments]);
          setCommentText('');
        }
      } else {
        alert(response.data.message || 'Không thể thêm bình luận');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Có lỗi xảy ra khi gửi bình luận');
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Không tìm thấy bài viết</div>;

  const imageUrl = blog.blogImage || 'https://via.placeholder.com/800x400';
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-detail-page">
      <div className="blog-navigation">
        <Button
          variant="outline-primary"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Quay lại
        </Button>

        {nextBlog && (
          <Button
            variant="outline-primary"
            className="next-blog-button"
            onClick={handleNextBlog}
          >
            Bài viết tiếp theo <FaArrowRight />
          </Button>
        )}
      </div>

      <Row>
        <Col lg={12} className="blog-main">
          <div className="blog-header">
            <h1 className="blog-title">{blog.blogTitle}</h1>

            <div className="blog-meta">
              <span className="blog-author">
                <FaUser /> {blog.author?.userName || blog.author?.name || 'Admin'}
              </span>
              <span className="blog-date">
                <FaCalendarAlt /> {formatDate(blog.createdAt)}
              </span>
              <span className="blog-views">
                <FaEye /> {blog.viewCount} lượt xem
              </span>
            </div>
          </div>

          <div className="blog-image-container">
            <img src={imageUrl} alt={blog.blogTitle} className="blog-image" />
          </div>

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.blogContent }}></div>

          <div className="blog-comments mt-5">
            <h3>Bình luận ({comments.length})</h3>

            {isLoggedIn ? (
              <Form onSubmit={(e) => handleCommentSubmit(e)} className="comment-form mb-4">
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Viết bình luận của bạn..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" className="mt-2">
                  Gửi bình luận
                </Button>
              </Form>
            ) : (
              <div className="alert alert-info">
                Vui lòng <a href="/login">đăng nhập</a> để bình luận
              </div>
            )}

            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment._id} className="comment-thread">
                    <Card className="comment-card mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">
                            <FaUser /> {getUserName(comment.user)}
                          </h6>
                          <small className="text-muted">
                            {formatDate(comment.createdAt)}
                          </small>
                        </div>
                        <Card.Text>{comment.content}</Card.Text>
                        {isLoggedIn && (
                          <Button
                            variant="link"
                            className="reply-button"
                            onClick={() => handleReplyClick(comment._id)}
                          >
                            <FaReply /> Trả lời
                          </Button>
                        )}
                      </Card.Body>
                    </Card>

                    {/* Replies section */}
                    <div className="replies-section">
                      {comment.replies?.map((reply) => (
                        <Card key={reply._id} className="reply-card">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="mb-0">
                                <FaUser /> {getUserName(reply.user)}
                              </h6>
                              <small className="text-muted">
                                {formatDate(reply.createdAt)}
                              </small>
                            </div>
                            <Card.Text>{reply.content}</Card.Text>
                          </Card.Body>
                        </Card>
                      ))}

                      {/* Reply form */}
                      {replyingTo === comment._id && isLoggedIn && (
                        <Form onSubmit={(e) => handleCommentSubmit(e, comment._id)} className="reply-form">
                          <Form.Group>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              placeholder="Viết câu trả lời của bạn..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                          </Form.Group>
                          <Button type="submit" className="mt-2">
                            Gửi trả lời
                          </Button>
                        </Form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BlogDetailPage;