import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { MainLayout } from '../components/layout/MainLayout'
import { HomePage } from '../pages/HomePage'
import { ShopPage } from '../pages/ShopPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { ProductPage } from '../pages/ProductPage'

const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <MainLayout isLoggedIn={false}>
      <Outlet />
    </MainLayout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopPage,
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductPage,
})

rootRoute.addChildren([indexRoute, shopRoute, loginRoute, registerRoute, productRoute])

export const router = createRouter({ routeTree: rootRoute })
