import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { WhyChooseUsEditor } from "../../WhyChooseUsEditor";

export default function NewWhyChooseUsPage() {
  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        crumbs={[
          { label: "Overview", href: "/admin-dashboard" },
          { label: "Site Content", href: "/admin-dashboard/content" },
          { label: "Why Choose Us", href: "/admin-dashboard/content/why-choose-us" },
          { label: "New card" },
        ]}
        title="Add a card"
      />
      <WhyChooseUsEditor />
    </div>
  );
}
