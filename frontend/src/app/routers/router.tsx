import {
  createRootRoute,
  createRoute,
  createRouter,
  HeadContent,
  Outlet,
} from "@tanstack/react-router";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { HomePage } from "../../features/home/pages/HomePage";
import LoginPage from "../../features/auth/pages/LoginPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import ProductPage from "@/features/product/pages/ProductPage";
import { ShopPage } from "@/features/shop/pages/ShopPage";
import { AccountLayout } from "@/features/account/components/layout/AccountLayout";
import OrdersPage from "@/features/account/pages/OrdersPage";
import { AccountOverviewPage } from "@/features/account/pages/AccountOverviewPage";
import { AddressesPage } from "@/features/account/pages/AddressesPage";
import { CartPage } from "@/features/account/pages/CartPage";
import { WishlistPage } from "@/features/account/pages/WishlistPage";
import { SettingPage } from "@/features/account/pages/SettingPage";
import { useAuth } from "@/providers/AuthProvider";
import { AppSkeleton } from "@/shared/components/feedback/AppSkeleton";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

const rootRoute = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { isInitializing, user, logout } = useAuth();
  if (isInitializing) return <AppSkeleton />;
  return (
    <>
      <HeadContent />
      <MainLayout isLoggedIn={!!user} onLogout={logout}>
        <Outlet />
      </MainLayout>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
  head: () => ({
    meta: [{ title: "Sellora | Home" }],
  }),
});

const loginRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: "/login",
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Sellora | Login" }],
  }),
});

const registerRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: "/register",
  component: RegisterPage,
  head: () => ({
    meta: [{ title: "Sellora | register" }],
  }),
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
  head: () => ({
    meta: [{ title: "Sellora | Shop" }],
  }),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductPage,
  head: () => ({
    meta: [{ title: "Sellora | product" }],
  }),
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
  head: () => ({
    meta: [{ title: "Sellora | Checkout" }],
  }),
});
const guestRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "guest",
  component: GuestRoute,
});
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedRoute,
});
const accountRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/account",
  component: AccountLayout,
});
const accountOverviewRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "overview",
  component: AccountOverviewPage,
  context: () => ({ pageTitle: "My Account" }),
  head: () => ({
    meta: [{ title: "Sellora | My Account" }],
  }),
});

const accountOrdersRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "orders",
  component: OrdersPage,
  context: () => ({ pageTitle: "My Orders" }),
  head: () => ({
    meta: [{ title: "Sellora | My Orders" }],
  }),
});

const accountAddressRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "addresses",
  component: AddressesPage,
  context: () => ({ pageTitle: "My Addresses" }),
  head: () => ({
    meta: [{ title: "Sellora | My Address" }],
  }),
});

const accountCartRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "cart",
  component: CartPage,
  context: () => ({ pageTitle: "My Cart" }),
  head: () => ({
    meta: [{ title: "Sellora | My Cart" }],
  }),
});

const accountWishlistRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "wishlist",
  component: WishlistPage,
  context: () => ({ pageTitle: "My Wishlist" }),
  head: () => ({
    meta: [{ title: "Sellora | My Wishlist" }],
  }),
});

const accountSettingRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "settings",
  component: SettingPage,
  context: () => ({ pageTitle: "Account Settings" }),
  head: () => ({
    meta: [{ title: "Sellora | Account Settings" }],
  }),
});
guestRoute.addChildren([loginRoute, registerRoute]);
rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  checkoutRoute,
  guestRoute,
  protectedRoute.addChildren([
    accountRoute.addChildren([
      accountOverviewRoute,
      accountOrdersRoute,
      accountAddressRoute,
      accountCartRoute,
      accountWishlistRoute,
      accountSettingRoute,
    ]),
  ]),
]);

export const router = createRouter({ routeTree: rootRoute });
