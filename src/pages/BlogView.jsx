import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, MessageSquare, Share2 } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { setBlog } from '@/redux/blogSlice'
import { toast } from 'sonner'

const BlogView = () => {

    const { blogId } = useParams()
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)
    const { comment } = useSelector(store => store.comment)

    const selectedBlog = blog?.find(b => b._id === blogId)

    const [blogLike, setBlogLike] = useState(selectedBlog?.likes.length || 0)
    const [liked, setLiked] = useState(
        selectedBlog?.likes.includes(user?._id) || false
    )

    // If refreshed & blog not found
    if (!selectedBlog) {
        return (
            <div className="pt-24 text-center text-xl text-gray-400">
                Blog not found...
            </div>
        )
    }

    // -------------------------
    // LIKE / DISLIKE HANDLER
    // -------------------------
    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? "dislike" : "like"

            const URL = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_VLOG_VIEW}/${selectedBlog._id}/${action}`

            const res = await axios.get(URL, { withCredentials: true })

            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1

                setBlogLike(updatedLikes)
                setLiked(!liked)

                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id
                        ? {
                            ...p,
                            likes: liked
                                ? p.likes.filter(id => id !== user._id)
                                : [...p.likes, user._id]
                        }
                        : p
                )

                dispatch(setBlog(updatedBlogData))
                toast.success(res.data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const changeTimeFormat = (isoDate) => {
        return new Date(isoDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
    }

    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`

        if (navigator.share) {
            navigator.share({
                title: selectedBlog.title,
                text: "Check out this blog!",
                url: blogUrl,
            })
        } else {
            navigator.clipboard.writeText(blogUrl)
            toast.success("Blog link copied!")
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>

                {/* Breadcrumb */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to="/"><BreadcrumbLink>Home</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link to="/blogs"><BreadcrumbLink>Blogs</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Blog Header */}
                <div className="my-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        {selectedBlog.title}
                    </h1>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={selectedBlog.author.photoUrl} alt="Author" />
                                <AvatarFallback>AU</AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-medium">
                                    {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedBlog.author.occupation}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min read
                        </div>
                    </div>
                </div>

                {/* Thumbnail */}
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={selectedBlog.thumbnail}
                        alt="Blog Thumbnail"
                        className="w-full object-cover"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">
                        {selectedBlog.subtitle}
                    </p>
                </div>

                {/* Blog HTML Content */}
                <div
                    className="prose prose-lg dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 my-10">
                    {selectedBlog?.tags?.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                </div>

                {/* Like / Comment / Share */}
                <div className="flex items-center justify-between border-y py-4 mb-8">
                    <div className="flex items-center space-x-4">
                        <Button onClick={likeOrDislikeHandler} variant="ghost" size="sm">
                            {liked
                                ? <FaHeart size={22} className="text-red-600" />
                                : <FaRegHeart size={22} className="text-gray-400" />}
                            <span className="ml-2">{blogLike}</span>
                        </Button>

                        <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                            <span className="ml-2">{comment.length} Comments</span>
                        </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4" />
                        </Button>

                        <Button
                            onClick={() => handleShare(selectedBlog._id)}
                            variant="ghost"
                            size="sm"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <CommentBox selectedBlog={selectedBlog} />
            </div>
        </div>
    )
}

export default BlogView
