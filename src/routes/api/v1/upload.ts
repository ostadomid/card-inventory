import { createFileRoute } from "@tanstack/react-router"

import { handleRequest, type Router, route } from "@better-upload/server"
import { aws } from "@better-upload/server/clients"

const router: Router = {
  bucketName: "card-inventory",
  client: aws({ region: "alaki", accessKeyId: "", secretAccessKey: "" }),
  routes: {
    cards: route({ fileTypes: ["image/*"], maxFileSize: 5 * 1024 * 1024 }),
  },
}
export const Route = createFileRoute("/api/v1/upload")({
  server: {
    handlers: {
     
      POST: async ({ request }) => {
        return handleRequest(request, router)
      },
    },
  },
})
