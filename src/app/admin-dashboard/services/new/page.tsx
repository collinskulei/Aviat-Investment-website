import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceEditor } from "../ServiceEditor";

export default function NewServicePage() {
  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Services", href: "/admin-dashboard/services" },
          { label: "New service" },
        ]}
        title="Add a service"
      />
      <ServiceEditor />
    </div>
  );
}
