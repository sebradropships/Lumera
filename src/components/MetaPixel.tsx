import { CAPI_PATH, META_PIXEL_ID, PIXEL_READY_EVENT } from "@/lib/pixel";

export { META_PIXEL_ID };

/**
 * Meta Pixel base code, emitted INLINE in the server HTML.
 *
 * It used to load through next/script at "afterInteractive", which injects the
 * tag client-side only once hydration is underway. On mobile that is seconds
 * after the click, and anyone who left before then was never counted at all:
 * PageView never fired, so Meta logged no Landing Page View. Between 11 and 20
 * Sep that lost 83% of Hoygi's link clicks — which both hid real traffic and
 * starved the optimiser of the signal it bids on, feeding straight back into a
 * CA$62+ CPM.
 *
 * Inline in the document means the browser parses and runs this during parse,
 * before React hydrates and before the first paint of anything below it. That
 * is the whole point: PageView must not wait for JavaScript we control.
 *
 * PageView and ViewContent also go to the Conversions API relay (src/lib/pixel.ts
 * has the same pair for AddToCart and InitiateCheckout), beaconed during parse
 * under the same event id handed to fbq. fbq only queues events until
 * fbevents.js has downloaded from Facebook; the beacon goes to our own origin
 * at once, so a visitor who leaves during that download, or blocks
 * facebook.com, still reaches Meta. Meta deduplicates the pair on
 * event_name + event_id.
 *
 * Idempotency: the `__hoygiPixelInit` flag guards the whole block, not just the
 * initialiser. Meta's own `if(f.fbq)return;` protects fbq from being rebuilt but
 * would still let a second execution fire a duplicate PageView.
 *
 * This is a server component: it emits markup and no client bundle of its own.
 * The <noscript> fallback is written as a raw HTML string because React does
 * not hydrate inside <noscript> — a browser with JS enabled never parses its
 * contents — so JSX children there can produce a mismatch warning while a raw
 * string cannot.
 */
export default function MetaPixel({
  viewContent,
}: {
  /** Fired alongside PageView. This is a single-product site, so the landing
   *  page IS the product page and there is no later moment to attribute it to. */
  viewContent?: Record<string, unknown>;
}) {
  /* Serialised into an inline script, so the string must not be able to close
     the tag. JSON.stringify handles quoting; escaping "<" covers "</script>".
     Every other value interpolated below is a module constant, never user
     input, so there is nothing else to escape. */
  const params = viewContent ? JSON.stringify(viewContent).replace(/</g, "\\u003c") : null;

  const viewContentCall = params
    ? `
var vid=eid();
fbq('track', 'ViewContent', ${params}, {eventID: vid});
beacon('ViewContent', vid, ${params});`
    : "";

  const baseCode = `if(!window.__hoygiPixelInit){window.__hoygiPixelInit=1;(function(){
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
function eid(){return window.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2)}
function beacon(name,id,data){try{var b=JSON.stringify({event_name:name,event_id:id,event_source_url:location.href,custom_data:data});
if(!(navigator.sendBeacon&&navigator.sendBeacon('${CAPI_PATH}',b)))fetch('${CAPI_PATH}',{method:'POST',body:b,keepalive:true}).catch(function(){})}catch(x){}}
var pid=eid();
fbq('track', 'PageView', {}, {eventID: pid});
beacon('PageView', pid);${viewContentCall}
window.dispatchEvent(new Event('${PIXEL_READY_EVENT}'));})();}`;

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: baseCode }} />

      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" />`,
        }}
      />
    </>
  );
}
