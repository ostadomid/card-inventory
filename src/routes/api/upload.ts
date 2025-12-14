import { createFileRoute } from "@tanstack/react-router"

import { handleRequest, route } from "@better-upload/server"
import { tigris } from "@better-upload/server/clients"
import type { Router } from "@better-upload/server"

const router: Router = {
  bucketName: "card-inventory",
  client: tigris({
    endpoint:"https://t3.storage.dev",
    accessKeyId:"tid_TmyloVuvHBFBcgiDXLCLUEwtHpGEtyUNsirtKPeTtGpvsHMNUh",
     secretAccessKey:"tsec_c8_wMArRcOvuXetyRe+6GjM-gjFLU4yYLGZCXo6W-Zc28NYGTNmv19SFJj7kS5LthyDs6A"
    // host: "localhost:8333",
    // region: "alaki",
    // accessKeyId: "super_secure_key",
    // secretAccessKey: "super_secure_secret",
    // secure: false,
    // forcePathStyle: true,
  }),

  routes: {
    cards: route({
      fileTypes: ["image/*"],
      maxFileSize: 35 * 1024 * 1024,
      onAfterSignedUrl(data) {
        // console.log({data})
        return data.file.objectInfo
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
