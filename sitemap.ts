import { MetadataRoute } from "next";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kainatbano.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "shop", "categories", "about", "contact", "wishlist", "cart",
    "login", "register", "track-order", "privacy-policy", "terms",
  ].map((path) => ({
    url: `${siteUrl}/${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${siteUrl}/categories/${c.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
