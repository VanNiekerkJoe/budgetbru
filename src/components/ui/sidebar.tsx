
import * as React from "react"

import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const SIDEBAR_COOKIE_NAME = "sidebar-expanded"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

interface SidebarContext {
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void // Added toggleSidebar to the interface
}

const SidebarContext = React.createContext<SidebarContext | undefined>(undefined)

function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a Sidebar")
  }
  return context
}

const sidebarVariants = cva("", {
  variants: {
    orientation: {
      horizontal:
        "h-14 lg:h-screen w-full lg:w-14 data-[state=open]:w-64 lg:data-[state=open]:w-64",
      vertical: "h-screen w-14 data-[state=open]:w-64",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modalClassName?: string
}

const Sidebar = React.forwardRef<
  React.ElementRef<"div">,
  SidebarProps
>(
  (
    {
      className,
      orientation,
      children,
      defaultOpen,
      open: openProp,
      onOpenChange: setOpenProp,
      modalClassName,
      ...props
    },
    ref
  ) => {
    const isMobile = useMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const controlled = openProp !== undefined // Added this line to define 'controlled'
    
    const setOpen = React.useCallback(
      (openState: boolean) => {
        if (setOpenProp) {
          setOpenProp(openState)
        }

        if (!setOpenProp || !controlled) {
          _setOpen(openState)
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, controlled] // Fixed dependency array to include 'controlled'
    )

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen(!open) // Fixed: passing boolean instead of function
    }, [isMobile, setOpen, setOpenMobile, open])

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === "b" &&
          (event.metaKey || event.ctrlKey) &&
          event.shiftKey
        ) {
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        toggleSidebar, // Added toggleSidebar to the context value
      }),
      [open, setOpen, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          className={cn(
            "group relative flex h-full shrink-0 overflow-hidden transition-all duration-300",
            sidebarVariants({ orientation }),
            className
          )}
          data-orientation={orientation}
          data-state={state}
          ref={ref}
          {...props}
        >
          <div
            className={cn(
              "flex h-full w-full flex-col border-r bg-secondary text-secondary-foreground shadow-sm transition-all duration-300",
              "group-data-[state=collapsed]:w-14 group-data-[state=expanded]:w-64"
            )}
          >
            {children}
          </div>
          <div
            className={cn(
              "fixed inset-0 z-[40] bg-black/80 opacity-0 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none lg:hidden",
              modalClassName
            )}
            aria-hidden
            data-state={openMobile ? "open" : "closed"}
            onClick={() => setOpenMobile(false)}
          />
        </div>
      </SidebarContext.Provider>
    )
  }
)

Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebarContext()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 w-8 rounded-md p-0 lg:opacity-0 lg:group-data-[state=collapsed]:opacity-100",
        className
      )}
      aria-label="Toggle Sidebar"
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarContent = React.forwardRef<
  React.ElementRef<"div">,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1 space-y-2 p-4 pb-8",
      "group-data-[state=collapsed]:hidden group-data-[state=expanded]:block",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef<
  React.ElementRef<"div">,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between py-3 px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  React.ElementRef<"div">,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto py-3 px-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarSearch = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <Input
      ref={ref}
      placeholder="Search..."
      className={cn(
        "pr-10 shadow-inner transition-all duration-200",
        "group-data-[state=collapsed]:hidden group-data-[state=expanded]:block",
        className
      )}
      {...props}
    />
  </div>
))
SidebarSearch.displayName = "SidebarSearch"

export {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSearch,
}
