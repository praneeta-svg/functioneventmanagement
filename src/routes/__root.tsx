import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'


import '../styles.css'
import { IdentityProvider } from '../lib/identity-context'
import { CallbackHandler } from '../components/CallbackHandler'

const siteName = 'VowSpace — Function Hall Booking & Management'
const siteDescription = 'Discover standout venues, manage event bookings, and run every celebration from one shared command center.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <IdentityProvider><CallbackHandler>{children}</CallbackHandler></IdentityProvider>
        <Scripts />
      </body>
    </html>
  )
}
