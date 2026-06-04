import { Route } from "react-router-dom";
import { ROLES } from "../constants/routes";
import ProtectedRoute from "./ProtectedRoute";
import AccountantLayout from "../components/layout/AccountantLayout";

import AccountantDashboard from "../pages/dashboard/AccountantDashboard";
import AccountantFeePayment from "../pages/fees/AccountantFeePayment";
import FeeManagement from "../pages/fees/FeeManagement";
import FeeVouchers from "../pages/fees/FeeVouchers";
import FeeDefaulters from "../pages/fees/FeeDefaulters";
import BalanceSheet from "../pages/fees/BalanceSheet";
import ExpenseManagement from "../pages/expenses/ExpenseManagement";
import Profile from "../pages/profile/Profile";

function AccountantRoutes() {
  return (
    <Route
      path="/accountant"
      element={
        <ProtectedRoute allowedRoles={[ROLES.ACCOUNTANT]}>
          <AccountantLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AccountantDashboard />} />
      <Route path="fee-payment" element={<AccountantFeePayment />} />
      <Route path="fee-vouchers" element={<FeeVouchers />} />
      <Route path="defaulters" element={<FeeDefaulters />} />
      <Route path="expenses" element={<ExpenseManagement />} />
      <Route path="balance-sheet" element={<BalanceSheet />} />
      <Route path="reports" element={<AccountantDashboard />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  );
}

export default AccountantRoutes;