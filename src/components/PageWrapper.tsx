import React from 'react';

export const PageWrapper: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
}> = ({ children, title, description }) => {
  React.useEffect(() => {
    if (title) {
      document.title = `${title} — BYEADS`;
    }
    return () => {
      document.title = 'BYEADS — Bye Ads. Hello Security.';
    };
  }, [title]);

  React.useEffect(() => {
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [description]);

  return (
    <main style={{ flex: 1, padding: '36px 0 64px' }}>
      <div className="container">
        {children}
      </div>
    </main>
  );
};

export default PageWrapper;
