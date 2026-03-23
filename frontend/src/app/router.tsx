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
import { ShopPage } from "@/features/shop/pages/ShopPage";
import { AccountLayout } from "@/features/account/components/layout/AccountLayout";
import OrdersPage from "@/features/account/pages/OrdersPage ";
import { AccountOverviewPage } from "@/features/account/pages/AccountOverviewPage";
import { AddressesPage } from "@/features/account/pages/AddressesPage";
import { CartPage } from "@/features/account/pages/CartPage";
import { WishlistPage } from "@/features/account/pages/WishlistPage";
import { SettingPage } from "@/features/account/pages/SettingPage";

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

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountLayout,
});
const accountOverviewRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "overview",
  component: AccountOverviewPage,
  context: () => ({ pageTitle: "My Account" }),
});

const accountOrdersRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "orders",
  component: OrdersPage,
  context: () => ({ pageTitle: "My Orders" }),
});

const accountAddressRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "addresses",
  component: AddressesPage,
  context: () => ({ pageTitle: "My Addresses" }),
});

const accountCartRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "cart",
  component: CartPage,
  context: () => ({ pageTitle: "My Cart" }),
});

const accountWishlistRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "wishlist",
  component: WishlistPage,
  context: () => ({ pageTitle: "My Wishlist" }),
});

const accountSettingRoute = createRoute({
  getParentRoute: () => accountRoute,
  path: "settings",
  component: SettingPage,
  context: () => ({ pageTitle: "Account Settings" }),
});
rootRoute.addChildren([
  indexRoute,
  shopRoute,
  loginRoute,
  registerRoute,
  productRoute,
  checkoutRoute,

  accountRoute.addChildren({
    accountOverviewRoute,
    accountOrdersRoute,
    accountAddressRoute,
    accountCartRoute,
    accountWishlistRoute,
    accountSettingRoute,
  }),
]);

export const router = createRouter({ routeTree: rootRoute });
