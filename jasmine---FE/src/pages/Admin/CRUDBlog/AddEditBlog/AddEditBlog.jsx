import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Image, Card } from 'react-bootstrap';
import { FaArrowLeft, FaSave, FaImage } from 'react-icons/fa';
import './AddEditBlog.css';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const AddEditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    blogTitle: '',
    blogContent: '',
  });

  const [blogImage, setBlogImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Fetch blog details if in edit mode
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      fetchBlogDetails();
    }
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      console.log('Token for fetching blog details:', token);

      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện chức năng này');
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/blog/get-detail-blog/${id}`,
        {
          headers: {
            token: `Bearer ${token}`
          }
        }
      );

      console.log('Blog details response:', response.data);

      if (response.data.status === "OK") {
        const blog = response.data.data;
        setFormData({
          blogTitle: blog.blogTitle || '',
          blogContent: blog.blogContent || '',
        });

        // Process image URL if exists
        if (blog.blogImage) {
          const imageUrl = blog.blogImage.startsWith("http")
            ? blog.blogImage
            : `http://localhost:3001/${blog.blogImage.replace(/\\/g, "/")}`;
          setPreviewImage(imageUrl);
        }
      } else {
        setError(response.data.message || "Không thể lấy thông tin blog");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin blog");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle rich text editor change
  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      blogContent: content
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBlogImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleChooseImage = () => {
    fileInputRef.current.click();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.blogTitle || !formData.blogContent) {
      setError('Vui lòng điền đầy đủ tiêu đề và nội dung blog');
      return;
    }

    if (!isEdit && !blogImage) {
      setError('Vui lòng chọn hình ảnh cho blog');
      return;
    }

    try {
      setSaving(true);
      console.log("Checking localStorage keys:", Object.keys(localStorage));
      const token = localStorage.getItem('access_token');
      console.log("Token from localStorage:", token);

      // Check if token exists but might be stored with a different key
      const access_token = localStorage.getItem('access_token');
      console.log("Alternative token from localStorage:", access_token);

      const tokenToUse = token || access_token;
      console.log("Token that will be used:", tokenToUse);

      if (!tokenToUse) {
        setError('Bạn cần đăng nhập để thực hiện chức năng này');
        return;
      }

      // Create form data for the request
      const formDataToSend = new FormData();
      formDataToSend.append('blogTitle', formData.blogTitle);
      formDataToSend.append('blogContent', formData.blogContent);

      if (blogImage) {
        formDataToSend.append('blogImage', blogImage);
      }

      // Log the request configuration
      console.log("Request headers:", {
        token: `Bearer ${tokenToUse}`,
        'Content-Type': 'multipart/form-data'
      });
      console.log("Form data entries:", [...formDataToSend.entries()]);

      let response;

      if (isEdit) {
        // Update existing blog
        response = await axios.put(
          `http://localhost:3001/api/blog/update-blog/${id}`,
          formDataToSend,
          {
            headers: {
              token: `Bearer ${tokenToUse}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new blog
        console.log("Sending create blog request to:", 'http://localhost:3001/api/blog/create-blog');
        response = await axios.post(
          'http://localhost:3001/api/blog/create-blog',
          formDataToSend,
          {
            headers: {
              token: `Bearer ${tokenToUse}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      console.log("Server response:", response.data);

      if (response.data.status === "OK") {
        // Redirect to blog list after successful submission
        navigate('/admin/blogs');
      } else {
        setError(response.data.message || 'Có lỗi xảy ra khi lưu blog');
      }
    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error message:", error.message);
      setError('Có lỗi xảy ra khi lưu blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Go back to blog list
  const handleGoBack = () => {
    navigate('/admin/blogs');
  };

  return (
    <Container className="add-edit-blog py-4">
      <Row className="mb-4">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={handleGoBack}
            className="back-button"
          >
            <FaArrowLeft /> Quay lại
          </Button>
          <h1 className="mt-3">
            {isEdit ? 'Chỉnh sửa blog' : 'Thêm blog mới'}
          </h1>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Card className="mb-4">
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Tiêu đề blog</Form.Label>
                    <Form.Control
                      type="text"
                      name="blogTitle"
                      value={formData.blogTitle}
                      onChange={handleInputChange}
                      placeholder="Nhập tiêu đề blog..."
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nội dung blog</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={formData.blogContent}
                      onChange={handleEditorChange}
                      modules={modules}
                      placeholder="Viết nội dung blog của bạn ở đây..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-4">
                <Card.Body>
                  <Form.Group>
                    <Form.Label>Hình ảnh blog</Form.Label>
                    <div className="image-upload-container">
                      {previewImage ? (
                        <div className="preview-container mb-3">
                          <Image
                            src={previewImage}
                            alt="Blog preview"
                            className="preview-image"
                          />
                        </div>
                      ) : (
                        <div className="no-image-placeholder mb-3">
                          <FaImage size={48} />
                          <p>Chưa có hình ảnh</p>
                        </div>
                      )}
                      <Form.Control
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="d-none"
                        accept="image/*"
                      />
                      <Button
                        variant="outline-primary"
                        onClick={handleChooseImage}
                        className="w-100"
                      >
                        {previewImage ? 'Thay đổi hình ảnh' : 'Chọn hình ảnh'}
                      </Button>
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      {isEdit ? 'Cập nhật' : 'Thêm mới'}
                    </>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </Container>
  );
};

export default AddEditBlog;