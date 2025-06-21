// app/design-studio/components/GroupSequenceDialog.jsx
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

function SortableItem({ id, name, onRemove }) {
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

export default function GroupSequenceDialog({ allGroups = [], initialGroups = [], onSave }) {
    const [open, setOpen] = useState(false)
    const [ordered, setOrdered] = useState([])
    const [adding, setAdding] = useState(false)
    const [filter, setFilter] = useState('')
    const [activeId, setActiveId] = useState(null)

    // When dialog opens, seed `ordered` with the passed-in IDs
    useEffect(() => {
        if (open) {
            setOrdered(initialGroups)
            setAdding(false)
            setFilter('')
        }
    }, [open, initialGroups])

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
        setOrdered((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Reorder & Add Groups</DialogTitle>
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
                                const grp = allGroups.find((g) => g._id === id) || {}
                                return <SortableItem key={id} id={id} name={grp.name || 'Unknown'} onRemove={toggleAdd} />
                            })
                        ) : (
                            <p className="text-sm text-gray-500 mb-2">No groups in sequence</p>
                        )}
                    </SortableContext>

                    <DragOverlay>
                        {activeId && (
                            <div className="p-3 border rounded bg-white">
                                {allGroups.find((g) => g._id === activeId)?.name}
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>

                {/* add/search panel */}
                <div className="mt-4 mb-6">
                    <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
                        {adding ? 'Close add panel' : 'Add Group'}
                    </Button>
                    {adding && (
                        <Command className="mt-2">
                            <CommandInput
                                placeholder="Search groups..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            />
                            <CommandList>
                                <CommandEmpty>No groups found</CommandEmpty>
                                {allGroups
                                    .filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()))
                                    .map((g) => (
                                        <CommandItem key={g._id} onSelect={() => toggleAdd(g._id)} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                readOnly
                                                checked={ordered.includes(g._id)}
                                                className="mr-2 w-4 h-4"
                                            />
                                            {g.name}
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
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
