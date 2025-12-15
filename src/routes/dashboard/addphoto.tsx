import { useUploadFile } from "@better-upload/client"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton } from "@/components/upload-button"
import { useState } from "react"
import z from "zod"
import { useForm } from "@tanstack/react-form"

export const Route = createFileRoute("/dashboard/addphoto")({
  component: RouteComponent,
})

const schema = z.object({
  cardId: z.string().min(3, "A valid CardId is required"),
  image: z.file(),
})

type FormType = z.infer<typeof schema>

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      cardId: "",
      image: 0 as unknown,
    },
    validators: {
      onBlur: schema,
    },
    onSubmit(props) {},
  })
  const uploader = useUploadFile({
    route: "cards",
    onUploadBegin(data) {
      console.log({ uploadBegin: data })
    },
    onError(error) {
      console.log("Error")
      console.log({ error })
    },
    onUploadComplete(data) {},
  })
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Card Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadButton
          control={uploader.control}
          uploadOverride={(input, options) => {
            alert(input.name)
            console.log({ options })
          }}
        />
        {uploader.control.uploadedFile && (
          <img
            className="border rounded-lg w-80 aspect-square object-contain"
            src={`http://localhost:9000/card-inventory/${uploader.control.uploadedFile.objectInfo.key}`}
            alt="uploaded image"
          />
        )}
      </CardContent>
    </Card>
  )
}
