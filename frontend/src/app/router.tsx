import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { MainLayout } from "../shared/components/layout/MainLayout";
import { HomePage } from "../features/home/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import ProductPage from "@/features/product/pages/ProductPage";
// import ProfilePage from "@/features/profile/pages/ProfilePage";
import { ShopPage } from "@/features/shop/pages/ShopPage";
import { AccountLayout } from "@/features/account/components/layout/AccountLayout";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import OrdersPage from "@/features/account/pages/OrdersPage ";
import { AccountOverviewPage } from "@/features/account/pages/AccountOverviewPage";

const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <MainLayout isLoggedIn={true}>
      <Outlet />
    </MainLayout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountLayout,
});

const accountOrdersRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "orders",
  component: OrdersPage,
});
const accountOverviewRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "overview",
  component: AccountOverviewPage,
});

rootRoute.addChildren([
  indexRoute,
  shopRoute,
  loginRoute,
  registerRoute,
  productRoute,
  checkoutRoute,
  profileRoute,

  accountRoute.addChildren({
    accountOverviewRoute,
    accountOrdersRoute,
  }),
]);

export const router = createRouter({ routeTree: rootRoute });
