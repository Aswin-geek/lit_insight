import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";


const Admin_Navbar = lazy(() => import("../components/Admin/Admin_Navbar"))
const Admin_Home = lazy(() => import("../components/Admin/Admin_Home"))
const Admin_Sidebar = lazy(() => import("../components/Admin/Admin_Sidebar"))
const Genre = lazy(() => import("../components/Admin/Genre"))
const Users = lazy(() => import("../components/Admin/Users"))
const Reviews = lazy(() => import("../components/Admin/Reviews"))
const Plan = lazy(() => import("../components/Admin/Plan"))

export default function AdminRouter() {
    return (
        <>
            <Admin_Navbar />
            <div className="flex space-x-3">
            <Admin_Sidebar />
            <Routes>
                <Route path={"/"} element={<Admin_Home />} />
                <Route path={"genre/"} element={<Genre />} />
                <Route path={"users/"} element={<Users />} />
                <Route path={"reviews/"} element={<Reviews />} />
                <Route path={"plan/"} element={<Plan />} />
            </Routes>
            </div>
        </>
    )
}