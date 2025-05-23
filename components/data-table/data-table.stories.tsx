"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "./data-table"

const meta: Meta<typeof DataTable> = {
    title: "Components/DataTable",
    component: DataTable,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        pageSize: {
            control: { type: "number", min: 5, max: 50, step: 5 },
        },
        height: {
            control: { type: "number", min: 200, max: 800, step: 50 },
        },
        theme: {
            control: "object",
        },
    },
}

export default meta
type Story = StoryObj<typeof DataTable>

// Generate mock data
const generateMockData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `ID-${i + 1000}`,
        name: `Product ${i + 1}`,
        category: ["Electronics", "Clothing", "Food", "Books", "Toys"][Math.floor(Math.random() * 5)],
        price: Math.floor(Math.random() * 1000) + 10,
        stock: Math.floor(Math.random() * 100),
        status: ["In Stock", "Low Stock", "Out of Stock"][Math.floor(Math.random() * 3)],
    }))
}

const mockData = generateMockData(100)

export const Default: Story = {
    args: {
        columns: [
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "category", title: "Category" },
            { key: "price", title: "Price" },
            { key: "stock", title: "Stock" },
            { key: "status", title: "Status" },
        ],
        data: mockData,
        pageSize: 10,
        height: 400,
    },
}

export const WithCustomRenderers: Story = {
    args: {
        columns: [
            { key: "id", title: "ID" },
            { key: "name", title: "Name" },
            { key: "category", title: "Category" },
            {
                key: "price",
                title: "Price",
                renderCell: (row: any) => `$${row.price.toFixed(2)}`,
            },
            { key: "stock", title: "Stock" },
            {
                key: "status",
                title: "Status",
                renderCell: (row: any) => {
                    const colorMap: Record<string, string> = {
                        "In Stock": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                        "Low Stock": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                        "Out of Stock": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                    }
                    return (
                        <Badge className={colorMap[row.status] || ""} variant="outline">
                            {row.status}
                        </Badge>
                    )
                },
            },
        ],
        data: mockData,
        pageSize: 10,
        height: 400,
    },
}

export const WithRowClick: Story = {
    render: (args: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)

        return (
            <div className="space-y-4">
                <DataTable {...args} onRowClick={(row) => setSelectedRow(row)} />
                {selectedRow && (
                    <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Selected Row:</h3>
                        <pre className="text-sm bg-muted p-2 rounded overflow-auto">{JSON.stringify(selectedRow, null, 2)}</pre>
                    </div>
                )}
            </div>
        )
    },
    args: {
        ...Default.args,
    },
}

export const WithSorting: Story = {
    render: (args: any) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [sortInfo, setSortInfo] = useState<{ column: string; direction: "asc" | "desc" } | null>(null)

        return (
            <div className="space-y-4">
                <DataTable {...args} onSort={(column, direction) => setSortInfo({ column, direction })} />
                {sortInfo && (
                    <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-2">Sort Information:</h3>
                        <p>
                            Column: <span className="font-mono">{sortInfo.column}</span>
                        </p>
                        <p>
                            Direction: <span className="font-mono">{sortInfo.direction}</span>
                        </p>
                    </div>
                )}
            </div>
        )
    },
    args: {
        ...Default.args,
    },
}

export const CustomTheme: Story = {
    args: {
        ...Default.args,
        theme: {
            headerBg: "bg-primary/10",
            rowHoverColor: "hover:bg-primary/5",
        },
    },
}

export const LargeDataset: Story = {
    args: {
        ...Default.args,
        data: generateMockData(1000),
        height: 600,
    },
}

export const Empty: Story = {
    args: {
        ...Default.args,
        data: [],
    },
}
