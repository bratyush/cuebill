import NavBar from "../_components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <NavBar/>
      {children}
    </div>
  );
}
