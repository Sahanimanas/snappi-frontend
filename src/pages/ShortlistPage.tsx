import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Shortlist } from "@/components/shortlist/Shortlist";

export const ShortlistPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Shortlist />
        </main>
      </div>
    </div>
  );
};