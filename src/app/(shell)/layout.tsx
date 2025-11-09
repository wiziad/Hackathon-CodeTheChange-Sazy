import NavigationWrapper from "@/components/navigation-wrapper";
import { StickyHeader } from "@/components/ui/base";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StickyHeader />
      <main className="flex-1 p-4 pb-20 md:pb-4">
        {children}
      </main>
      <NavigationWrapper />
    </>
  );
}