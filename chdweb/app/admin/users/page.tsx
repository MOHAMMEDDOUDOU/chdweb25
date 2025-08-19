import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen admin-gradient-bg flex">
      <SidebarProvider>
        <AdminSidebar className="bg-black/60 backdrop-blur-md border-r border-orange-500/20 shadow-xl" />
      </SidebarProvider>
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-black/70 rounded-3xl shadow-2xl p-8 w-full max-w-3xl flex flex-col items-center">
          <div className="w-full min-h-[300px] flex items-center justify-center text-gray-400 text-xl">
            لا يوجد مستخدمون بعد
          </div>
        </div>
      </main>
    </div>
  );
}
