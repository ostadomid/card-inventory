import { useUploadFile } from "@better-upload/client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton } from "@/components/upload-button"

const getUploadURL = createServerFn().handler(async () => {
  const res = await fetch("http://localhost:9333/dir/assign")
  if (!res.ok) {
    return { error: "Can't get one" }
  }
  const resp = await res.json()
  return { address: `${resp.url}/${resp.fid}` }
})
export const Route = createFileRoute("/dashboard/addphoto")({
  // async loader() {
  //   const res = await getUploadURL()
  //   return { uploadURL: res.error ? "" : res.address }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  // const { uploadURL } = Route.useLoaderData()
  const { control } = useUploadFile({
    route: "cards",
    onError(error) {
      console.log("Error")
      console.log({ error })
    },
    onUploadComplete(data) {
      console.log({ data })
    },
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Card Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadButton control={control} />
      </CardContent>
    </Card>
  )
}
