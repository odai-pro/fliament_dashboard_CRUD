"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { setCookie, getCookie } from 'cookies-next';

type Language = "en" | "ar";

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check cookie first, then localStorage, then default
        const cookieLang = getCookie('language') as Language | undefined;
        const localLang = localStorage.getItem("language") as Language | null;
        
        const savedLanguage = cookieLang || localLang || 'en';

        if (savedLanguage) {
            setLanguage(savedLanguage);
            document.documentElement.setAttribute("lang", savedLanguage);
            document.documentElement.setAttribute("dir", savedLanguage === "ar" ? "rtl" : "ltr");
        }
        setMounted(true);
    }, []);

    const toggleLanguage = () => {
        const newLanguage: Language = language === "en" ? "ar" : "en";
        
        // 1. Update State
        setLanguage(newLanguage);
        
        // 2. Update Storage
        localStorage.setItem("language", newLanguage);
        setCookie('language', newLanguage, { maxAge: 60 * 60 * 24 * 365, path: '/' });
        
        // 3. Update Document
        document.documentElement.setAttribute("lang", newLanguage);
        document.documentElement.setAttribute("dir", newLanguage === "ar" ? "rtl" : "ltr");
        
        // 4. Force Reload to ensure Server Components and HTML attributes update
        // Using setTimeout to ensure cookies are written
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
