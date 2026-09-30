import { ref } from "vue";

// Outside the function = ONE shared value for the whole app
const isDarkMode = ref(false);

function applyTheme(dark) {
  isDarkMode.value = dark;
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function toggleTheme() {
  applyTheme(!isDarkMode.value);
}

function initTheme() {
  const saved = localStorage.getItem("theme");

  if (saved) {
    applyTheme(saved === "dark");
  } else {
    // No saved choice: follow the user's phone/computer setting
    applyTheme(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
}

export function useTheme() {
  return { isDarkMode, toggleTheme, initTheme };
}