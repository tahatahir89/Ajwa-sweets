import ContactView from "../../components/ContactView.jsx";
import { business } from "../../lib/business.js";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${business.displayName} — ${business.address.line1}, ${business.address.line2}, ${business.address.city}. Open ${business.hours.display}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactView />;
}
