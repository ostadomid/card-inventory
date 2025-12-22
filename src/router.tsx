import { createRouter } from "@tanstack/react-router"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"
import { QueryClient } from "@tanstack/react-query"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

const queryClient = new QueryClient()

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // defaultPreloadStaleTime: 0,
    defaultPreload: "intent",
    context: { queryClient },
  })

  setupRouterSsrQueryIntegration({ queryClient, router })

  return router
}
