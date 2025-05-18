import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Law Practice Management</h1>
        </div>
      </header>
      <main className="flex-1 bg-muted/40">
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">Manage your law practice efficiently</h2>
              <p className="text-xl text-muted-foreground">
                Streamline client management, track matters, and grow your practice with our comprehensive platform.
              </p>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button asChild size="lg">
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="/law-firm-management.png"
                alt="Law Practice Management"
                className="rounded-lg shadow-lg"
                width={400}
                height={400}
              />
            </div>
          </div>
        </section>
        <section className="bg-background py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold">Client Management</h3>
                <p className="text-muted-foreground">
                  Easily manage your clients with comprehensive profiles and contact information.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold">Matter Tracking</h3>
                <p className="text-muted-foreground">
                  Track all legal matters with detailed information and status updates.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-2 text-xl font-bold">Secure Access</h3>
                <p className="text-muted-foreground">
                  Protect your data with secure authentication and user-specific access.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Law Practice Management. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
