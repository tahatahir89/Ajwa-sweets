import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import Toast from "../components/Toast.jsx";
import Providers from "./providers.jsx";
import { business, siteUrl } from "../lib/business.js";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.displayName} | Bakery, Mithai & Cakes in Gulshan-e-Iqbal, Karachi`,
    template: `%s | ${business.displayName}`,
  },
  description: business.description,
  keywords: [
    "Ajwa Sweets",
    "Ajwa Sweets and Bakers",
    "bakery Karachi",
    "mithai Karachi",
    "cakes Gulshan-e-Iqbal",
    "sweets shop Karachi",
    "halwa puri Karachi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: business.displayName,
    title: `${business.displayName} | Bakery, Mithai & Cakes in Gulshan-e-Iqbal, Karachi`,
    description: business.description,
    images: [{ url: "/logo.jpg", width: 800, height: 800, alt: `${business.displayName} logo` }],
  },
  twitter: {
    card: "summary",
    title: business.displayName,
    description: business.description,
    images: ["/logo.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: business.displayName,
    legalName: business.legalName,
    description: business.description,
    image: `${siteUrl}/logo.jpg`,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${business.address.line1}, ${business.address.line2}`,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
      ],
      opens: business.hours.opens,
      closes: business.hours.closes,
    },
    servesCuisine: business.categories,
    sameAs: [business.social.facebook, business.googleMapsUrl].filter(Boolean),
  };

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <Navbar />
          <Toast />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
