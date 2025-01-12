// authActions.js
import {
  fetchDocumentRequest,
  fetchDocumentSuccess,
  fetchDocumentFailure,
} from "./actions";
import { toast } from "react-toastify";

export const loginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const loginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
});

export const login = (email, password) => async (dispatch) => {
  dispatch({ type: "LOGIN_REQUEST" });
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid email or password");
    }

    const token = await response.text();
    localStorage.setItem("authToken", token);

    // Lấy thông tin người dùng
    const userInfoResponse = await fetch("http://localhost:8080/api/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new Error("Unable to fetch user info");
    }

    const userInfo = await userInfoResponse.json();
    localStorage.setItem("user", JSON.stringify(userInfo)); // Lưu thông tin người dùng vào localStorage

    // Kiểm tra trạng thái tài khoản
    if (!userInfo.enabled) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw new Error("Account is locked"); // Ghi chú: sẽ bị xử lý trong phần catch
    }

    dispatch(fetchUserInfo(token));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const fetchUserInfo = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token found.");

    const response = await fetch(`http://localhost:8080/api/user/me`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user information");
    }

    const userData = await response.json();
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: userData,
    });
    localStorage.setItem("user", JSON.stringify(userData));
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILURE",
      payload: error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  dispatch({ type: "LOGOUT" });
};

// export const register = (formData) => async (dispatch) => {
//   dispatch({ type: "REGISTER_REQUEST" });
//   try {
//     const response = await fetch("http://localhost:8080/api/auth/register", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(errorText || "Registration failed");
//     }

//     dispatch({
//       type: "REGISTER_SUCCESS",
//     });
//   } catch (error) {
//     console.error("Catch Error:", error);
//     dispatch({ type: "REGISTER_FAILURE", payload: error.message });
//     throw error; // Rethrow to catch in component
//   }
// };
export const register = (formData) => async (dispatch) => {
  dispatch({ type: "REGISTER_REQUEST" });
  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (errorText.includes("Identifier đã được sử dụng")) {
        throw new Error("Mã số đã tồn tại");
      }
      throw new Error(errorText || "Đăng ký thất bại");
    }

    dispatch({
      type: "REGISTER_SUCCESS",
    });
  } catch (error) {
    console.error("Catch Error:", error);
    dispatch({ type: "REGISTER_FAILURE", payload: error.message });
    throw error; // Rethrow to catch in component
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const contentType = response.headers.get("Content-Type");

    if (!response.ok) {
      let errorMessage = "Đã xảy ra lỗi khi gửi email.";

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        if (response.status === 404) {
          errorMessage = "Email chưa được đăng ký.";
        } else {
          errorMessage = errorData.message || errorMessage;
        }
      } else {
        errorMessage = await response.text();
      }

      throw new Error(errorMessage);
    }

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return response.text();
    }
  } catch (error) {
    throw error;
  }
};

export const changePassword =
  (oldPassword, newPassword, reNewPassword) => async (dispatch) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No authentication token found.");
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ oldPassword, newPassword, reNewPassword }),
        }
      );

      const contentType = response.headers.get("Content-Type");
      let responseBody;

      if (contentType && contentType.includes("application/json")) {
        responseBody = await response.json();
      } else {
        responseBody = await response.text(); // Handle non-JSON responses
      }

      if (!response.ok) {
        console.error("Error Response Body:", responseBody);
        throw new Error(responseBody || "Failed to change password");
      }

      return responseBody;
    } catch (error) {
      console.error("Change Password Error:", error);
      throw new Error(
        error.message || "An error occurred while changing the password"
      );
    }
  };

export const updateUser = (userId, userData) => async (dispatch) => {
  dispatch({ type: "UPDATE_USER_REQUEST" });

  try {
    const formData = new FormData();

    // Append user data to the FormData object
    for (const key in userData) {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    }

    const response = await fetch(`http://localhost:8080/api/user/update`, {
      method: "PUT",
      headers: {
        Authorization: `${localStorage.getItem("authToken")}`,
        // No need to set Content-Type header with FormData
      },
      body: formData,
    });

    // Handle the response based on its content type
    const contentType = response.headers.get("content-type");
    let responseBody;

    if (contentType && contentType.includes("application/json")) {
      // Parse JSON response
      responseBody = await response.json();
    } else {
      // Parse plain text response
      responseBody = await response.text();
    }

    if (response.ok) {
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: responseBody,
      });
    } else {
      throw new Error(
        responseBody.message || responseBody || "Something went wrong"
      );
    }

    return responseBody;
  } catch (error) {
    dispatch({
      type: "UPDATE_USER_FAILURE",
      payload: error.message,
    });
    throw error;
  }
};

export const fetchDocument = (id) => async (dispatch) => {
  dispatch(fetchDocumentRequest());

  try {
    const response = await fetch(`http://localhost:8080/api/documents/${id}`); // Update this URL as needed
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    dispatch(fetchDocumentSuccess(data));
  } catch (error) {
    dispatch(fetchDocumentFailure(error.message));
  }
};

// actions/authActions.js

export const FETCH_USER_DOCUMENTS_SUCCESS = "FETCH_USER_DOCUMENTS_SUCCESS";
export const FETCH_USER_DOCUMENTS_FAILURE = "FETCH_USER_DOCUMENTS_FAILURE";

export const fetchUserDocuments = () => async (dispatch) => {
  try {
    const response = await fetch("http://localhost:8080/api/documents", {
      headers: {
        Authorization: `${localStorage.getItem("authToken")}`,
      },
    });
    const data = await response.json();
    dispatch({
      type: FETCH_USER_DOCUMENTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_DOCUMENTS_FAILURE,
      payload: error,
    });
  }
};
