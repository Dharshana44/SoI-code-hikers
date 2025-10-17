import React, { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="app-root">
      <Sidebar collapsed={collapsed} />
      <div className={`main-area ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <TopNav onToggleSidebar={() => setCollapsed((c) => !c)} collapsed={collapsed} />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
