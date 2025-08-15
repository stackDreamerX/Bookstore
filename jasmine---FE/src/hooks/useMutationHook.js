import { useMutation } from "@tanstack/react-query";

export const useMutationHook = (funCallback) => {
  const mutation = useMutation({
    mutationFn: funCallback,
    onError: (error) => {
      console.error("Mutation error:", error);
      let errorMessage = "Đã xảy ra lỗi.";
      
      // Kiểm tra và hiển thị thông báo lỗi phù hợp
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.toString() !== '[object Object]') {
          errorMessage = error.toString();
        }
      }
      
      alert(errorMessage);
    },
  });
  return mutation;
};