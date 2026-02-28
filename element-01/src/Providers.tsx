"use client";

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
}
