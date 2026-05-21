import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kc-games.com"),
  title: "KC Games | Game Distribution and Riftbound TCG Retail Support",
  description:
    "KC Games Sdn Bhd is a Kuala Lumpur game distribution company supporting retail growth, market access, and Riftbound Trading Card Game distribution in the region.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  keywords: [
    "KC Games",
    "KC Games Sdn Bhd",
    "game distribution",
    "Riftbound",
    "Riftbound TCG",
    "trading card game distribution",
    "retailer signup",
    "Malaysia game distribution",
  ],
  openGraph: {
    title: "KC Games | Game Distribution and Riftbound TCG Retail Support",
    description:
      "KC Games connects game publishers, retailers, and partners across the region, including Riftbound Trading Card Game retail support.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KC Games | Game Distribution and Riftbound TCG Retail Support",
    description:
      "KC Games supports game distribution, market access, and Riftbound Trading Card Game retail partnerships.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="release" content="__KC_GAMES_RELEASE_EPOCH__" />
        <meta name="x-version" content="__KC_GAMES_COMMIT_SHORT__" />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M45XGQ5D');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M45XGQ5D"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
