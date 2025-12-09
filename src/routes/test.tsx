import { createFileRoute } from '@tanstack/react-router'
import {newDate,format,parse} from 'date-fns-jalali'

export const Route = createFileRoute('/test')({
  component: RouteComponent,
})

function RouteComponent() {
  //newDate(1404,9,18).getDate()
  const n = parse("1404-09-18","YYYY-MM-DD",Date.now()).getTime()
  return <div>Hello {n}</div>
}
