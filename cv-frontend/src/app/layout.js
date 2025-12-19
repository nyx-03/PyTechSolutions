import "./globals.css";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";

export const metadata = {
  title: "PyTechSolutions",
  description:
    "Développement logiciel, site web, automatisation et solutions sur mesure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="site-grid-bg" />
        <Header />
        {children}
        <div id="site-footer">
          <Footer />
        </div>
      </body>
    </html>
  );
}
