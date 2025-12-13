import '@/styles/globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Shastik Fashions',
  description: 'Premium Indian Sarees Online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
