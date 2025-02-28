// components/Layout.tsx

import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Legrand Quotation Tool - Sagarawat Electricals' 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Legrand Quotation Tool for Sagarawat Electricals" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-600 border-t border-gray-200">
        <p>© 1980- Sagarawat Electricals, 25-26 Dr. Bhabha Marg, Near Private Bus Stand, Neemuch M.P. - 458441</p>
        <p className="mt-1">Made with ❤️ by Adish Sagarawat in भारत.</p>
      </footer>
    </div>
  );
};

export default Layout;