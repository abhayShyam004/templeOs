import { CatalogManager } from "@/components/admin/catalog-manager";

export default function AdminPrasadManagementPage() {
  return (
    <CatalogManager
      title="Prasadam Catalog"
      subtitle="Manage prasadam item details, pricing, images, and stock visibility used by the public booking page."
      endpoint="/api/admin/prasadam"
      booleanBadgeField="inStock"
      booleanBadgeLabel={["In Stock", "Out of Stock"]}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "nameML", label: "Name (Malayalam)", type: "text" },
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
