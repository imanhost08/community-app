"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari kajian atau produk..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>
    </form>
  )
}
