import React, { useState, useEffect } from 'react'
import './AddNews.css'
import ButtonComponent from '../../../../components/ButtonComponent/ButtonComponent';
import * as NewsService from '../../../../services/NewsService'
import Loading from "../../../../components/LoadingComponent/Loading";
import { useNavigate } from "react-router-dom";
import { useMutationHook } from "../../../../hooks/useMutationHook";

const AddNews = () => {
    const [previewImage, setPreviewImage] = useState(null); // State để lưu URL của ảnh preview
    const accessToken = localStorage.getItem("access_token");
    const navigate = useNavigate();

    const [stateNews, setstateNews] = useState({
        newsTitle: "",
        newsContent: "",
        newsImage: null
    });

    //Thay doi content, title
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setstateNews({ ...stateNews, [e.target.name]: e.target.value });
    };
    //thay doi anh
    const handleChangeImg = (event) => {
        const file = event.target.files[0];
        setstateNews({ ...stateNews, newsImage: file })
        const previewUrl = URL.createObjectURL(file); // Tạo URL preview từ file
        setPreviewImage(previewUrl); // Cập nhật state previewImage
    };

    const mutation = useMutationHook(
        async (data) => {

            const response = await NewsService.createNews(data, accessToken);
            console.log("RESKLT", response);
            try {
                const result = await response;
                //console.log("RESKLT",result);
                if (result.status === "OK") {
                    alert("Thêm tin tức thành công!");
                    navigate('/admin/news')
                    // Reset form
                    //setProduct({productName: "", productPrice: "", productCategory:null, productImage:null, productSize:"" });
                } else {
                    alert(`Thêm tin tức thất bại: ${result.message}`);
                }
            } catch (error) {
                alert("Đã xảy ra lỗi khi thêm bánh!");
                console.error(error);
            }
            return response;
        }
    );
    const { data, isLoading, isSuccess, isError } = mutation;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("state", stateNews)
        const formData = new FormData();
        formData.append("newsTitle", stateNews.newsTitle);
        formData.append("newsContent", stateNews.newsContent);
        formData.append("newsImage", stateNews.newsImage);

        // Kiểm tra FormData
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const response = mutation.mutate(formData)
       
    };

    return (
        <div className='container-xl'>
            <h1 className='AddNewsTitle'>Thêm tin tức</h1>

            {/* ===================CONTENT============= */}
            <div className='firstClass-AddNews'>
                <div className='firstClass1'>
                    <p className='contentP'>Tiêu đề tin</p>
                </div>
                <div className='firstClass2'>
                    <p className='contentP'>Ảnh</p>
                </div>
            </div>
            <div className='flex-content'>
                {/* =========LEFT======== */}
                <div className='left-area'>
                    <div className='left-area-1'>
                        <input
                            style={{ width: "36rem", height: "6rem" }}
                            className="input-1"
                            placeholder="Nhập tiêu đề tin..."
                            name="newsTitle"
                            value={stateNews.newsTitle}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='left-area-2'>
                        <p className='contentP'>Nội dung tin:</p>
                    </div>
                    <div className='left-area-3'>
                        <textarea
                            className='input-2'
                            id="multiLineInput"
                            name="newsContent"
                            rows="5" // Số dòng hiển thị
                            cols="30" // Số cột hiển thị
                            value={stateNews.newsContent}
                            onChange={handleInputChange}
                            placeholder="Nhập nội dung tin..."
                        ></textarea>
                    </div>
                </div>
                {/* =========RIGHT========= */}
                <div className="addImageNews">
                    <input
                        // className="product__image"
                        type="file"
                        onChange={handleChangeImg}
                        accept="image/*"
                        required
                    />
                    <div className="news__image">
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="product-preview"
                                style={{
                                    width: "36rem",
                                    height: "40rem",
                                    borderRadius: "15px"
                                }}
                            />
                        )}
                    </div>
                    {/* <div className="icon__add-image-news">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                        >
                            <path
                                d="M17.4998 33.3332C17.4998 33.9962 17.7632 34.6321 18.2321 35.1009C18.7009 35.5698 19.3368 35.8332 19.9998 35.8332C20.6629 35.8332 21.2988 35.5698 21.7676 35.1009C22.2364 34.6321 22.4998 33.9962 22.4998 33.3332V22.4998H33.3332C33.9962 22.4998 34.6321 22.2364 35.1009 21.7676C35.5698 21.2988 35.8332 20.6629 35.8332 19.9998C35.8332 19.3368 35.5698 18.7009 35.1009 18.2321C34.6321 17.7632 33.9962 17.4998 33.3332 17.4998H22.4998V6.6665C22.4998 6.00346 22.2364 5.36758 21.7676 4.89874C21.2988 4.4299 20.6629 4.1665 19.9998 4.1665C19.3368 4.1665 18.7009 4.4299 18.2321 4.89874C17.7632 5.36758 17.4998 6.00346 17.4998 6.6665V17.4998H6.6665C6.00346 17.4998 5.36758 17.7632 4.89874 18.2321C4.4299 18.7009 4.1665 19.3368 4.1665 19.9998C4.1665 20.6629 4.4299 21.2988 4.89874 21.7676C5.36758 22.2364 6.00346 22.4998 6.6665 22.4998H17.4998V33.3332Z"
                                fill="#3A060E"
                            />
                        </svg>
                    </div> */}
                </div>
            </div>
            <div className='Button-area-addNews'>
                <div className='AddNewsBtn'>
                    <ButtonComponent onClick={handleSubmit}>Thêm tin tức</ButtonComponent>
                </div>
                <div className='Exit-AddNews'>
                    <ButtonComponent className='CustomBtn-Exit'
                        onClick={() => navigate("/admin/news")}>Thoát</ButtonComponent>
                </div>
            </div>
        </div>
    )
}

export default AddNews