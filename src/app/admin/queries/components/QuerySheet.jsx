"use client"

import React, { useState, useEffect } from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQueries } from "@/hooks/useQueries"
import LoaderButton from "@/components/custom/LoaderButton"
import CloseQueryDialog from "./CloseQueryDialog"

function QuerySheet({ open, onOpenChange, query }) {
    const { sendReply } = useQueries();
    const [message, setMessage] = useState("")
    const [closeDialogOpen, setCloseDialogOpen] = useState(false)

    const handleSendMessage = async () => {
        if (message.trim() === "") return

        try {
            await sendReply.mutateAsync({
                queryId: query._id,
                message: message,
            })
            setMessage("")
            onOpenChange(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:w-[500px] flex flex-col px-4 max-h-screen overflow-y-auto">
                <SheetHeader className={'mb-0 pb-0 pl-0'}>
                    <SheetTitle>Query Details</SheetTitle>
                </SheetHeader>

                {/* Header Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-muted-foreground text-xs">Raised By</div>
                        <div className="font-medium">{query.raisedBy?.name || query.raisedBy?.email || query.raisedBy?.phoneNo || "User"}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Raised At</div>
                        <div>{query?.raisedAt ? format(new Date(query.raisedAt), "dd MMM yyyy, hh:mm a") : "-"}</div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Status</div>
                        <div>
                            {query?.isResolved ? (
                                <Badge variant="success">Resolved</Badge>
                            ) : (
                                <Badge variant="destructive">Pending</Badge>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-muted-foreground text-xs">Rating</div>
                        <div>{query?.rating ? `${query.rating}/10` : "-"}</div>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="mt-2 space-y-3 bg-blue-50 p-3 rounded-md">
                    <div>
                        <div className="text-gray-400 text-xs font-bold uppercase">Title</div>
                        <div className="text-sm">{query?.title}</div>
                    </div>
                    <div>
                        <div className="text-gray-400 text-xs font-bold uppercase">Description</div>
                        <div className="whitespace-pre-line text-sm">{query?.description}</div>
                    </div>
                </div>

                {/* Replies Section */}
                <div className="mt-2 flex-1 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Replies</h3>

                        {/* Close Query Button */}
                        {!query?.isResolved && (
                            <div className="">
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => setCloseDialogOpen(true)}
                                >
                                    Close Query
                                </Button>
                            </div>
                        )}

                        {query?.isResolved && (
                            <div className="text-sm text-muted-foreground">
                                Resolved: {format(new Date(query.resolvedAt), "dd MMM yyyy, hh:mm a")}
                            </div>
                        )}
                    </div>

                    <div
                        className="mt-2 border rounded-lg space-y-2 p-2"
                    >

                        {query?.replies?.map((reply, index) => {
                            const isAdmin = reply.messagedBy.role === 'admin' || reply.messagedBy.role === 'employee'
                            return (
                                <div
                                    key={index}
                                    className={`flex w-full ${isAdmin ? "justify-end items-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${isAdmin
                                            ? "bg-amber-50 "
                                            : "bg-muted"
                                            }`}
                                    >
                                        <div className="font-semibold text-xs">
                                            {reply.messagedBy.name}
                                        </div>
                                        <div className="mt-1 text-sm">{reply.message}</div>
                                        <div className="text-xs opacity-80 mt-2">
                                            {format(new Date(reply.messagedAt), "hh:mm a")}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {(!query?.replies || query.replies.length === 0) && (
                            <div className="h-full min-h-[250px] flex items-center justify-center text-muted-foreground">
                                No replies yet
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    {!query?.isResolved && (
                        <div className="mt-2 flex gap-2 sticky bottom-0 bg-white pb-4 pt-2">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }
                                }}
                            />
                            <LoaderButton
                                loading={sendReply.isPending}
                                disabled={sendReply.isPending}
                                onClick={handleSendMessage}>
                                Send
                            </LoaderButton>
                        </div>
                    )}
                </div>

            </SheetContent>

            <CloseQueryDialog
                open={closeDialogOpen} onOpenChange={setCloseDialogOpen}
                queryId={query?._id}
            />
        </Sheet>
    )
}

export default QuerySheet