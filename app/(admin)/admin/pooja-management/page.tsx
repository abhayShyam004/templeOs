import { CatalogManager } from "@/components/admin/catalog-manager";

export default function AdminPoojaManagementPage() {
  return (
    <CatalogManager
      title="Pooja Catalog"
      subtitle="create and manage poojas"
      endpoint="/api/admin/poojas"
      booleanBadgeField="available"
      booleanBadgeLabel={["Visible", "Hidden"]}
      fields={[
        { name: "name", label: "Name", type: "text" },
        { name: "nameML", label: "Name (Malayalam)", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "descriptionML", label: "Description (Malayalam)", type: "textarea" },
        { name: "price", label: "Price", type: "number" },
        { name: "duration", label: "Duration", type: "text" },
        { name: "image", label: "Image URL", type: "text" },
        { name: "gallery", label: "Gallery URLs (comma separated)", type: "text" },
        { name: "sortOrder", label: "Sort Order", type: "number" },
        { name: "available", label: "Visible", type: "checkbox" },
      ]}
    />
  );
}
