import Script from "next/script";

/** Meta Pixel ID for this site. */
export const META_PIXEL_ID = "1077952204953438";

/**
 * Meta Pixel base code.
 *
 * Loaded through next/script at "afterInteractive", so the tag is injected
 * once the page is interactive rather than blocking first paint — the pixel is
 * measurement, and it should never sit in front of the product.
 *
 * This is a server component: it emits markup and no client bundle of its own.
 * The snippet is passed via dangerouslySetInnerHTML because next/script does
 * not run inline children, and the <noscript> fallback is written the same way
 * — React does not hydrate inside <noscript> (a browser with JS enabled never
 * parses its contents), so JSX children there can produce a mismatch warning
 * while a raw HTML string cannot.
 */
export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>

      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`,
        }}
      />
    </>
  );
}
