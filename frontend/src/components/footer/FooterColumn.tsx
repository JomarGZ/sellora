import type { ReactNode } from 'react'

interface FooterColumnProps {
  title: string
  children: ReactNode
}

export function FooterColumn({ title, children }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{title}</h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  )
}
