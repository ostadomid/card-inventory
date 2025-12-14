import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadDropzone } from "@/components/upload-dropzone"
import { useUploadFile } from "@better-upload/client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const getUploadURL = createServerFn().handler(async () => {
  const res = await fetch("http://localhost:9333/dir/assign")
  if (!res.ok) {
    return { error: "Can't get one" }
  }
  const resp = await res.json()
  return { address: `${resp.url}/${resp.fid}` }
})
export const Route = createFileRoute("/dashboard/addphoto")({
  async loader() {
    const res = await getUploadURL()
    return { uploadURL: res.error ? "" : res.address }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { uploadURL } = Route.useLoaderData()
  const { control } = useUploadFile({ route: "cards" })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Card Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadDropzone
          control={control}
          accept="image/*"
          description={{
            maxFiles: 4,
            maxFileSize: "5MB",
            fileTypes: "JPEG, PNG, GIF",
          }}
        />
      </CardContent>
    </Card>
  )
}
