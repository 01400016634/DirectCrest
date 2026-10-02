import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomepageOverlay from "@/components/storefront/HomepageOverlay";
import SupportBubble from "@/components/layout/SupportBubble";
import { getSettings } from "@/actions/settings";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settingsRes = await getSettings();
  const settings = settingsRes.success ? settingsRes.settings : {};

  return (
    <HomepageOverlay>
      <Header settings={settings} />
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>
      <SupportBubble />
      <Footer settings={settings} />
    </HomepageOverlay>
  );
}
