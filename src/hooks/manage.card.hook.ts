import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./manage.cad.context"

import { FileUploader, Submit, TextInput } from "@/components/manage.card.components"
export const {useAppForm:useCardForm} = createFormHook({
  fieldComponents: { TextInput, FileUploader },
  formComponents: { Submit },
  fieldContext,
  formContext,
})
