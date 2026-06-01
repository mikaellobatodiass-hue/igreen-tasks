import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar />
      <main className="flex-1 pl-60 transition-all duration-300">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  )
}
