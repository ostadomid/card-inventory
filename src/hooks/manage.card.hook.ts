import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./manage.cad.context"

import {
  CalendarInput,
  ComboInput,
  FileUploader,
  Submit,
  TextInput,
} from "@/components/manage.card.components"
export const { useAppForm: useCardForm } = createFormHook({
  fieldComponents: { TextInput, FileUploader, CalendarInput, ComboInput },
  formComponents: { Submit },
  fieldContext,
  formContext,
})
