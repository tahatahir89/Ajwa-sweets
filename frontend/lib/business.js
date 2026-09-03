// Real business info for Ajwa Sweets & Bakers, sourced from their Google Maps
// listing and Facebook page. Nothing here is invented — fields we couldn't
// confirm (phone, email) are left null and simply hidden by the UI rather
// than filled with placeholder text. Fill them in as soon as you have them.
export const business = {
  legalName: "Ajwa Sweet and Bakers",
  displayName: "Ajwa Sweets & Bakers",
  shortName: "Ajwa Sweets",
  tagline: "From breakfast to dessert, all in one place",
  description:
    "A neighbourhood bakery and sweets shop in Gulshan-e-Iqbal serving bakery goods, mithai, cookies and biscuits, samosas and fried snacks, desserts, cakes, and halwa puri.",
  address: {
    line1: "Shop # A-22, National Complex",
    line2: "Main Rashid Minhas Road, Block 10-A, Gulshan-e-Iqbal",
    city: "Karachi",
    region: "Sindh",
    country: "Pakistan",
    postalCode: null,
  },
  get fullAddress() {
    return `${this.address.line1}, ${this.address.line2}, ${this.address.city}, ${this.address.region}, ${this.address.country}`;
  },
  hours: {
    // Open daily, same hours every day per the Maps listing.
    opens: "07:00",
    closes: "23:45",
    display: "Daily, 7:00 AM – 11:45 PM",
  },
  categories: [
    "Bakery Goods",
    "Mithai",
    "Cookies & Biscuits",
    "Samosas & Fried Items",
    "Desserts",
    "Cakes",
    "Halwa Puri",
  ],
  social: {
    facebook: "https://www.facebook.com/AjwaSweetsAndBakers/",
  },
  googleMapsUrl:
    "https://www.google.com/maps/place/Ajwa+Sweet+and+Bakers/@24.9102187,66.9745015,12z/data=!4m7!3m6!1s0x3eb33909ff018b43:0x5d0f247d2935dcc!8m2!3d24.9102187!4d67.1063374",
  // Confirmed coordinates from the Maps listing, used for LocalBusiness structured data.
  geo: { latitude: 24.9102187, longitude: 67.1063374 },
  // Not publicly confirmed yet — leave blank until provided, do not guess.
  phone: null,
  email: null,
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ajwasweets.example.com";
