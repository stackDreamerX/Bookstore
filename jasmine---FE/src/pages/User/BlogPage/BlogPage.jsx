import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogPage.css';
import CardBlog from '../../../components/CardBlog/CardBlog';
import { Pagination } from 'react-bootstrap';

const BlogPage = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch blogs function
  const fetchBlogs = async (page = 0, limit = 12) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await axios.get(
        `http://localhost:3001/api/blog/get-all-blogs?page=${page}&limit=${limit}`,
        {
          headers: token ? { token: `Bearer ${token}` } : {}
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
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle blog click to view details
  const handleBlogClick = (blogId) => {
    navigate(`/blog-detail/${blogId}`);
  };

  // Pagination component
  const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);

    return (
      <Pagination className="mt-4 justify-content-center">
        <Pagination.Prev
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        />

        {pages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        />
      </Pagination>
    );
  };

  return (
    <div className="blog-page container mt-5">
      <h1 className="text-center mb-5">Blog</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className="row">
            {blogs.map((blog) => {
              // Process image URL if needed
              const imageUrl = blog.blogImage.startsWith("http")
                ? blog.blogImage
                : `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${blog.blogImage.replace("\\", "/")}`;

              return (
                <div key={blog._id} className="col-md-4 mb-4">
                  <CardBlog
                    img={imageUrl}
                    title={blog.blogTitle}
                    content={blog.blogContent}
                    author={blog.author?.name || "Admin"}
                    date={new Date(blog.createdAt).toLocaleDateString()}
                    viewCount={blog.viewCount}
                    onClick={() => handleBlogClick(blog._id)}
                  />
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchBlogs(page)}
            />
          )}
        </>
      ) : (
        <div className="text-center">
          <p>Không có bài blog nào</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;