import { Button } from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from "react";

export const ThemeToggle = () => {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check if user has a saved preference
    const savedMode = localStorage.getItem("chakra-ui-color-mode") as "light" | "dark" | null;
    if (savedMode) {
      setColorMode(savedMode);
      updateTheme(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const mode = prefersDark ? "dark" : "light";
      setColorMode(mode);
      updateTheme(mode);
    }
  }, []);

  const updateTheme = (mode: "light" | "dark") => {
    // Update document class for Chakra UI
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);

    // Update data-theme attribute
    document.documentElement.setAttribute("data-theme", mode);

    // Update CSS variables manually for immediate effect
    const root = document.documentElement;
    if (mode === "dark") {
      root.style.setProperty("--chakra-colors-bg", "#1a202c");
      root.style.setProperty("--chakra-colors-text", "#ffffff");
      root.style.setProperty("--chakra-colors-card-bg", "#2d3748");
      root.style.setProperty("--chakra-colors-input-bg", "#2d3748");
      root.style.setProperty("--chakra-colors-border-color", "#4a5568");
    } else {
      root.style.setProperty("--chakra-colors-bg", "#ffffff");
      root.style.setProperty("--chakra-colors-text", "#1a202c");
      root.style.setProperty("--chakra-colors-card-bg", "rgba(255, 255, 255, 0.8)");
      root.style.setProperty("--chakra-colors-input-bg", "#ffffff");
      root.style.setProperty("--chakra-colors-border-color", "#cbd5e0");
    }
  };

  const toggleColorMode = () => {
    const newMode = colorMode === "light" ? "dark" : "light";
    setColorMode(newMode);
    localStorage.setItem("chakra-ui-color-mode", newMode);
    updateTheme(newMode);
  };

  return (
    <Button
      onClick={toggleColorMode}
      variant="ghost"
      size="md"
      aria-label="Toggle color mode"
      _hover={{
        bg: colorMode === "light" ? "gray.100" : "gray.700",
      }}
    >
      {colorMode === "light" ? <FaMoon /> : <FaSun />}
    </Button>
  );
};
