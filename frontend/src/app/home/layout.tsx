export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <main className="flex-1 max-w-7xl mx-auto w-full p-6">
              {children}
            </main>
        </div>
      )
}