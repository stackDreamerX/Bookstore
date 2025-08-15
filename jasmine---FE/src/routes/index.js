import BlogPageAdmin from "../pages/Admin/CRUDBlog/BlogPage/BlogPageAdmin";
import AddEditBlog from "../pages/Admin/CRUDBlog/AddEditBlog/AddEditBlog";
import BlogDetailAdmin from "../pages/Admin/CRUDBlog/BlogDetailPage/BlogDetailAdmin";
import BlogPage from "../pages/User/BlogPage/BlogPage";
import BlogDetailPage from "../pages/User/BlogDetailPage/BlogDetailPage";
import ReportPage from "../pages/Admin/CRUDReport/ReportPage";
import DetailCategoryPage from "../pages/Admin/CRUDCategory/DetailCategoryPage/DetailCategoryPage";
import UpdateCategoryPage from "../pages/Admin/CRUDCategory/UpdateCategoryPage/UpdateCategoryPage";
import AddCategoryPage from "../pages/Admin/CRUDCategory/AddCategoryPage/AddCategoryPage";
import CategoryListPage from "../pages/Admin/CRUDCategory/CategoryListPage/CategoryListPage";
import UpdateStatusPage from "../pages/Admin/CRUDStatus/UpdateStatusPage/UpdateStatusPage";
import AddStatusPage from "../pages/Admin/CRUDStatus/AddStatusPage/AddStatusPage";
import StatusListPage from "../pages/Admin/CRUDStatus/StatusListPage/StatusListPage";
import AddDiscountPage from "../pages/Admin/CRUDDiscount/AddDiscountPage/AddDiscountPage";
import DiscountListPage from "../pages/Admin/CRUDDiscount/DiscountListPage/DiscountListPage";
import AddProductPage from "../pages/Admin/CRUDProduct/AddProductPage/AddProductPage";
import UpdateProductPage from "../pages/Admin/CRUDProduct/UpdateProductPage/UpdateProductPage";
import ViewProductDetailPage from "../pages/User/ProductDetail/ViewProductDetailPage";
import StoreInfoPage from "../pages/Admin/CRUDStoreInfo/StoreInfoPage";
import ForgotPassword from "../pages/ForgotPasswordPage/pages/EnterEmail";
import EnterNewPassword from "../pages/ForgotPasswordPage/pages/EnterNewPassword";
import EnterOTP from "../pages/ForgotPasswordPage/pages/EnterOTP";
import LogInPage from "../pages/LogInPage/LogInPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ContactPage from "../pages/User/ContactPage/ContactPage";
import HomePage from "../pages/User/HomePage/HomePage";
import IntroducePage from "../pages/User/IntroducePage/IntroducePage";
import NewsPage from "../pages/User/NewsPage/NewsPage";
import OrderPage from "../pages/User/OrderPage/OrderPage";
import ProductsPage from "../pages/User/ProductsPage/ProductsPage";
import UserInfoPage from "../pages/User/UserInfoPage/UserInfoPage";
import CartPage from "../pages/User/CartPage/CartPage";
import OrderInformationPage from "../pages/User/OrderInformationPage/OrderInformationPage";
import OrderHistoryPage from "../pages/User/OrderHistoryPage/OrderHistoryPage";
import OrderTrackingPage from "../pages/User/OrderHistoryPage/OrderTrackingPage";
import UserListPage from "../pages/Admin/CRUDUser/UserListPage/UserListPage";
import PaymentPage from "../pages/User/PaymentPage/PaymentPage";
import OrderDetailHistoryPage from "../pages/User/OrderDetailHistoryPage/OrderDetailHistoryPage";
import PaymentResult from "../pages/User/PaymentResult/PaymentResult";
import NewsPageAdmin from "../pages/Admin/CRUDNews/NewsPage/NewsPage";
import AddNews from "../pages/Admin/CRUDNews/AddNews/AddNews";
import UpdateStatus from "../pages/Admin/CRUDOrderStatus/UpdateStatus/UpdateStatus";
import ProductPageAdmin from "../pages/Admin/CRUDProduct/ProductPageAdmin/ProductPageAdmin";
import OrderListPage from "../pages/Admin/CRUDOrderStatus/OrderListPage/OrderListPage";
import OrderDetailPage from "../pages/Admin/CRUDOrderStatus/OrderDetailPage/OrderDetailPage";
import UpdateContact from "../pages/Admin/CRUDContact/UpdateContact/UpdateContact";
import AddUserPage from "../pages/Admin/CRUDUser/AddUserPage/AddUserPage";
import NewsDetailPage from "../pages/User/NewsDetailPage/NewsDetailPage";
import SearchResultPage from "../pages/SearchResultPage/SearchResultPage";
import NewsDetailPageAdmin from "../pages/Admin/CRUDNews/NewsDetailPageAdmin/NewsDetailPage";
import UserTab from "../pages/User/UserTab/UserTab.jsx";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/products",
    page: ProductsPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/introduce",
    page: IntroducePage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/signup",
    page: SignUpPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/login",
    page: LogInPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/forgot-password",
    page: ForgotPassword,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/forgot-password/enter-otp",
    page: EnterOTP,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/forgot-password/new-password",
    page: EnterNewPassword,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/profile",
    page: UserTab,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/user-info",
    page: UserInfoPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order-history",
    page: OrderHistoryPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order-tracking",
    page: OrderTrackingPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/order-detail-history/:orderId",
    page: OrderDetailHistoryPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/contact",
    page: ContactPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/news",
    page: NewsPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/blogs",
    page: BlogPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/blog-detail/:id",
    page: BlogDetailPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/blogs",
    page: BlogPageAdmin,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/blog/add-blog",
    page: AddEditBlog,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/blog/edit-blog/:id",
    page: AddEditBlog,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/blog-detail/:id",
    page: BlogDetailAdmin,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/add-product",
    page: AddProductPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true
  },
  {
    path: "/view-product-detail/",
    page: ViewProductDetailPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/admin/update-product",
    page: UpdateProductPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/store-info",
    page: StoreInfoPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/discount-list",
    page: DiscountListPage,
    isShowHeader: true,
    isShowFooter: true,

  },

  {
    path: "/admin/add-discount",
    page: AddDiscountPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/status-list",
    page: StatusListPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/add-status",
    page: AddStatusPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true
  },

  {
    path: "/admin/update-status",
    page: UpdateStatusPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/category-list",
    page: CategoryListPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/add-category",
    page: AddCategoryPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/update-category",
    page: UpdateCategoryPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/detail-category",
    page: DetailCategoryPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/report",
    page: ReportPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/cart",
    page: CartPage,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/order-information",
    page: OrderInformationPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/user-list",
    page: UserListPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/add-user",
    page: AddUserPage,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },

  {
    path: "/admin/order-list",
    page: OrderListPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/admin/order-detail/",
    page: OrderDetailPage,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },

  {
    path: "/payment",
    page: PaymentPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/payment/result",
    page: PaymentResult,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/news",
    page: NewsPageAdmin,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },
  {
    path: "/admin/news/add-news",
    page: AddNews,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },
  {
    path: "/admin/order-status/update",
    page: UpdateStatus,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true,
  },
  {
    path: "/admin/introduce",
    page: UpdateContact,
    isShowHeader: true,
    isShowFooter: true,
    // isPrivate: true,
  },
  {
    path: "/admin/products",
    page: ProductPageAdmin,
    isShowHeader: true,
    isShowFooter: true,
    isPrivate: true
  },
  {
    path: "*",
    page: NotFoundPage,
    isShowHeader: false,
    isShowFooter: false,
  },
  {
    path: "/news-detail",
    page: NewsDetailPage,
    isShowHeader: true,
    isShowFooter: true,
  },

  {
    path: "/admin/news-detail",
    page: NewsDetailPageAdmin,
    isShowHeader: true,
    isShowFooter: true,
  },
  {
    path: "/search",
    page: SearchResultPage,
    isShowHeader: true,
    isShowFooter: true,
  },
];
