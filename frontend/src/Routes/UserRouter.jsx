
import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

const User_Navbar = lazy(() => import("../components/User/User_Navbar"));
const User_Home = lazy(() => import("../components/User/User_Home"));
const User_Sidebar = lazy(() => import("../components/User/User_Sidebar"));
const Reviews = lazy(() => import("../components/User/Reviews"));
const View_Reviews = lazy(() => import("../components/User/View_Reviews"));
const My_Reviews = lazy(() => import("../components/User/My_Reviews"));
const View_Posts = lazy(() => import("../components/User/View_Posts"));
const Chat = lazy(() => import("../components/User/Chat"));
const Premium = lazy(() => import("../components/User/Premium"))
const Top_Reviews = lazy(() => import("../components/User/Top_Reviews"))
const Upcomings = lazy(() => import("../components/User/Upcomings"))
const Profile = lazy(() => import("../components/User/Profile"))
const View_Book = lazy(() => import("../components/User/View_Book"))


export default function UserRouter() {
  const location = useLocation();
  useEffect(() => {
    console.log("UserRouter");
  }, []);
  return (
    <>
      <User_Navbar />
      <div className="flex space-x-3">
        {!location.pathname.includes("/chat") ? <User_Sidebar /> : null}
        <Routes>
          <Route path={"/"} element={<User_Home />} />
          <Route path={"reviews/"} element={<Reviews />} />
          <Route path={"view_reviews/"} element={<View_Reviews />} />
          <Route path={"my_reviews/"} element={<My_Reviews />} />
          <Route path={"/view_post/:id"} element={<View_Posts />} />
          <Route path={"chat/"} element={<Chat />} />
          <Route path={"premium/"} element={<Premium />} />
          <Route path={"top_reviews/"} element={<Top_Reviews />} />
          <Route path={"upcomings/"} element={<Upcomings />} />
          <Route path={"profile/"} element={<Profile />} />
          <Route path={"view_book/:id"} element={<View_Book />} />
        </Routes>
      </div>
    </>
  );
}
