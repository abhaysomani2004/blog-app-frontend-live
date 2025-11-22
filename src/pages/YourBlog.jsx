import { Card } from '@/components/ui/card'
import React, { useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const YourBlog = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)

    // ENV variables
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const OWN_BLOG = import.meta.env.VITE_GET_OWN_BLOGS
    const DELETE_BLOG = import.meta.env.VITE_DELETE_BLOG

    // Fetch logged-in user's blogs
    const getOwnBlog = async () => {
        try {
            const res = await axios.get(`${BASE_URL}${OWN_BLOG}`, { withCredentials: true })

            if (res.data.success) {
                dispatch(setBlog(res.data.blogs))
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to load blogs")
        }
    }

    // Delete blog handler
    const deleteBlog = async (id) => {
        try {
            const res = await axios.delete(`${BASE_URL}${DELETE_BLOG}${id}`, { withCredentials: true })

            if (res.data.success) {
                const updatedBlogData = blog.filter((b) => b._id !== id)
                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        getOwnBlog()
    }, [])

    // Convert createdAt to DD/MM/YYYY
    const formatDate = (index) => {
        const date = new Date(blog[index].createdAt)
        return date.toLocaleDateString("en-GB")
    }

    return (
        <div className='pb-10 pt-20 md:ml-[320px] h-screen'>
            <div className='max-w-6xl mx-auto mt-8'>
                <Card className="w-full p-5 space-y-2 dark:bg-gray-800">

                    <Table>
                        <TableCaption>Your recently posted blogs.</TableCaption>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {blog?.map((item, index) => (
                                <TableRow key={item._id}>
                                    <TableCell className="flex gap-4 items-center">
                                        <img
                                            src={item.thumbnail}
                                            alt=""
                                            className='w-20 rounded-md hidden md:block'
                                        />
                                        <h1
                                            className='hover:underline cursor-pointer'
                                            onClick={() => navigate(`/blogs/${item._id}`)}
                                        >
                                            {item.title}
                                        </h1>
                                    </TableCell>

                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{formatDate(index)}</TableCell>

                                    <TableCell className="text-center">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <BsThreeDotsVertical className='cursor-pointer' />
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent className="w-[180px]">
                                                <DropdownMenuItem
                                                    onClick={() => navigate(`/dashboard/write-blog/${item._id}`)}
                                                >
                                                    <Edit className='mr-2' /> Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-500"
                                                    onClick={() => deleteBlog(item._id)}
                                                >
                                                    <Trash2 className='mr-2' /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </Card>
            </div>
        </div>
    )
}

export default YourBlog
