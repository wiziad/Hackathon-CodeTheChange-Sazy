import NavigationWrapper from "@/components/navigation-wrapper";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <> 
      <main className="flex-1 p-4 pb-20 md:pb-4">
        {children}
      </main>
      <NavigationWrapper />
    </>
  );
}