import axios from "axios";

/**
 * Process a user query and get a response from the chatbot
 * @param {string} query - The user's query text
 * @param {string} userId - Optional user ID for personalized responses
 * @returns {Promise} - The response from the chatbot API
 */
export const processQuery = async (query, userId = null) => {
  try {
    // Gọi API backend để xử lý truy vấn
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL_BACKEND}/chatbot/process-query`,
      { query, userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    // Xử lý lỗi và định dạng thông báo lỗi để hiển thị cho người dùng
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi khi xử lý tin nhắn.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

/**
 * Get details of a specific book
 * @param {string} productId - The product/book ID
 * @returns {Promise} - The book details
 */
export const getBookDetails = async (productId) => {
  try {
    // Kiểm tra productId có được cung cấp không
    if (!productId) {
      throw new Error("Product ID is required");
    }

    // Gọi API để lấy thông tin chi tiết sách
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL_BACKEND}/chatbot/book-details/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    // Xử lý lỗi và định dạng thông báo lỗi
    if (error.response) {
      throw {
        message: error.response.data?.message || "Đã xảy ra lỗi khi lấy thông tin sách.",
      };
    } else {
      throw { message: "Không thể kết nối đến máy chủ." };
    }
  }
};

/**
 * Process query using Google Gemini API
 * Kết nối trực tiếp đến Google Gemini API để xử lý câu hỏi bằng AI
 * @param {string} query - The user's query text
 * @returns {Promise} - The response from Google Gemini API
 */
export const processGoogleAloudQuery = async (query) => {
  try {
    // Sử dụng API key từ biến môi trường hoặc key mặc định
    const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyBCMnBzmrxDbV--WttfdzxHKjx6nFUH-Ik';

    // Sử dụng model Gemini 1.5 Flash - phiên bản nhẹ và nhanh của Gemini
    const MODEL = 'gemini-1.5-flash-002';
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    console.log("Connecting to Google Gemini API with model:", MODEL);

    // Chuẩn bị prompt với hướng dẫn chi tiết cho AI
    // Prompt này chứa thông tin về cửa hàng, cách trả lời, dữ liệu sản phẩm
    // và các chủ đề mà AI có thể hỗ trợ
    const prompt = `
      Bạn là trợ lý AI "Jasmine" của hiệu sách trực tuyến BookStore. Bạn có các chức năng sau:

      1. Giúp khách hàng tìm sách:
         - Khi khách hỏi về một cuốn sách, tên tác giả, hoặc thể loại, hãy cung cấp thông tin và gợi ý truy cập đường dẫn:
         - Đường dẫn trang sản phẩm: http://localhost:3000/products
         - Nếu khách hỏi về sách cụ thể, hãy gợi ý "Bạn có thể xem chi tiết sách tại [đường dẫn]"

      2. Gợi ý sách tương tự:
         - Dựa trên thể loại, tác giả hoặc chủ đề mà khách hàng quan tâm
         - Giới thiệu 2-3 sách phù hợp với sở thích của khách hàng
         - Luôn gợi ý khách hàng truy cập trang sản phẩm để xem nhiều sách hơn

      3. Cung cấp thông tin về sách:
         - Nếu được hỏi về một cuốn sách cụ thể, cung cấp thông tin ngắn gọn về nội dung, tác giả, giá
         - Gợi ý đường dẫn chi tiết sản phẩm để khách hàng xem đánh giá và thông tin đầy đủ

      4. Thông tin về website BookStore Jasmine:
         - Địa chỉ: 123 Đường Sách, Quận 1, TP.HCM
         - Email: contact@jasminebooks.com
         - Hotline: 1900-6868
         - Giờ làm việc: 8:00 - 21:00 hàng ngày
         - Website: jasminebooks.com
         - Mạng xã hội: Facebook/Instagram: @JasmineBooks

      5. Chính sách mua hàng và vận chuyển:
         - Giao hàng miễn phí cho đơn từ 200.000 VNĐ
         - Đổi trả trong vòng 7 ngày nếu sách lỗi
         - Nhiều phương thức thanh toán: Thẻ tín dụng, chuyển khoản, COD
         - Thời gian giao hàng: 3-5 ngày trong nội thành, 5-7 ngày cho tỉnh thành khác

      6. các thể loại sản phẩm hiện có trong trang /products:
        - Văn học
        - Kinh tế
        - giáo dục
        - lịch sử
        - tiểu thuyết

      7. Thông tin thêm về cửa hàng:
       - địa chỉ: 6 Lê Văn Miến, Thảo Điền, Thủ Đức, Hồ Chí Minh
       -hotline: 0999.888.777
       -email: contact@bookstore.vn
         - BookStore Jasmine chuyên cung cấp sách trong và ngoài nước
         - Hơn 10.000 đầu sách thuộc nhiều thể loại: Văn học, Kinh tế, Tâm lý, Kỹ năng sống...
         - Không gian đọc sách thoải mái tại cửa hàng với khu cà phê sách
         - Tổ chức các buổi giao lưu tác giả và ra mắt sách hàng tháng

      8.một số sản phẩm của cửa hàng:
       - thể loại kinh tế:
           + tên Bất động sản: giá 120000vnđ
           + NỀN KINH TẾ VẬN HÀNH : 170000vnđ
           +LƯỢC SỬ KINH TẾ HỌC: 70000vnđ
           +KẾ TOÁN TÀI CHÍNH: 40000vnđ
       - thể loại văn học:
           +Chí Phèo: 80000
           + Dế mèn phiêu lưu ký: 120000
           +TẮT ĐÈN: 80000
           +NHỮNG NGƯỜI KHỐN KHỔ: 80000
           +Số đỏ: 120000
       - thể loại lịch sử:
          +ĐẠI VIỆT SỬ KÝ TOÀN THƯ 150000
          +LỊCH SỬ THẾ GIỚI: 80000
          +PYOTR - ĐẠI ĐẾ: 160000
          +LỊCH SỬ ĐẢNG CỘNG SẢN VN:85000
       - thể loại tiểu thuyết:
       - thể loại giáo dục:
         +Giáo dục thể chất: 770000vnd
         +MĨ THUẬT: 55000vnd
         +LỊCH SỬ và ĐỊA LÍ: 60000
         +TRIẾT HỌC: 130000
    9. nếu các thông khác về sách chưa được tôi cung cấp, bạn có thể search theo công nghệ AI của bạn


      Khi trả lời khách hàng:
      - Luôn trả lời bằng tiếng Việt thân thiện, ngắn gọn và đầy đủ thông tin
      - Khi khách hỏi về sách, luôn gợi ý đường dẫn đến trang sản phẩm hoặc chi tiết sản phẩm
      - Nếu không biết thông tin về một cuốn sách cụ thể, gợi ý khách hàng tìm kiếm trên trang sản phẩm của website
      - Nếu khách hỏi về chủ đề không liên quan đến hiệu sách, vẫn trả lời thân thiện và hữu ích

      Câu hỏi của khách hàng: ${query}
    `;

    // Log request để debug
    console.log("Sending request to Gemini API with query:", query);

    // Cấu trúc request gửi đến API Gemini
    const apiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,  // Độ sáng tạo của câu trả lời (0-1)
        maxOutputTokens: 800,  // Giới hạn độ dài output
      }
    };

    // Gửi request đến API Gemini
    const response = await axios.post(
      API_URL,
      apiRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Log thành công
    console.log("Received successful response from Gemini API");

    // Trích xuất text phản hồi từ cấu trúc response của Gemini API
    // Cấu trúc này đặc thù cho API Gemini và cần nhiều bước kiểm tra
    let responseText = '';
    if (response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]) {
      responseText = response.data.candidates[0].content.parts[0].text;
      console.log("Successfully extracted response text from Gemini API");
    } else {
      console.error("Response format unexpected:", JSON.stringify(response.data, null, 2));
      throw new Error('Không tìm thấy nội dung phản hồi từ API');
    }

    // Trả về kết quả theo định dạng chuẩn của ứng dụng
    return {
      status: "OK",
      message: responseText,
      data: null
    };
  } catch (error) {
    // Xử lý lỗi chi tiết
    console.error("Error in Google Gemini API call:", error);

    // Log chi tiết để debug
    if (error.response) {
      console.error("API response error status:", error.response.status);
      console.error("API response error data:", JSON.stringify(error.response.data, null, 2));

      // Kiểm tra các loại lỗi cụ thể
      if (error.response.status === 400) {
        console.error("Bad request - Check API key and request format");
      } else if (error.response.status === 401) {
        console.error("Unauthorized - Check API key validity");
      } else if (error.response.status === 404) {
        console.error("Not found - The specified model may not exist or is inaccessible");
      }
    } else if (error.request) {
      console.error("No response received from API");
    }

    // Ném ra lỗi cho component gọi để xử lý
    throw {
      message: "Đã xảy ra lỗi khi kết nối đến Google Gemini API. Vui lòng kiểm tra kết nối mạng và thử lại sau."
    };
  }
};