import ProductListing from "./ProductListing";

interface PageProps {
  params: Promise<{
    occasion: string;
  }>;
}

export default async function OccasionPage({ params }: PageProps) {
  // ✅ unwrap params
  const { occasion } = await params;

  console.log("SERVER → occasion:", occasion);

  return (
    <ProductListing
      key={occasion}      // forces remount on route change
      occasion={occasion} // plain string
    />
  );
}
