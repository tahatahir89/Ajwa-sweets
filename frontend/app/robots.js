import { siteUrl } from "../lib/business.js";

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/checkout", "/cart"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
