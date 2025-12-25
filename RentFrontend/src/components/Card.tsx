import type { PropsWithChildren, ReactNode } from 'react'
import '../App.css'

interface CardProps extends PropsWithChildren {
  title?: string
  subtitle?: string
  actions?: ReactNode
}

export function Card({ title, subtitle, actions, children }: CardProps) {
  return (
    <div className="card">
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  )}
