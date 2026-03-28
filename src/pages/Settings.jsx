import { useTheme } from '@/lib/ThemeContext';
import { ThemeSettingsPanel } from '@/components/ThemeSwitcher';
import { ChevronRight, Bell, Shield, HelpCircle } from 'lucide-react';

export default function Settings() {
  const { backgroundTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-background smooth-transition">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl serif-display font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Theme Settings */}
          <div className="md:col-span-2 lg:col-span-3">
            <ThemeSettingsPanel />
          </div>

          {/* Other Settings */}
          <SettingsCard
            icon={Bell}
            title="Notifications"
            description="Manage your alerts"
          />
          <SettingsCard
            icon={Shield}
            title="Privacy"
            description="Control your data"
          />
          <SettingsCard
            icon={HelpCircle}
            title="Help"
            description="Get support"
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>HomeSync AI • Running on Base44</p>
        </div>
      </div>
    </div>
  );
}

const SettingsCard = ({ icon: Icon, title, description }) => (
  <button className="card-premium p-6 text-left hover:glow-primary group">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-foreground group-hover:text-primary smooth-transition">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary smooth-transition" />
    </div>
  </button>
);
