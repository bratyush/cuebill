import NavBar from "../_components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavBar/>
      {children}
    </div>
  );
}
