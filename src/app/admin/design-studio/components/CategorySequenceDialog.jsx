// app/design-studio/components/CategorySequenceDialog.jsx
'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    KeyboardSensor,
} from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableCategory({ id, name, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        background: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <span>{name}</span>
            <Button size="icon" variant="ghost" onClick={() => onRemove(id)}>
                Remove
            </Button>
        </div>
    )
}

export default function CategorySequenceDialog({
    allCategories = [],
    initialCategories = [],   // array of IDs
    onSave,
}) {
    const [open, setOpen] = useState(false)
    const [ordered, setOrdered] = useState([])
    const [adding, setAdding] = useState(false)
    const [filter, setFilter] = useState('')
    const [activeId, setActiveId] = useState(null)

    useEffect(() => {
        if (open) {
            setOrdered(initialCategories)
            setAdding(false)
            setFilter('')
        }
    }, [open, initialCategories])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor),
    )

    const handleDragEnd = ({ active, over }) => {
        setActiveId(null)
        if (active.id !== over?.id) {
            setOrdered((items) => {
                const oldIndex = items.indexOf(active.id)
                const newIndex = items.indexOf(over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const toggleAdd = (id) => {
        setOrdered((list) =>
            list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Edit Categories
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Reorder & Add Categories</DialogTitle>
                </DialogHeader>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={({ active }) => setActiveId(active.id)}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={ordered} strategy={rectSortingStrategy}>
                        {ordered.length ? (
                            ordered.map((id) => {
                                const cat = allCategories.find((c) => c._id === id) || {}
                                console.log(cat)
                                return <SortableCategory key={id} id={id} name={cat.name || 'Unknown'} onRemove={toggleAdd} />
                            })
                        ) : (
                            <p className="text-sm text-gray-500 mb-2">No categories in sequence</p>
                        )}
                    </SortableContext>

                    <DragOverlay>
                        {activeId && (
                            <div className="p-3 border rounded bg-white">
                                {allCategories.find((c) => c._id === activeId)?.name}
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                <div className="mt-4 mb-6">
                    <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
                        {adding ? 'Close add panel' : 'Add Category'}
                    </Button>
                    {adding && (
                        <Command className="mt-2">
                            <CommandInput
                                placeholder="Search categories..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <CommandList>
                                <CommandEmpty>No categories found</CommandEmpty>
                                {allCategories
                                    .filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()))
                                    .map((c) => (
                                        <CommandItem key={c._id} onSelect={() => toggleAdd(c._id)} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                readOnly
                                                checked={ordered.includes(c._id)}
                                                className="mr-2 w-4 h-4"
                                            />
                                            {c.name}
                                        </CommandItem>
                                    ))}
                            </CommandList>
                        </Command>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onSave(ordered)
                            setOpen(false)
                        }}
                    >
                        Save Categories
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
