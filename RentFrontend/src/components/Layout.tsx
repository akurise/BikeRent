import { PropsWithChildren } from 'react'
import { Navbar } from './Navbar'
import '../App.css'

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content">{children}</main>
    </div>
  )}
