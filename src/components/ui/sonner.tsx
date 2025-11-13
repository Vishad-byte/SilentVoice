"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right" // 🧭 Center for visibility
      toastOptions={{
        classNames: {
          toast:
            "group border border-border/60 bg-background/95 backdrop-blur-md shadow-lg rounded-xl p-4 flex items-center gap-3 text-sm font-medium text-foreground transition-all duration-200 hover:scale-[1.02]",
          title: "font-semibold text-[15px] text-foreground leading-snug",
          description: "text-[14px] leading-snug text-foreground/90 dark:text-foreground/80",
          actionButton:
            "text-primary font-semibold hover:underline underline-offset-2",
          cancelButton:
            "text-muted-foreground font-medium hover:text-foreground",
        },
        style: {
          maxWidth: "400px",
          width: "100%",
        },
      }}
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-green-500 dark:text-green-400" />
        ),
        info: <InfoIcon className="size-5 text-blue-500 dark:text-blue-400" />,
        warning: (
          <TriangleAlertIcon className="size-5 text-yellow-500 dark:text-yellow-400" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-500 dark:text-red-400" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
