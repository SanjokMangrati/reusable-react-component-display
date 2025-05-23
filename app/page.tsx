"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table/data-table"
import { ResponsiveCardGrid } from "@/components/responsive-card-grid/responsive-card-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Code, Copy, Check, Info, Star, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

//Code snippet section
function CodeSnippet({ code, language = "tsx" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <pre className="rounded-lg bg-muted p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

// Component documentation section
function ComponentSection({
  title,
  description,
  children,
  usage,
  features,
}: {
  title: string
  description: string
  children: React.ReactNode
  usage: string
  features: string[]
}) {
  const [showCode, setShowCode] = useState(false)

  const toggleCode = useCallback(() => {
    setShowCode((prev) => !prev)
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <Card className="border-2 border-primary/10">
            <CardContent className="p-3 sm:p-6">{children}</CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-semibold text-base sm:text-lg">Implementation</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCode}
                className="flex items-center gap-1 self-start sm:self-auto"
              >
                <Code className="h-4 w-4" />
                <span className="text-sm">{showCode ? "Hide Code" : "Show Code"}</span>
                {showCode ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {showCode && <CodeSnippet code={usage} />}
          </div>
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                Features
              </CardTitle>
              <CardDescription className="text-sm">Key capabilities of this component</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full text-sm" asChild>
                <a href="#" className="flex items-center gap-1">
                  <ExternalLink className="h-4 w-4" />
                  View Documentation
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const analyticsData = Array.from({ length: 15 }, (_, i) => ({
    id: `visit-${i + 1000}`,
    page: [`/home`, `/products`, `/about`, `/contact`, `/blog`][Math.floor(Math.random() * 5)],
    visitors: Math.floor(Math.random() * 1000) + 100,
    bounceRate: Math.floor(Math.random() * 100),
    duration: Math.floor(Math.random() * 300) + 5,
    conversion: Math.random() * 10,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  }))

  const inventoryData = Array.from({ length: 15 }, (_, i) => ({
    id: `SKU-${i + 1000}`,
    name: `Product ${i + 1}`,
    category: ["Electronics", "Clothing", "Food", "Books", "Toys"][Math.floor(Math.random() * 5)],
    price: Math.floor(Math.random() * 1000) + 10,
    stock: Math.floor(Math.random() * 100),
    status: ["In Stock", "Low Stock", "Out of Stock"][Math.floor(Math.random() * 3)],
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  }))

  const productData = Array.from({ length: 8 }, (_, i) => ({
    id: `product-${i + 1}`,
    title: `Product ${i + 1}`,
    description: `Premium quality product with excellent features and durability.`,
    price: Math.floor(Math.random() * 100) + 10,
    category: ["Electronics", "Clothing", "Home", "Books", "Toys"][Math.floor(Math.random() * 5)],
    rating: (Math.random() * 5).toFixed(1),
    image: `/landscape-placeholder.svg?height=200&width=200&text=Product+${i + 1}`,
    featured: Math.random() > 0.7,
    discount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0,
  }))

  const teamData = Array.from({ length: 4 }, (_, i) => ({
    id: `team-${i + 1}`,
    name: [`Alex Johnson`, `Sam Smith`, `Jordan Lee`, `Casey Taylor`][i],
    role: [`CEO`, `CTO`, `Designer`, `Developer`][i],
    bio: `Experienced professional with ${Math.floor(Math.random() * 15) + 2} years in the industry.`,
    image: `/landscape-placeholder.svg?height=300&width=300&text=Team+Member+${i + 1}`,
    department: ["Executive", "Technology", "Design", "Engineering"][i],
  }))

  const dataTableUsage = `// Import the component
import { DataTable } from "@/components/data-table/data-table";

// Define your columns
const columns = [
  { key: "id", title: "ID" },
  { key: "page", title: "Page" },
  { key: "visitors", title: "Visitors" },
  { 
    key: "bounceRate", 
    title: "Bounce Rate",
    renderCell: (row) => \`\${row.bounceRate}%\` 
  },
];

// Use the component
<DataTable
  columns={columns}
  data={analyticsData}
  pageSize={10}
  onSort={(column, direction) => {
    // Handle sorting
  }}
/>`

  const cardGridUsage = `// Import the component
import { ResponsiveCardGrid } from "@/components/responsive-card-grid/responsive-card-grid";

// Define your renderer
const renderer = {
  renderHeader: (item) => (
    <div className="flex justify-between">
      <h3 className="font-medium">{item.title}</h3>
      <Badge>{item.category}</Badge>
    </div>
  ),
  renderContent: (item) => (
    <div className="flex flex-col items-center">
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.title}
        width={200}
        height={200}
        className="rounded-md"
      />
      <p className="mt-2 text-sm line-clamp-2">
        {item.description}
      </p>
    </div>
  ),
  renderFooter: (item) => (
    <div className="flex justify-between w-full">
      <span className="font-bold">\${item.price}</span>
      <div className="flex items-center">
        <span>⭐</span>
        <span>{item.rating}</span>
      </div>
    </div>
  ),
};

// Use the component
<ResponsiveCardGrid
  items={productData}
  renderer={renderer}
  cardSize="md"
  sortOptions={[
    { label: "Price: Low to High", sortBy: "price" },
    { label: "Rating", sortBy: "rating", direction: "desc" },
  ]}
/>`


  return (
    <main className="container mx-auto p-3 sm:p-4 lg:p-6 max-w-7xl">
      <section className="space-y-4 sm:space-y-6 pb-6 pt-4 sm:pb-8 sm:pt-6 md:pb-12 md:pt-10 lg:py-16">
        <div className="flex max-w-4xl flex-col items-start gap-2 sm:gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tighter">
            Resuable React Components
          </h1>
          <p className="max-w-3xl text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Reusable and performance optimised components built with TypeScript and Shadcn
          </p>
        </div>
      </section>

      <Tabs defaultValue="datatable" className="space-y-6 sm:space-y-8 lg:space-y-12">
        <TabsList className="grid w-full grid-cols-2 h-auto p-1">
          <TabsTrigger value="datatable" className="text-xs sm:text-sm py-2 sm:py-3">
            Data Table
          </TabsTrigger>
          <TabsTrigger value="cardgrid" className="text-xs sm:text-sm py-2 sm:py-3">
            Card Grid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datatable" className="space-y-8 sm:space-y-12">
          <ComponentSection
            title="Universal Data Table"
            description="A high-performance data table component with virtualized rows, sorting, and pagination."
            usage={dataTableUsage}
            features={[
              "Virtualized rows for handling large datasets efficiently",
              "Built-in client-side pagination with customizable page size",
              "Column sorting with custom sort functions",
              "Custom cell renderers for flexible content display",
              "Fully accessible with keyboard navigation and ARIA attributes",
              "Customizable theming for header and row styles",
              "Loading state for asynchronous data fetching",
            ]}
          >
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Analytics Dashboard Example</h3>
                <div className="overflow-hidden">
                  <DataTable
                    columns={[
                      { key: "date", title: "Date", width: 100 },
                      { key: "page", title: "Page", width: 120 },
                      { key: "visitors", title: "Visitors", width: 100 },
                      {
                        key: "bounceRate",
                        title: "Bounce Rate",
                        width: 140,
                        renderCell: (row) => (
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "w-12 sm:w-16 h-2 rounded-full mr-2",
                                row.bounceRate > 70
                                  ? "bg-red-500"
                                  : row.bounceRate > 40
                                    ? "bg-yellow-500"
                                    : "bg-green-500",
                              )}
                            />
                            <span className="text-sm">{row.bounceRate}%</span>
                          </div>
                        ),
                      },
                      {
                        key: "duration",
                        title: "Duration",
                        width: 100,
                        renderCell: (row) => <span className="text-sm">{row.duration}s</span>,
                      },
                    ]}
                    data={analyticsData}
                    pageSize={5}
                    height={280}
                    theme={{
                      headerBg: "bg-primary/5",
                      rowHoverColor: "hover:bg-primary/5",
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Inventory Management Example</h3>
                <div className="overflow-hidden">
                  <DataTable
                    columns={[
                      { key: "id", title: "SKU", width: 100 },
                      { key: "name", title: "Product", width: 150 },
                      { key: "category", title: "Category", width: 120 },
                      {
                        key: "price",
                        title: "Price",
                        width: 100,
                        renderCell: (row) => <span className="font-medium">${row.price}</span>,
                      },
                      { key: "stock", title: "Stock", width: 80 },
                      {
                        key: "status",
                        title: "Status",
                        width: 120,
                        renderCell: (row) => {
                          const colorMap: Record<string, string> = {
                            "In Stock": "bg-green-100 text-green-800",
                            "Low Stock": "bg-yellow-100 text-yellow-800",
                            "Out of Stock": "bg-red-100 text-red-800",
                          }
                          return (
                            <Badge className={cn("text-xs", colorMap[row.status] || "")} variant="outline">
                              {row.status}
                            </Badge>
                          )
                        },
                      },
                    ]}
                    data={inventoryData}
                    pageSize={5}
                    height={280}
                  />
                </div>
              </div>
            </div>
          </ComponentSection>
        </TabsContent>

        <TabsContent value="cardgrid" className="space-y-8 sm:space-y-12">
          <ComponentSection
            title="Responsive Card Grid"
            description="A flexible grid layout for displaying cards with sorting, filtering, and responsive design."
            usage={cardGridUsage}
            features={[
              "Responsive grid layout that adapts to different screen sizes",
              "Customizable card sizes (small, medium, large)",
              "Flexible aspect ratios (auto, square, video, portrait, wide)",
              "Built-in sorting and filtering capabilities",
              "Custom rendering for card header, content, and footer",
              "Empty state handling when no items match filters",
              "Fully accessible with keyboard navigation and ARIA attributes",
            ]}
          >
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Product Catalog Example</h3>
                <ResponsiveCardGrid
                  items={productData}
                  cardSize="md"
                  aspectRatio="auto"
                  gap="md"
                  renderer={{
                    renderHeader: (item) => (
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium text-sm sm:text-base truncate">{item.title}</h3>
                        {item.featured && <Badge className="bg-primary text-xs flex-shrink-0">Featured</Badge>}
                        {!item.featured && (
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                    ),
                    renderContent: (item) => (
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <div className="relative w-full max-w-[150px] sm:max-w-[200px]">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={200}
                            height={200}
                            className="object-cover rounded-md w-full h-auto"
                          />
                          {item.discount > 0 && (
                            <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                              -{item.discount}%
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground text-center line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    ),
                    renderFooter: (item) => (
                      <div className="flex justify-between items-center w-full">
                        <div>
                          {item.discount > 0 ? (
                            <div className="flex flex-col">
                              <span className="text-xs line-through text-muted-foreground">
                                ${(item.price + (item.price * item.discount) / 100).toFixed(2)}
                              </span>
                              <span className="font-bold text-red-500 text-sm">${item.price.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-sm">${item.price.toFixed(2)}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs sm:text-sm">{item.rating}</span>
                        </div>
                      </div>
                    ),
                  }}
                  sortOptions={[
                    { label: "Price: Low to High", sortBy: "price", direction: "asc" },
                    { label: "Price: High to Low", sortBy: "price", direction: "desc" },
                    { label: "Rating", sortBy: "rating", direction: "desc" },
                  ]}
                  filterOptions={[
                    {
                      label: "Featured Items",
                      filterFn: (item) => item.featured === true,
                    },
                    {
                      label: "On Sale",
                      filterFn: (item) => item.discount > 0,
                    },
                    ...["Electronics", "Clothing", "Home", "Books", "Toys"].map((category) => ({
                      label: category,
                      filterFn: (item: any) => item.category === category,
                    })),
                  ]}
                />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Team Directory Example</h3>
                <ResponsiveCardGrid
                  items={teamData}
                  cardSize="lg"
                  aspectRatio="auto"
                  gap="lg"
                  renderer={{
                    renderHeader: (item) => (
                      <div className="text-center">
                        <h3 className="font-semibold text-sm sm:text-lg">{item.name}</h3>
                        <p className="text-muted-foreground text-xs sm:text-base">{item.role}</p>
                      </div>
                    ),
                    renderContent: (item) => (
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <div className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-2 sm:mb-4">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <p className="text-center text-xs sm:text-sm text-muted-foreground">{item.bio}</p>
                      </div>
                    ),
                    renderFooter: (item) => (
                      <div className="flex justify-center w-full">
                        <Badge variant="outline" className="text-xs">
                          {item.department}
                        </Badge>
                      </div>
                    ),
                  }}
                  sortOptions={[{ label: "Department", sortBy: "department", direction: "asc" }]}
                  filterOptions={[
                    {
                      label: "Executive",
                      filterFn: (item) => item.department === "Executive",
                    },
                    {
                      label: "Technology",
                      filterFn: (item) => item.department === "Technology" || item.department === "Engineering",
                    },
                  ]}
                />
              </div>
            </div>
          </ComponentSection>
        </TabsContent>
      </Tabs>

      <section className="mt-12 sm:mt-16 border-t pt-6 sm:pt-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Component Reusability & Integration</h2>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Modular Architecture</CardTitle>
              <CardDescription className="text-sm">Components designed for maximum reusability</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Fully typed props with comprehensive TypeScript definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Composition-based design for flexible customization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Consistent API design across all components</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Performance Optimized</CardTitle>
              <CardDescription className="text-sm">Built for speed and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Virtualization for handling large datasets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Memoization to prevent unnecessary re-renders</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Optimized bundle size with tree-shaking support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
