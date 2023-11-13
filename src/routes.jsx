import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import CardPage from "./pages/CardPage";
import Transactions from "./pages/Transactions";
import FinanceChart from "./pages/FinanceChart";
import ErrorPage from "./pages/ErrorPage";
import Profile from "./Pages/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} errorElement={<ErrorPage />} />
      <Route path="/card" element={<CardPage />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/finance-chart" element={<FinanceChart />} />
      <Route path="/profile" element={<Profile />} />
    </>
  ) /*,
  [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/card",
      element: <CardPage />,
    },
    {
      path: "/transactions",
      element: <Transactions />,
    },
    {
      path: "/finance-chart",
      element: <FinanceChart />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    // {
    //   path: '/payment_result',
    //   name: 'payment_result',
    //   lazy: () => import('../views/PayResultView.vue')
    // }
  ]*/
);

export default router;
