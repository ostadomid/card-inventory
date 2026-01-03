import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { DotsThreeVerticalIcon } from "@phosphor-icons/react"
import { Pen, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"

type Props = {
  id: string | number
  onDelete: (id: string | number) => Promise<unknown>
  onEdit: (id: string | number) => void
}
export function ActionCell({ id, onDelete, onEdit }: Props) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <DotsThreeVerticalIcon className="cursor-pointer" size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="justify-end"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            حذف
            <Trash2 size={12} />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-end" onClick={() => onEdit(id)}>
            ویرایش
            <Pen size={12} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete</DialogTitle>
          </DialogHeader>
          <p>آیا از حذف آیتم {id} مطمئن هستید؟</p>
          <DialogFooter>
            <Button
              disabled={deleting}
              onClick={async () => {
                setDeleting(true)
                await onDelete(id)
                setDeleting(false)
                setOpen(false)
              }}
              variant="destructive"
            >
              {deleting ? "در حال حذف کردن ..." : "حذف"}
            </Button>
            <Button>انصراف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
