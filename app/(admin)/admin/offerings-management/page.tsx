import { CatalogManager } from "@/components/admin/catalog-manager";

export default function AdminOfferingsManagementPage() {
  return (
    <CatalogManager
      title="Offerings Catalog"
      subtitle="Create and manage offering items shown on the public offerings page."
      endpoint="/api/admin/offerings"
      uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      booleanBadgeField="inStock"
      booleanBadgeLabel={["In Stock", "Out of Stock"]}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "price", label: "Price", type: "number" },
        { name: "image", label: "Image URL", type: "text" },
        { name: "gallery", label: "Gallery URLs (comma separated)", type: "text" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "inStock", label: "In Stock", type: "checkbox" },
      ]}
    />
  );
}
