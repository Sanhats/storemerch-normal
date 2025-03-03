import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function NotFound() {
  return (
    <Container>
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-y-4">
          <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist.
          </p>
          <Button variant="outline" asChild>
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to categories
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}