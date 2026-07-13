import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Google Analytics 4 — loads via next/script (beforeInteractive).
 * Uses beforeInteractive so the script appears in the initial HTML,
 * which is required for Google's tag verification checker.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env to enable tracking.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="beforeInteractive"
      />
      <Script id="ga4-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

/**
 * Microsoft Clarity — free heatmap & session recording tool.
 * Set NEXT_PUBLIC_CLARITY_ID in .env to enable.
 */
export function MicrosoftClarity() {
  if (!CLARITY_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}
