import { getSettings } from '@/actions/settings';
import SettingsForm from './SettingsForm';

export default async function AdminSettingsPage() {
  const result = await getSettings();
  const settings = result.success ? result.settings : null;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Store Settings</h1>
        <p className="text-gray-400 mt-2">Manage global store configurations, shipping logic, and payments.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
