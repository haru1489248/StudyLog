// @/components/atom/Button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils"

export const buttonVariants = cva(
  // --- base ---
  `inline-flex items-center justify-center whitespace-nowrap
   rounded-md text-sm font-medium transition-colors
   focus-visible:outline-none focus-visible:ring-2
   focus-visible:ring-ring focus-visible:ring-offset-2
   disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      /* 色味・装飾 */
      variant: {
        /** 主使用 */
        primary:     "bg-green-600 text-white hover:bg-green-700",
        secondary:   "bg-stone-200 text-stone-800 hover:bg-stone-300",
        outline:     "border border-stone-300 bg-white hover:bg-stone-50",
        destructive: "bg-red-700  text-white hover:bg-red-800",
        warning:     "bg-yellow-600 text-stone-900 hover:bg-yellow-700",
        link:        "text-green-700 underline-offset-4 hover:underline",
        /** 入力横やアイコンだけ置く時 */
        ghost:       "hover:bg-accent hover:text-accent-foreground",
      },
      /* サイズ */
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-9 px-3",
        lg:      "h-11 px-8",
        icon:    "h-8 w-8 p-0",   // ← アイコン単体
      },
    },
    defaultVariants: {
      variant: "secondary",
      size:    "default",
    },
  },
)

/**********************
 * Button コンポーネント
 **********************/
export type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
)
Button.displayName = "Button"
