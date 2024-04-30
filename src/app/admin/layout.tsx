import NavBar from "../_components/navbar";

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
