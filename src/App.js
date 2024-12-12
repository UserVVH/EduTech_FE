import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Home from "./layouts/Home";
import Admin from "./layouts/admin/HomeAdmin"; // Nhập Admin
import Register from "./layouts/Register";
import Login from "./layouts/Login";
import ForgotPassword from "./layouts/ForgotPassword";
import ChangePassword from "./layouts/ChangePassword";
import CreateDocuments from "./layouts/CreateDocuments";
import UpdateDocuments from "./layouts/UpdateDocuments";
import UpdateUser from "./layouts/UpdateUser";
import User from "./layouts/User";
import About from "./layouts/About";
import Detail from "./layouts/Detail";
import ListUser from "./layouts/ListUser";
import DetailSearch from "./layouts/DetailSearch";
import CategorySearch from "./layouts/CategorySearch";
import LiseDocumentCreate from "./layouts/LiseDocumentCreate";
import ListDocumentVerified from "./layouts/ListDocumentVerified";
import AdminManageUser from "./layouts/admin/AdminManageUser";
import AdminManageCategory from "./layouts/admin/AdminManageCategory";
import AdminAllDocument from "./layouts/admin/adminAllDocument";
import AdminWaitDocument from "./layouts/admin/AdminWaitDocument";
import AdminDocumentApproved from "./layouts/admin/AdminDocumentApproved";
import AdminCreateCategory from "./layouts/admin/AdminCreateCategory";
import AdminUpdateCategory from "./layouts/admin/AdminUpdateCategory";
import ListDocument from "./layouts/ListDocument";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"; // Import PrivateRoute
import AdminCreateDocument from "./layouts/admin/AdminCreateDocument";
import AdminUpdateDocument from "./layouts/admin/AdminUpdateDocument";
import AdminDetailDocument from "./layouts/admin/AdminDetailDocument";
import AdminListAllDocument from "./layouts/admin/AdminListAllDocument";
import { useDispatch } from "react-redux";
import AccountStatusChecker from "./Redux/AccountStatusChecker";
import ListDocumentVerifiedMy from "./layouts/ListDocumentVerifiedMy";
import ListDocumentCreateMy from "./layouts/ListDocumentCreateMy";
import AdminDocumentCancel from "./layouts/admin/AdminDocumentCancel";
import AdminListUser from "./layouts/admin/AdminListUser";
import AdminDetailUser from "./layouts/admin/AdminDetailUser";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Logic to fetch user info if needed can go here
    }
  }, [dispatch]);
  return (
    <Router>
      <AccountStatusChecker />
      <div className="App">
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRoute role="ADMIN">
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminManageUser"
            element={
              <PrivateRoute role="ADMIN">
                <AdminManageUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminAllDocument"
            element={
              <PrivateRoute role="ADMIN">
                <AdminAllDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminWaitDocument"
            element={
              <PrivateRoute role="ADMIN">
                <AdminWaitDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminDocumentApproved"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDocumentApproved />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminManageCategory"
            element={
              <PrivateRoute role="ADMIN">
                <AdminManageCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminCreateCategory"
            element={
              <PrivateRoute role="ADMIN">
                <AdminCreateCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminUpdateCategory/:id"
            element={
              <PrivateRoute role="ADMIN">
                <AdminUpdateCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminCreateDocument"
            element={
              <PrivateRoute role="ADMIN">
                <AdminCreateDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminDocumentCancel"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDocumentCancel />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminUpdateDocument/:documentId"
            element={
              <PrivateRoute role="ADMIN">
                <AdminUpdateDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminDetailDocument/documents/:id"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDetailDocument />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminListUser"
            element={
              <PrivateRoute role="ADMIN">
                <AdminListUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminDetailUser/admin/users/:id"
            element={
              <PrivateRoute role="ADMIN">
                <AdminDetailUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/adminListAllDocument/admin/documents/user/:userId/verified"
            element={
              <PrivateRoute role="ADMIN">
                <AdminListAllDocument />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <>
                <Navigation />
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/listDocument" element={<ListDocument />} />
                  <Route path="/forgotpassword" element={<ForgotPassword />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                  <Route
                    path="/createdocuments"
                    element={
                      <PrivateRoute>
                        <CreateDocuments />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/updatedocument/:documentId"
                    element={
                      <PrivateRoute>
                        <UpdateDocuments />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/updateuser" element={<UpdateUser />} />
                  <Route
                    path="/user"
                    element={
                      <PrivateRoute>
                        <User />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/documents/:id" element={<Detail />} />
                  <Route path="/listuser" element={<ListUser />} />
                  <Route path="/detailsearch" element={<DetailSearch />} />
                  <Route
                    path="/documents/category/:categoryName"
                    element={<CategorySearch />}
                  />
                  <Route
                    path="/documents/user/:userId/verified"
                    element={<ListDocumentVerified />}
                  />
                  <Route
                    path="/listdocumentverifiedmy"
                    element={
                      <PrivateRoute>
                        <ListDocumentVerifiedMy />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/listdocumentcreatemy"
                    element={
                      <PrivateRoute>
                        <ListDocumentCreateMy />
                      </PrivateRoute>
                    }
                  />
                </Routes>
                <Footer />
                <ToastContainer />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
