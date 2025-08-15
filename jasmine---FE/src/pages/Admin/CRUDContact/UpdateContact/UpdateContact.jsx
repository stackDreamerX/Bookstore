import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UpdateContact.css";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";

const UpdateContact = () => {
    const navigate = useNavigate();
    const { state: contactData } = useLocation();
    const [contact, setContact] = useState(
        contactData || {
            businessName: "",
            address: "",
            email: "",
            website: "",
            hotline: "",
            phone: "",
            serviceHotline: "",
            contactImage: null,
        }
    );

    const [imagePreview, setImagePreview] = useState(
        contact.contactImage || null
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContact({
            ...contact,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
            setContact({ ...contact, contactImage: file });
        }
    };

    const handleEditImage = () => {
        document.getElementById("imageInput").click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact data:", contact);
        // Thực hiện logic gửi dữ liệu liên hệ
        // Sau khi xử lý xong có thể chuyển hướng
        // navigate('/admin/contacts');
    };

    const handleCancel = () => {
        // Quay lại trang trước đó
        navigate(-1);
    };

    return (
        <div className="update-contact-container">
            <div className="container-xl update-contact">
                <h1 className="update-contact__title">THÔNG TIN LIÊN HỆ</h1>

                <form onSubmit={handleSubmit} className="update-contact__form">
                    <div className="update-contact__content">
                        <div className="contact-form-row">
                            {/* Bên trái - Form nhập thông tin */}
                            <div className="contact-form-column">
                                <div className="contact-field-group">
                                    <label className="contact-label">Tên doanh nghiệp:</label>
                                    <FormComponent
                                        name="businessName"
                                        value={contact.businessName}
                                        onChange={handleChange}
                                        placeholder="Nhập tên doanh nghiệp"
                                        className="full-width-input"
                                    />
                                </div>

                                <div className="contact-field-group">
                                    <label className="contact-label">Địa chỉ:</label>
                                    <FormComponent
                                        name="address"
                                        value={contact.address}
                                        onChange={handleChange}
                                        placeholder="Nhập địa chỉ"
                                        className="full-width-input"
                                    />
                                </div>

                                <div className="contact-field-group">
                                    <label className="contact-label">Email:</label>
                                    <FormComponent
                                        name="email"
                                        type="email"
                                        value={contact.email}
                                        onChange={handleChange}
                                        placeholder="Nhập email"
                                        className="full-width-input"
                                    />
                                </div>

                                <div className="contact-field-group">
                                    <label className="contact-label">Website:</label>
                                    <FormComponent
                                        name="website"
                                        value={contact.website}
                                        onChange={handleChange}
                                        placeholder="Nhập website"
                                        className="full-width-input"
                                    />
                                </div>

                                <div className="contact-field-group">
                                    <label className="contact-label">Hotline:</label>
                                    <FormComponent
                                        name="hotline"
                                        value={contact.hotline}
                                        onChange={handleChange}
                                        placeholder="Nhập hotline"
                                        className="full-width-input"
                                    />
                                </div>

                                <div className="contact-field-group">
                                    <label className="contact-label">Số điện thoại:</label>
                                    <FormComponent
                                        name="phone"
                                        value={contact.phone}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại"
                                        className="full-width-input"
                                    />
                                </div>

                                <div className="contact-field-group">
                                    <label className="contact-label">Hotline CSKH:</label>
                                    <FormComponent
                                        name="serviceHotline"
                                        value={contact.serviceHotline}
                                        onChange={handleChange}
                                        placeholder="Nhập hotline CSKH"
                                        className="full-width-input"
                                    />
                                </div>
                            </div>

                            {/* Bên phải - Logo doanh nghiệp */}
                            <div className="contact-form-column logo-column">
                                <div className="logo-container">
                                    <h3 className="logo-title">Logo doanh nghiệp</h3>
                                    <div className="contact__image-container" onClick={handleEditImage}>
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Logo doanh nghiệp"
                                                className="contact__image-preview"
                                            />
                                        ) : (
                                            <div className="contact__image-placeholder">
                                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M60 10H20C14.4772 10 10 14.4772 10 20V60C10 65.5228 14.4772 70 20 70H60C65.5228 70 70 65.5228 70 60V20C70 14.4772 65.5228 10 60 10Z" stroke="#3A060E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.2" fill="#3A060E"/>
                                                    <path d="M28.332 33.3333C31.0934 33.3333 33.332 31.0947 33.332 28.3333C33.332 25.5719 31.0934 23.3333 28.332 23.3333C25.5706 23.3333 23.332 25.5719 23.332 28.3333C23.332 31.0947 25.5706 33.3333 28.332 33.3333Z" stroke="#3A060E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M70.0013 50L53.3346 33.3333L20.0013 66.6667" stroke="#3A060E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                                <p>Chọn hình ảnh</p>
                                            </div>
                                        )}
                                        <input
                                            id="imageInput"
                                            className="contact__image"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            style={{ display: "none" }}
                                        />
                                        <div className="icon__update-image">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z" fill="#3A060E"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Các nút hành động */}
                    <div className="contact-action-buttons">
                        <ButtonComponent
                            type="submit"
                            className="update-button"
                        >
                            Cập nhật
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            onClick={handleCancel}
                            className="cancel-button"
                        >
                            Thoát
                        </ButtonComponent>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateContact;
