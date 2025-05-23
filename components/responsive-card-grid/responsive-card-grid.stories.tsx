"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { ResponsiveCardGrid } from "./responsive-card-grid"
import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const meta: Meta<typeof ResponsiveCardGrid> = {
    title: "Components/ResponsiveCardGrid",
    component: ResponsiveCardGrid,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        cardSize: {
            control: { type: "select" },
            options: ["sm", "md", "lg"],
        },
        aspectRatio: {
            control: { type: "select" },
            options: ["auto", "square", "video", "portrait", "wide"],
        },
        gap: {
            control: { type: "select" },
            options: ["sm", "md", "lg"],
        },
    },
}

export default meta
type Story = StoryObj<typeof ResponsiveCardGrid>

// Generate mock data
const categories = ["Electronics", "Clothing", "Home", "Books", "Toys"]
const mockProducts = Array.from({ length: 12 }, (_, i) => ({
    id: `product-${i + 1}`,
    title: `Product ${i + 1}`,
    description: `This is a description for product ${i + 1}. It's a great product with many features.`,
    price: Math.floor(Math.random() * 100) + 10,
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: (Math.random() * 5).toFixed(1),
    image: `/placeholder.svg?height=200&width=200&text=Product+${i + 1}`,
}))

export const Default: Story = {
    args: {
        items: mockProducts,
        cardSize: "md",
        aspectRatio: "auto",
        gap: "md",
        renderer: {
            renderHeader: (item: any) => (
                <div className="flex justify-between items-start">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge variant="outline">{item.category}</Badge>
                </div>
            ),
            renderContent: (item: any) => (
                <div className="flex flex-col items-center justify-center h-full">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={200}
                        height={200}
                        className="object-cover rounded-md"
                    />
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
            ),
            renderFooter: (item: any) => (
                <div className="flex justify-between items-center w-full">
                    <span className="font-bold">${item.price}</span>
                    <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{item.rating}</span>
                    </div>
                </div>
            ),
        },
        sortOptions: [
            { label: "Price: Low to High", sortBy: "price", direction: "asc" },
            { label: "Price: High to Low", sortBy: "price", direction: "desc" },
            { label: "Rating", sortBy: "rating", direction: "desc" },
        ],
        filterOptions: [
            ...categories.map((category) => ({
                label: category,
                filterFn: (item: any) => item.category === category,
            })),
        ],
    },
}

export const SmallCards: Story = {
    args: {
        ...Default.args,
        cardSize: "sm",
        renderer: {
            renderContent: (item: any) => (
                <div className="flex flex-col items-center justify-center h-full">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                    />
                    <h3 className="mt-2 font-medium text-sm">{item.title}</h3>
                    <span className="font-bold text-sm">${item.price}</span>
                </div>
            ),
        },
    },
}

export const LargeCards: Story = {
    args: {
        ...Default.args,
        cardSize: "lg",
        aspectRatio: "wide",
    },
}

export const WithCardClick: Story = {
    render: (args: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

        return (
            <div className="space-y-4">
                <ResponsiveCardGrid {...args} onCardClick={(item) => setSelectedItem(item)} />
                {selectedItem && (
                    <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Selected Item:</h3>
                        <pre className="text-sm bg-muted p-2 rounded overflow-auto">{JSON.stringify(selectedItem, null, 2)}</pre>
                    </div>
                )}
            </div>
        )
    },
    args: {
        ...Default.args,
    },
}

export const CustomAspectRatio: Story = {
    args: {
        ...Default.args,
        aspectRatio: "square",
    },
}

export const NoItems: Story = {
    args: {
        ...Default.args,
        items: [],
    },
}
