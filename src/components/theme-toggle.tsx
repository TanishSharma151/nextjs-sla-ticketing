'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Moon,
  Sun,
} from 'lucide-react';

import {
  useTheme,
} from 'next-themes';

import { Button }
  from '@/components/ui/button';

export default function ThemeToggle() {
  const {
    theme,
    setTheme,
  } = useTheme();

  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="
          border-border
          bg-background
        "
      />
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        setTheme(
          theme === 'dark'
            ? 'light'
            : 'dark',
        )
      }
      className="
        border-border
        bg-background
      "
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}