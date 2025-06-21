import React from 'react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function POS({ children }) {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-3xl overflow-auto max-h-[90vh]">
                    <DialogHeader>afdasdf</DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default POS