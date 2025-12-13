import { createFileRoute } from "@tanstack/react-router"
import { format, newDate, parse } from "date-fns-jalali"
import {
  Check,
  CheckIcon,
  ChevronsUpDown,
  Copy,
  CopyIcon,
  DollarSign,
  FileJson,
  InfoIcon,
  Link,
  Music4Icon,
  Plus,
  ReceiptCent,
  RefreshCcw,
  SearchIcon,
  Wallet,
} from "lucide-react"

import { useEffect, useRef, useState } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export const Route = createFileRoute("/test")({
  component: RouteComponent,
})

function useCopyToClipboard() {
  const [isCoppied, setIsCoppied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const copy = function () {
    setIsCoppied(true)
    navigator.clipboard.writeText(inputRef.current?.value || "").then(() => {
      setIsCoppied(false)
    })
  }
  return { isCoppied, copy, inputRef }
}
function RouteComponent() {
  // newDate(1404,9,18).getDate()
  // const n = parse("1404-09-18","YYYY-MM-DD",Date.now()).getTime()
  // const [holdTick, setHoldTick] = useState(false)
  // const handle = useRef<NodeJS.Timeout>(null)

  // useEffect(() => {
  //   return () => {
  //     if (!handle.current) return
  //     console.log(`Clreaing Hanle ${handle.current}`)
  //     clearTimeout(handle.current)
  //   }
  // },[])
  const { isCoppied, copy, inputRef } = useCopyToClipboard()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="w-full sm:max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Playground</CardTitle>
        <CardDescription>
          Here we test Shadcd UI components in action
        </CardDescription>
        <CardAction>
          <Button variant="link">Docs</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className=" grid gap-4">
          <InputGroup>
            <InputGroupInput />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="text-teal-700">
              <CheckIcon />
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput id="email" type="email" />
            <InputGroupAddon align="block-start">
              <Label htmlFor="email">Email</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    onClick={() => alert(1)}
                    variant="ghost"
                    aria-label="Help"
                    className="ml-auto rounded-full"
                    size="icon-sm"
                  >
                    <InfoIcon />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>We&apos;ll use this to send you notifications</p>
                </TooltipContent>
              </Tooltip>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput type="number" id="age" min={18} />
            <InputGroupAddon
              align={"block-start"}
              className="flex justify-between"
            >
              <Label htmlFor="age">Age</Label>
              <ReceiptCent className="" />
            </InputGroupAddon>

            <InputGroupAddon align={"block-end"}>
              <span>Something goes here later</span>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupInput placeholder="0.00" />
            <InputGroupAddon>
              <Label>Amount</Label>
            </InputGroupAddon>
            <InputGroupAddon align={"inline-end"}>
              <InputGroupText>USD</InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon className="pl-0.5">
              <DollarSign />
            </InputGroupAddon>
          </InputGroup>

          <InputGroup>
            <InputGroupInput id="wallet" ref={inputRef as any} />
            <InputGroupAddon>
              <Wallet />
            </InputGroupAddon>
            <InputGroupAddon>
              <Label htmlFor="wallet">Wallet</Label>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={() => {
                  copy()
                  // navigator.clipboard.writeText(
                  //   (document.getElementById("wallet") as HTMLInputElement)
                  //     .value || "",
                  // )

                  // setHoldTick(true)
                  // if (handle.current) {
                  //   clearTimeout(handle.current)
                  // }
                  // handle.current = setTimeout(() => {
                  //   setHoldTick(false)
                  //   handle.current = null
                  // }, 1500)
                }}
              >
                {!isCoppied ? <CopyIcon /> : <Check />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupTextarea />
            <InputGroupAddon align={"block-start"}>
              <FileJson />
              <InputGroupText>my-script.js</InputGroupText>
              <InputGroupButton className="ml-auto">
                <RefreshCcw />
              </InputGroupButton>
              <InputGroupButton>
                <Copy />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <ButtonGroup>
            <ButtonGroupText asChild>
              <Label htmlFor="website">https://</Label>
            </ButtonGroupText>
            <InputGroup>
              <InputGroupInput id="website" />
              <InputGroupAddon>
                <Link />
              </InputGroupAddon>
            </InputGroup>
            <ButtonGroupText>.com</ButtonGroupText>
          </ButtonGroup>

          <ButtonGroup>
            <Button size={"icon"} className="rounded-full">
              <Plus />
            </Button>
            <InputGroup>
              <InputGroupInput className="rounded-lg" />
              <InputGroupAddon align={"inline-end"}>
                <InputGroupButton size="icon-sm">
                  <Music4Icon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </ButtonGroup>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="justify-between max-w-[200px]"
              >
                <span>Tanstack Start</span>
                <ChevronsUpDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[200px]">
              <Command
                filter={(v: string | any[], s: any) => {
                  console.log({ v, s })
                  return v.includes(s) ? 1 : 0
                }}
              >
                <CommandInput placeholder="search" />
                <CommandEmpty>Nothing Found</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem value="iran">Iran</CommandItem>
                    <CommandItem value="united_states">
                      United States
                    </CommandItem>
                    <CommandItem value="united_kingdom">
                      United Kingdom
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
