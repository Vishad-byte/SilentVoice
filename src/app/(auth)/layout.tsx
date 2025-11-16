export const metadata = {
  title: 'SilentVoice',
  description: 'An anonymous messaging platform - Share your views, feedbacks, questions freely.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
