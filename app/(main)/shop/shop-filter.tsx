"use client"

import { useRouter } from "next/navigation"

export function ShopFilter({
  categories,
  currentCategory,
}: {
  categories: string[]
  currentCategory?: string
}) {
  const router = useRouter()

  const handleFilter = (category: string) => {
    if (category === "all") {
      router.push("/shop")
    } else {
      router.push(`/shop?category=${encodeURIComponent(category)}`)
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      <button
        onClick={() => handleFilter("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          !currentCategory || currentCategory === "all"
            ? "bg-accent text-accent-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            currentCategory === category
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
