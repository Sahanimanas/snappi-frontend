import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Shortlist } from "@/components/shortlist/Shortlist";

export const ShortlistPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-w-0">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 w-full min-w-0">
          <Shortlist />
        </main>
      </div>
    </div>
  );
};