import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  try {
    if (!locale) return notFound();
    return {
      locale,
      messages: (await import(`./messages/${locale}.json`)).default
    };
  } catch (error) {
    notFound();
  }
});