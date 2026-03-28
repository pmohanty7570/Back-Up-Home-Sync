import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Receipt, CalendarDays, Refrigerator, Wrench, UserCircle, Shield } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useTheme } from '../hooks/useTheme';
import OnboardingModal from './shared/OnboardingModal';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '@/lib/ThemeContext';
const ADMIN_EMAILS = ['shreyassamal05@gmail.com', 'sarishdinesh@gmail.com', 'pmohanty.live@gmail.com', 'samarthravi30@gmail.com'];

const baseTabs = [
  { path: '/', icon: Receipt, label: 'Bills' },
  { path: '/event-planner', icon: CalendarDays, label: 'Events' },
  { path: '/fridge', icon: Refrigerator, label: 'Pantry Pal' },
  { path: '/fix-it', icon: Wrench, label: 'Damage' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
];

function ThemedLayout() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = React.useState(null);
  React.useEffect(() => { base44.auth.me().then(setCurrentUser).catch(() => {}); }, []);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const list = await base44.entities.UserProfile.list();
      return list[0] || null;
    },
  });
  useTheme(profile?.theme || 'purple', profile?.dark_mode || false);

  const needsOnboarding = !profileLoading && !profile?.username && !profile?.home_address && !profile?.skip_address;
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);
  const tabs = isAdmin ? [...baseTabs, { path: '/admin', icon: Shield, label: 'Admin' }] : baseTabs;

  const handleOnboardingComplete = async (form) => {
    await base44.entities.UserProfile.create({
      username: form.name,
      home_address: form.home_address || '',
      skip_address: form.skip_address || false,
    });
    queryClient.invalidateQueries({ queryKey: ['user-profile'] });
  };

  const location = useLocation();
  const fontSize = { small: '13px', medium: '15px', large: '17px' }[profile?.font_size] || '15px';

  return (
    <div className="min-h-screen bg-background font-body flex flex-col" style={{ fontSize }}>
      {needsOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
        {/* Header with Theme Controls */}
        <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 smooth-transition">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary" />
              <span className="font-bold text-lg">HomeSync AI</span>
            </div>
      
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm hover:text-primary smooth-transition">Home</a>
              <a href="/life-sync" className="text-sm hover:text-primary smooth-transition">LifeSync</a>
              <a href="/profile" className="text-sm hover:text-primary smooth-transition">Settings</a>
            </nav>
      
            <ThemeSwitcher />
          </div>
        </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map(({ path, icon: Icon, label }) => {
            const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'nav-active-glow' : ''}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span className={`text-[11px] font-medium ${isActive ? 'font-semibold text-gradient' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function Layout() {
  return <ThemedLayout />;
}
