import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Manage clients, users, and homepage content from the left menu.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Public Website</p>
          <p className="mt-3 text-2xl font-bold text-slate-800">Live CMS Ready</p>
          <p className="mt-2 text-sm text-slate-500">
            The homepage now uses the website-style frontend and is editable from CMS Editor.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Clients</p>
          <p className="mt-3 text-2xl font-bold text-slate-800">Manage Securely</p>
          <p className="mt-2 text-sm text-slate-500">
            Use Manage Clients and Assign Clients to control portal access and ownership.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Content</p>
          <p className="mt-3 text-2xl font-bold text-slate-800">Full Homepage Editing</p>
          <p className="mt-2 text-sm text-slate-500">
            Update text, navigation, contact details, services, footer, and image URLs.
          </p>
        </div>

        <Link
          href="/admin/partners"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm transition hover:border-amber-300 hover:bg-amber-100"
        >
          <p className="text-sm font-medium text-amber-700">Partners</p>
          <p className="mt-3 text-2xl font-bold text-slate-800">Manage Storage Folders</p>
          <p className="mt-2 text-sm text-slate-600">
            Assign a dedicated Spacebyte folder to each partner so their uploaded client files stay inside their allotted folder.
          </p>
        </Link>

        <Link
          href="/admin/messages"
          className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition hover:border-blue-300 hover:bg-blue-100"
        >
          <p className="text-sm font-medium text-blue-700">Inbox</p>
          <p className="mt-3 text-2xl font-bold text-slate-800">Website Messages</p>
          <p className="mt-2 text-sm text-slate-600">
            Review contact enquiries sent from the public website so nothing is missed even after the mail arrives.
          </p>
        </Link>

        <Link
          href="/admin/content#services-content"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100"
        >
          <p className="text-sm font-medium text-emerald-700">Services</p>
          <p className="mt-3 text-2xl font-bold text-slate-800">Edit Service Descriptions</p>
          <p className="mt-2 text-sm text-slate-600">
            Jump directly to the service editor and update the descriptions clients see after clicking a service.
          </p>
        </Link>
      </div>
    </div>
  );
}
