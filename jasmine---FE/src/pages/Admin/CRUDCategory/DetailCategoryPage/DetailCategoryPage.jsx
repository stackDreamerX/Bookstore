import React from "react";
import "./DetailCategoryPage.css";
import SideMenuComponent from "../../../../components/SideMenuComponent/SideMenuComponent";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import book2 from "../../../../assets/img/book2.jpg";
import FormComponent from "../../../../components/FormComponent/FormComponent";

const DetailCategoryPage = () => {

  const promos = [
    {
      id: 1,
      img: 1,
      name: "Tiramisu trái cây lộn xộn",
      size: "23cm",
      price: "100,000 VND",
      expiryDate: "5/1/2024",
    },
    {
      id: 2,
      img: 1,
      name: "Tiramisu trái cây lộn xộn",
      size: "23cm",
      price: "100,000 VND",
      expiryDate: "5/1/2024",
    },
    {
      id: 3,
      img: 1,
      name: "Tiramisu trái cây lộn xộn",
      size: "23cm",
      price: "100,000 VND",
      expiryDate: "5/1/2024",
    },
  ];



  return (
    <div>
      <div className="container-xl">
        <div className="category-list__info">
          {/* side menu */}
          <div className="side-menu__category">
            <SideMenuComponent className="btn-menu">
              Thông tin cửa hàng
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu">Đơn hàng</SideMenuComponent>
            <SideMenuComponent className="btn-menu">
              Khuyến mãi
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu">
              Trạng thái
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu">
              Loại sản phẩm{" "}
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu">
              Danh sách người dùng
            </SideMenuComponent>
            <SideMenuComponent className="btn-menu">
              Thống kê
            </SideMenuComponent>
          </div>

          {/* category products */}
          <div className="category-list__content">
            {/* category detail */}
            <div className="detail-category__content">
              <div className="category__info">

                <div className="detail_category__title">
                  <label>Chi tiết loại bánh</label>
                </div>

                <div className="content">
                  <div className="content__item">
                    <label className="id__title">Mã loại bánh</label>
                    <FormComponent placeholder="C6"></FormComponent>
                  </div>
                  <div className="content__item" style={{ position: 'relative' }}>
                    <label className="name__title">Tên loại bánh</label>
                    <span
                      className="material-icons"
                      style={{
                        fontSize: '26px',
                        marginRight: "45px",
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        cursor: 'pointer'
                      }}
                    >edit
                    </span>
                    <FormComponent placeholder="Bánh mùa đông"></FormComponent>
                  </div>
                </div>
              </div>
            </div>
            <div className="category-list__action" style={{ position: 'relative' }}>
              <h2 className="category-list__title">Danh sách sản phẩm</h2>

              <span
                className="material-icons"
                style={{
                  fontWeight: 'bold',
                  fontSize: '36px',
                  marginTop: "10px",
                  marginRight: "100px",
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  cursor: 'pointer'
                }}
              >+
              </span>

              <span
                className="material-icons"
                style={{
                  fontSize: '26px',
                  marginTop: "20px",
                  marginRight: "40px",
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  cursor: 'pointer'
                }}
              >edit
              </span>

            </div>
            {/* table */}
            <div className="table-container">
              <table className="promo-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ảnh</th>
                    <th>Tên bánh</th>
                    <th>Kích thước</th>
                    <th>Giá</th>
                    <th>Hạn sử dụng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {promos.map((promo, index) => (
                    <tr
                      key={promo.id}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={book2}
                          alt={"Promp img"}
                          style={{ width: '60px', height: '60px' }}
                        />
                      </td>
                      <td>{promo.name}</td>
                      <td>{promo.size}</td>
                      <td>{promo.price}</td>
                      <td>{promo.expiryDate}</td>
                      <td>
                        <button className="delete-btn">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="24"
                            viewBox="0 0 19 24"
                            fill="none"
                          >
                            <path
                              d="M1.35714 21.3333C1.35714 22.8 2.57857 24 4.07143 24H14.9286C16.4214 24 17.6429 22.8 17.6429 21.3333V8C17.6429 6.53333 16.4214 5.33333 14.9286 5.33333H4.07143C2.57857 5.33333 1.35714 6.53333 1.35714 8V21.3333ZM17.6429 1.33333H14.25L13.2864 0.386667C13.0421 0.146667 12.6893 0 12.3364 0H6.66357C6.31071 0 5.95786 0.146667 5.71357 0.386667L4.75 1.33333H1.35714C0.610714 1.33333 0 1.93333 0 2.66667C0 3.4 0.610714 4 1.35714 4H17.6429C18.3893 4 19 3.4 19 2.66667C19 1.93333 18.3893 1.33333 17.6429 1.33333Z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="btn__update-category">
              <ButtonComponent>Lưu</ButtonComponent>
              <ButtonComponent>Thoát</ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCategoryPage;
