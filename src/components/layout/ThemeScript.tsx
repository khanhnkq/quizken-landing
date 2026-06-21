/**
 * Inline theme bootstrap script. Runs before hydration to apply the saved
 * theme and prevent a flash of the wrong color scheme (FOUC).
 * Honors localStorage "quizken-theme" then falls back to system preference.
 */
export function ThemeScript() {
  const code = `
(function () {
  try {
    var stored = localStorage.getItem("quizken-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();
`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
