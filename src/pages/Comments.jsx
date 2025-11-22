import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import axios from 'axios'
import { Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const Comments = () => {

    const [allComments, setAllComments] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // ==============================
    // ENV URL
    // ==============================
const COMMENTS_URL = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COMMENTS_URL}`
    // ==============================
    // Fetch All Comments
    // ==============================
    const getTotalComments = async () => {
        try {
            const res = await axios.get(COMMENTS_URL, { withCredentials: true })

            if (res.data.success) {
                setAllComments(res.data.comments)
            } else {
                toast.error("Failed to load comments")
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getTotalComments()
    }, [])

    return (
        <div className="pb-10 pt-20 md:ml-[320px] min-h-screen">
            <div className="max-w-6xl mx-auto mt-8">
                <Card className="w-full p-5 space-y-2 dark:bg-gray-800">

                    {loading ? (
                        <p className="text-center text-gray-500 py-5">Loading comments...</p>
                    ) : allComments.length === 0 ? (
                        <p className="text-center text-gray-500 py-5">No comments found.</p>
                    ) : (
                        <Table>
                            <TableCaption>A list of your recent comments.</TableCaption>

                            <TableHeader>
                                <TableRow>
                                    <TableHead>Blog Title</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {allComments?.map((comment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{comment.postId?.title}</TableCell>
                                        <TableCell>{comment.content}</TableCell>
                                        <TableCell>{comment.userId?.firstName}</TableCell>

                                        <TableCell className="text-center">
                                            <Eye
                                                className="cursor-pointer hover:text-blue-500"
                                                onClick={() =>
                                                    navigate(`/blogs/${comment.postId?._id}`)
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </div>
        </div>
    )
}

export default Comments
