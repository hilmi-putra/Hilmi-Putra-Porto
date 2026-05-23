import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { footerLinks, navItems, profile } from '../../data/portfolio';

export const Footer = () => {
  const { t } = useTranslation('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-500 px-3 pb-3 text-slate-950 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1460px] overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.16)] sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">{t('eyebrow')}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-normal sm:text-6xl">
              {t('title')}
            </h2>
          </div>

          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 font-black text-slate-950 transition-colors hover:text-blue-600"
              aria-label={`${t('emailLabel')}: ${profile.email}`}
            >
              <Mail size={18} />
              {profile.email}
            </a>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-slate-500" aria-label={`${t('locationLabel')}: ${profile.location}`}>
              <MapPin size={16} />
              {profile.location}
            </p>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {footerLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 transition-colors hover:border-blue-400 hover:text-blue-600"
                  >
                    <Icon size={16} />
                    {link.label}
                    <ArrowUpRight size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-bold text-slate-500">
            © {currentYear} {profile.shortName}. {t('rights')}
          </p>
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-600 transition-colors hover:bg-lime-300 hover:text-slate-950"
              >
                {t(`nav.${item.id}`)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
