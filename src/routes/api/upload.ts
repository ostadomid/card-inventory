import { createFileRoute } from "@tanstack/react-router"

import { handleRequest, route } from "@better-upload/server"
import { minio } from "@better-upload/server/clients"
import type { Router } from "@better-upload/server"

const router: Router = {
  bucketName: "card-inventory",
  client: minio({
    region:"us-east-1",
    endpoint:"http://localhost:9000",
     accessKeyId: process.env.ACCESS_KEY||"",
     secretAccessKey: process.env.SECRET_KEY||"",
  }),

  routes: {
    cards: route({
      fileTypes: ["image/*"],
      maxFileSize: 35 * 1024 * 1024,
      
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
