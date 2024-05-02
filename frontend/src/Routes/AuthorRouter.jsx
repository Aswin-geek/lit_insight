import { lazy } from "react";
import { Route, Routes } from "react-router-dom";


const Author_Navbar = lazy(() => import("../components/Author/Author_Navbar"))
const Author_Home = lazy(() => import("../components/Author/Author_Home"))
const Author_Sidebar = lazy(() => import("../components/Author/Author_Sidebar"))
const Book = lazy(() => import("../components/Author/Book"))
const Reviews = lazy(() => import("../components/Author/Reviews"))
const Upcoming = lazy(() => import("../components/Author/Upcoming"))
const View_Posts = lazy(() => import("../components/Author/View_Posts"));
const Profile = lazy(() => import("../components/User/Profile"))

export default function AuthorRouter() {
    return (
        <>
            <div className="" >
            <Author_Navbar />
            <div className="flex space-x-3" style={{width:'90%'}}>
            <Author_Sidebar />
            <Routes>
                <Route path={"/"} element={<Author_Home />} />
                <Route path={"book/"} element={<Book />} />
                <Route path={"reviews/"} element={<Reviews />} />
                <Route path={"upcoming/"} element={<Upcoming />} />
                <Route path={"/view_post/:id"} element={<View_Posts />} />
                <Route path={"profile/"} element={<Profile />} />
            </Routes>
            </div>
            </div>
        </>
    )
}