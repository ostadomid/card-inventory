import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import {
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemGroup,
  ItemActions,
} from "@/components/ui/item"
import { Item } from "@/components/ui/item"
import { StackIcon } from "@phosphor-icons/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { DollarSign, Sigma } from "lucide-react"

export const Route = createFileRoute("/dashboard/cardslist")({
  component: RouteComponent,
})

const items: Array<{ cardId: string; price: number; quantity: number }> = [
  { cardId: "H1230", price: 6500, quantity: 315 },
  { cardId: "H1000", price: 7500, quantity: 30 },
  { cardId: "AL428", price: 8500, quantity: 200 },
  { cardId: "M545", price: 12500, quantity: 455 },
]

function RouteComponent() {
  return (
    <Card className="w-5/6 mx-auto mt-8 shadow-xl">
      <CardContent className="grid grid-cols-1 sm:grid-cols-(--gallery) gap-4">
        {items.map(({ cardId, price, quantity }) => (
          <Item className="border p-4 border-amber-400 rounded-lg">
            <ItemMedia variant={"image"} className="size-32 mx-auto basis-full">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    className="cursor-pointer hover:scale-110 transition-all ease-in-out duration-150"
                    alt={cardId}
                    src={`/img/cards/${cardId}.jpg`}
                  />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="items-center font-semibold">
                    {cardId}
                  </DialogHeader>
                  <img
                    className="w-full sm:max-w-md aspect-square "
                    alt={cardId}
                    src={`/img/cards/${cardId}.jpg`}
                  />
                </DialogContent>
              </Dialog>
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="w-full justify-center">{cardId}</ItemTitle>
              <ItemGroup className="gap-2">
                <Item variant="muted" size={"sm"}>
                  <ItemMedia variant={"icon"}>
                    <DollarSign />
                  </ItemMedia>
                  <ItemContent>{price}</ItemContent>
                </Item>
                <Item variant="muted" size={"sm"}>
                  <ItemMedia variant={"icon"}>
                    <StackIcon />
                  </ItemMedia>
                  <ItemContent>{quantity}</ItemContent>
                </Item>
              </ItemGroup>
            </ItemContent>
            <ItemActions className="basis-full justify-center">
              <Button variant="outline" className="hover:bg-red-300/50" asChild>
                <Link to={"/dashboard/sellcard"} search={{ cardId }}>
                  فروش
                </Link>
              </Button>
              <Button
                variant="outline"
                className="hover:bg-green-300/50"
                asChild
              >
                <Link to={"/dashboard/addcard"} search={{ cardId }}>
                  خرید
                </Link>
              </Button>
            </ItemActions>
          </Item>
        ))}
      </CardContent>
    </Card>
  )
}
