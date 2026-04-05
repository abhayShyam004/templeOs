import { CatalogManager } from "@/components/admin/catalog-manager";

export default function AdminGoodiesManagementPage() {
  return (
    <CatalogManager
      title="Goodies Catalog"
      subtitle="Control all Muthappan goodies listed in the store: image, price, descriptions, and stock visibility."
      endpoint="/api/admin/goodies"
      booleanBadgeField="inStock"
      booleanBadgeLabel={["In Stock", "Out of Stock"]}
      fields={[
        { name: "name", label: "Name", type: "text" },
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
