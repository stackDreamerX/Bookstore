import React, { useEffect, useRef, useState } from "react";
import styles from "./HeaderComponent.module.css";
import img from "../../assets/img/jasmine.png";
import SearchBoxComponent from "../SearchBoxComponent/SearchBoxComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ButtonNoBGComponent from "../ButtonNoBGComponent/ButtonNoBGComponent";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import SideMenuComponent from "../SideMenuComponent/SideMenuComponent";
import * as UserService from "../../services/UserService";
import { useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import UserIconComponent from "../UserIconComponent/UserIconComponent";
import CartIconComponent from "../CartIconComponent/CartIconComponent";
import VoiceComponent from "../VoiceComponent/VoiceComponent";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLoading, setShowLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigationLogin = () => {
    navigate("/login");
  };
  const handleClickCart = () => {
    navigate("/cart");
  };

  // const { user, logout } = useAuth();

  const user = useSelector((state) => state.user);
  // console.log("user", user);

  //Lấy số lượng sản phẩm trong giỏ
  const cartItems = useSelector((state) => state.cart.products);
  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  ); // Tính tổng số lượng sản phẩm

  const handleLogout = async () => {
    setShowLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    // console.log(
    //   "Access token after removal:",
    //   localStorage.getItem("access-token")
    // ); // Kiểm tra xem token đã bị xóa chưa
    dispatch(resetUser());
    setShowLoading(false);
    handleNavigationLogin();
  };

  useEffect(() => {
    setShowLoading(true);
    setUserName(user?.userName);
    setShowLoading(false);
  }, [user?.userName, user?.userImage]);

  //Click Search
  const handleSearch = (query) => {
    if (!query.trim()) {
      alert("Vui lòng nhập từ khóa để tìm kiếm!");
      return;
    }
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = () => {
    handleSearch(searchQuery);
  };

  // Handle enter key press in search box
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleUserInfo = () => {
    navigate("/profile"); // Navigate to user information page
  };

  //Voice search
  const handleVoiceInput = (speechResult) => {
    if (speechResult.trim()) {
      setSearchQuery(speechResult); // Update search input with voice result
      setTimeout(() => handleSearch(speechResult.trim()), 200);
    }
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="d-flex flex-column">
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleUserInfo}
          >
            Thông tin người dùng
          </SideMenuComponent>
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleLogout}
          >
            Đăng xuất
          </SideMenuComponent>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="bg-white sticky-top bg-shadow">
      <div
        className="container-xl text-center "
        style={{ width: "width-screen" }}
      >
        <div className={styles.navbar}>
          <div className="container-fluid">
            {/* nav top */}
            <div className="row">
              <div className="col">
                <a className="navbar-brand" href="/">
                  <img src={img} alt="Jasmine" className="navbar__img" />
                </a>
              </div>
              <div className={`col ${styles.navbar__search__form}`}>
                {/* New styled search container */}
                <div className={styles.search_container}>
                  <input
                    type="search"
                    placeholder="Nhập tên sản phẩm..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                  />
                  <VoiceComponent
                    onVoiceInput={handleVoiceInput}
                    className="voice-component"
                  />
                  <button className={styles.search_button} onClick={handleSearchSubmit}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className={`col ${styles.nav__cart}`}>
                {user?.isAdmin === false && (
                  <div className={styles.cart__icon__wrapper}>
                    <CartIconComponent onClick={handleClickCart} />
                    {cartQuantity > 0 && (
                      <span className={styles.cart__quantity}>
                        {cartQuantity}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={`col text-end ${styles.btn__container}`}>
                <Loading isLoading={showLoading} />
                {!showLoading && user?.isLoggedIn ? (
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={popover}
                  >
                    <div className={styles.user__icon}>
                      {userImage ? (
                        <img
                          src={userImage}
                          alt="avatar"
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <UserIconComponent />
                      )}
                      <span style={{ color: "var(--brown100)" }}>
                        {user.userName || user.userEmail || "User"}
                      </span>
                    </div>
                  </OverlayTrigger>
                ) : (
                  <div className="d-flex gap-2">
                    <Link to="/signup" className={styles.btn__signup}>
                      Đăng kí
                    </Link>
                    <div className={styles.btn__signup}>
                      <ButtonComponent onClick={handleNavigationLogin}>
                        Đăng nhập
                      </ButtonComponent>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* nav bottom */}
            <div className={`row ${styles.nav__bot}`}>
              <div className={styles.nav__content}>
                {/* nav admin */}
                {user?.isAdmin ? (
                  <>
                    <ButtonNoBGComponent to="/">Trang chủ</ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/products">
                      Sản phẩm
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/news" style={{ display: 'none' }}>
                      Tin tức
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/blogs">
                      Blog
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/introduce">
                      Giới thiệu
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/introduce">
                      Liên hệ
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/admin/store-info">
                      Quản lí
                    </ButtonNoBGComponent>
                  </>
                ) : (
                  // nav user
                  <>
                    <ButtonNoBGComponent to="/">Trang chủ</ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/products">
                      Sản phẩm
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/news" style={{ display: 'none' }}>
                      Tin tức
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/blogs">
                      Blog
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/introduce">
                      Giới thiệu
                    </ButtonNoBGComponent>
                    <ButtonNoBGComponent to="/contact">
                      Liên hệ
                    </ButtonNoBGComponent>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
