import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4fb_0%,#f8fbff_100%)]">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <div className="bg-transparent px-4 pt-4 md:px-8 md:pt-8">
            <div className="mx-auto max-w-7xl">
            <DashboardHeader />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
