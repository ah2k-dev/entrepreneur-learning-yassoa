import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NotFoundPage from "../pages/error/NotFound";
import DefaultLayout from "../layout/DefaultLayout";
import LoginPage from "../pages/auth/Login";
import AuthRoute from "./AuthRoute";
import RegisterPage from "../pages/auth/Register";
import VerifyAccountPage from "../pages/auth/VerifyAccount";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import PodcastLists from "../pages/dashboard/podcasts/PodcastLists";
import PodcastDetails from "../pages/dashboard/podcasts/PodcastDetails";
import BusinessIdeas from "../pages/dashboard/business-ideas/BusinessIdeas";
import CoursesLists from "../pages/dashboard/courses/coursesLists";
import ProfileSetting from "../pages/dashboard/settings/ProfileSetting";
import ClientsSetting from "../pages/dashboard/settings/Clients";
import EditorsSetting from "../pages/dashboard/settings/EditersSetting";
import InvoicesSettings from "../pages/dashboard/settings/Invoices";
import ProtectedRoute from "./ProtectedRoute ";
import Home from "../pages/Home";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import RenewPasswordPage from "../pages/auth/renewPassword";
import PackageListPage from "../pages/dashboard/packages/PackageList";
import { useDispatch } from "react-redux";
import { getMee } from "../redux/actions/authActions";
import SubscriptionSettingPage from "../pages/dashboard/settings/SubscriptionSetting";
import PaidInformation from "../pages/dashboard/packages/PaidInformation";
import CourseDetailsPage from "../pages/dashboard/courses/courseDetails";

const AppRouter = () => {
    
    const { pathname } = useLocation();
    useEffect(() => {
        window?.scrollTo(0, 0);
    }, [pathname]);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute Component={DashboardLayout} />}>
                <Route path="/dashboard/" element={<Dashboard />} />  
                <Route path="/dashboard/podcasts/:id" element={<PodcastDetails />} />  
                <Route path="/dashboard/podcasts" element={<PodcastLists />} />  
                <Route path="/dashboard/business-ideas" element={<BusinessIdeas />} />
                <Route path="/dashboard/courses" element={<CoursesLists />} />
                <Route path="/dashboard/courses/:step/:id" element={<CourseDetailsPage />} />
                <Route path="/dashboard/settings/profile" element={<ProfileSetting />} />
                <Route path="/dashboard/settings/clients" element={<ClientsSetting />} />
                <Route path="/dashboard/settings/editor" element={<EditorsSetting />} />
                <Route path="/dashboard/settings/invoices" element={<InvoicesSettings />} />
                <Route path="/dashboard/settings/subscription" element={<SubscriptionSettingPage />} />
                <Route path="/dashboard/plans/list" element={<PackageListPage />} />
                <Route path="/dashboard/plans/buy-plan" element={<PaidInformation />} />
            </Route>

            {/* Auth routes */}
            <Route path="/" element={<DefaultLayout />}>
                <Route path="/login" element={<AuthRoute Component={LoginPage} />} />
                <Route path="/register" element={<AuthRoute Component={RegisterPage} />} />
                <Route path="/account-verification/:email" element={<AuthRoute Component={VerifyAccountPage} />} />
                <Route path="/forgot-password" element={<AuthRoute Component={ForgotPasswordPage} />} />
                <Route path="/verify-email/:email" element={<AuthRoute Component={RenewPasswordPage} />} />
            </Route>


            {/* Not found page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>

    )

};

export default AppRouter;
