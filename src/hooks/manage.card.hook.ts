import { createFormHook } from "@tanstack/react-form"
import { fieldContext, formContext } from "./manage.cad.context"

import { Submit, TextInput } from "@/components/manage.card.components"
export const {useAppForm:useCardForm} = createFormHook({
  fieldComponents: { TextInput },
  formComponents: { Submit },
  fieldContext,
  formContext,
})
