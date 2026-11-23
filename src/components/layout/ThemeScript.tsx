/**
 * Inline theme bootstrap script. Runs before hydration to apply the saved
 * theme and prevent a flash of the wrong color scheme (FOUC).
 * Defaults to "light" unless the user explicitly saved "dark" in localStorage.
 */
export function ThemeScript() {
  const code = `
(function () {
  try {
    var stored = localStorage.getItem("quizken-theme");
    var theme = stored === "dark" ? "dark" : "light";
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
