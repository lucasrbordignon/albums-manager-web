export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">{children}</div>
}
