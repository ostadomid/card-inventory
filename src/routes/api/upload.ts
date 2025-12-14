import { createFileRoute } from "@tanstack/react-router"

import { handleRequest, route } from "@better-upload/server"
import { custom } from "@better-upload/server/clients"
import type { Router } from "@better-upload/server"

const router: Router = {
  bucketName: "card-inventory",
  client: custom({
    host: "localhost:8333",
    region: "alaki",
    accessKeyId: "super_secure_key",
    secretAccessKey: "super_secure_secret",
    secure: false,
    forcePathStyle: true,
  }),

  routes: {
    cards: route({
      fileTypes: ["image/*"],
      maxFileSize: 35 * 1024 * 1024,
      onBeforeUpload(data) {
        console.log({ data })
      },
    }),
  },
}
export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        return handleRequest(request, router)
      },
      PUT: async ({ request }) => {
        return handleRequest(request, router)
      },
    },
  },
})
