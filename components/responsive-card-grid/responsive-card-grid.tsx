"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Filter, SortAsc, SortDesc } from "lucide-react"

export interface CardItem {
    id: string
    [key: string]: unknown
}

export type CardSize = "sm" | "md" | "lg"
export type AspectRatio = "auto" | "square" | "video" | "portrait" | "wide"

export interface CardRenderer<T extends CardItem> {
    /**
     * Render the card header content
     */
    renderHeader?: (item: T) => React.ReactNode
    /**
     * Render the card body content
     */
    renderContent: (item: T) => React.ReactNode
    /**
     * Render the card footer content
     */
    renderFooter?: (item: T) => React.ReactNode
}

export interface SortOption<T extends CardItem> {
    /**
     * Label to display in the sort dropdown
     */
    label: string
    /**
     * Key to sort by or custom sort function
     */
    sortBy: keyof T | ((a: T, b: T) => number)
    /**
     * Direction to sort
     * @default "asc"
     */
    direction?: "asc" | "desc"
}

export interface FilterOption<T extends CardItem> {
    /**
     * Label to display in the filter dropdown
     */
    label: string
    /**
     * Filter function to apply
     */
    filterFn: (item: T) => boolean
}

export interface ResponsiveCardGridProps<T extends CardItem> {
    /**
     * Array of items to display as cards
     */
    items: T[]
    /**
     * Card rendering functions
     */
    renderer: CardRenderer<T>
    /**
     * Size of the cards
     * @default "md"
     */
    cardSize?: CardSize
    /**
     * Aspect ratio of the cards
     * @default "auto"
     */
    aspectRatio?: AspectRatio
    /**
     * Gap between cards
     * @default "md"
     */
    gap?: "sm" | "md" | "lg"
    /**
     * Sort options for the grid
     */
    sortOptions?: SortOption<T>[]
    /**
     * Filter options for the grid
     */
    filterOptions?: FilterOption<T>[]
    /**
     * Callback when a card is clicked
     */
    onCardClick?: (item: T) => void
    /**
     * Optional CSS class name for additional styling
     */
    className?: string
}

export function ResponsiveCardGrid<T extends CardItem>({
    items,
    renderer,
    cardSize = "md",
    aspectRatio = "auto",
    gap = "md",
    sortOptions = [],
    filterOptions = [],
    onCardClick,
    className,
}: ResponsiveCardGridProps<T>) {
    const [activeSort, setActiveSort] = useState<SortOption<T> | null>(sortOptions.length > 0 ? sortOptions[0] : null)
    const [activeFilter, setActiveFilter] = useState<FilterOption<T> | null>(null)

    const processedItems = useMemo(() => {
        let result = [...items]

        if (activeFilter) {
            result = result.filter(activeFilter.filterFn)
        }

        if (activeSort) {
            result.sort((a, b) => {
                let comparison: number
                if (typeof activeSort.sortBy === "function") {
                    comparison = activeSort.sortBy(a, b)
                } else {
                    const aValue = a[activeSort.sortBy]
                    const bValue = b[activeSort.sortBy]
                    
                    if (typeof aValue === 'string' && typeof bValue === 'string') {
                        comparison = aValue.localeCompare(bValue)
                    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
                        comparison = aValue - bValue
                    } else {
                        const aString = String(aValue)
                        const bString = String(bValue)
                        comparison = aString.localeCompare(bString)
                    }
                }
                return activeSort.direction === "desc" ? -comparison : comparison
            })
        }

        return result
    }, [items, activeSort, activeFilter])

    const gridCols = {
        sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
        md: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        lg: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    }

    const gapSize = {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
    }

    const getAspectRatio = () => {
        switch (aspectRatio) {
            case "square":
                return "aspect-square"
            case "video":
                return "aspect-video"
            case "portrait":
                return "aspect-[3/4]"
            case "wide":
                return "aspect-[16/9]"
            default:
                return ""
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            {(sortOptions.length > 0 || filterOptions.length > 0) && (
                <div className="flex flex-wrap gap-2 items-center justify-between">
                    <h2 className="text-lg font-medium">
                        {activeFilter ? `${activeFilter.label} (${processedItems.length})` : `All Items (${items.length})`}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                        <Filter className="h-4 w-4" />
                                        {activeFilter ? activeFilter.label : "Filter"}
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setActiveFilter(null)}>All Items</DropdownMenuItem>
                                    {filterOptions.map((option, index) => (
                                        <DropdownMenuItem key={index} onClick={() => setActiveFilter(option)}>
                                            {option.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {sortOptions.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                        {activeSort?.direction === "asc" ? (
                                            <SortAsc className="h-4 w-4" />
                                        ) : (
                                            <SortDesc className="h-4 w-4" />
                                        )}
                                        {activeSort ? `Sort: ${activeSort.label}` : "Sort"}
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {sortOptions.map((option, index) => (
                                        <DropdownMenuItem
                                            key={index}
                                            onClick={() => {
                                                if (activeSort && activeSort.label === option.label) {
                                                    setActiveSort({
                                                        ...option,
                                                        direction: activeSort.direction === "asc" ? "desc" : "asc",
                                                    })
                                                } else {
                                                    setActiveSort(option)
                                                }
                                            }}
                                        >
                                            {option.label}
                                            {activeSort?.label === option.label && (
                                                <>
                                                    {activeSort.direction === "asc" ? (
                                                        <SortAsc className="ml-2 h-4 w-4" />
                                                    ) : (
                                                        <SortDesc className="ml-2 h-4 w-4" />
                                                    )}
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            )}

            <div className={cn("grid", gridCols[cardSize], gapSize[gap])}>
                {processedItems.map((item) => (
                    <Card
                        key={item.id}
                        className={cn("h-full transition-all", onCardClick && "cursor-pointer hover:shadow-md")}
                        onClick={() => onCardClick && onCardClick(item)}
                        tabIndex={onCardClick ? 0 : undefined}
                        role={onCardClick ? "button" : undefined}
                        onKeyDown={(e) => {
                            if (onCardClick && (e.key === "Enter" || e.key === " ")) {
                                e.preventDefault()
                                onCardClick(item)
                            }
                        }}
                    >
                        {renderer.renderHeader && <CardHeader>{renderer.renderHeader(item)}</CardHeader>}
                        <CardContent className={cn(getAspectRatio())}>{renderer.renderContent(item)}</CardContent>
                        {renderer.renderFooter && <CardFooter>{renderer.renderFooter(item)}</CardFooter>}
                    </Card>
                ))}
            </div>

            {processedItems.length === 0 && (
                <div className="flex justify-center items-center p-8 border rounded-md">
                    <p className="text-muted-foreground">No items found</p>
                </div>
            )}
        </div>
    )
}
