import { CatalogManager } from "@/components/admin/catalog-manager";

export default function AdminPrasadManagementPage() {
  return (
    <CatalogManager
      title="Prasadam Catalog"
      subtitle="Manage prasadam item details, pricing, images, and stock visibility used by the public booking page."
      endpoint="/api/admin/prasadam"
      uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      booleanBadgeField="inStock"
      booleanBadgeLabel={["In Stock", "Out of Stock"]}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "nameML", label: "Name (Malayalam)", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "grams", label: "Weight (grams)", type: "number", required: true },
        { name: "price", label: "Price", type: "number", required: true },
        { name: "image", label: "Image URL", type: "text", required: true },
        { name: "gallery", label: "Gallery URLs (comma separated)", type: "text" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "inStock", label: "In Stock", type: "checkbox" },
      ]}
    />
  );
}
