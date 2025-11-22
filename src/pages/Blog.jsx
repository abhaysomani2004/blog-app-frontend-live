import BlogCard from '@/components/BlogCard'
import React, { useEffect } from 'react'
import LMS from "../assets/LMS.png"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'

// Fallback Blog Data (Local)
export const blogJson = [
    {
        id: 1,
        title: "The Ultimate Guide to Digital Marketing in 2025",
        author: "Rohit Singh",
        date: "2025-03-27",
        content:
            "Digital marketing is constantly evolving. In 2025, businesses must focus on AI-driven strategies, voice search optimization, and hyper-personalization.",
        tags: ["digital marketing", "SEO", "social media", "PPC"],
        category: "Marketing",
        image: LMS,
    },
    {
        id: 2,
        title: "Building a Full-Stack LMS with MERN Stack",
        author: "Rohit Singh",
        date: "2025-03-27",
        content:
            "A step-by-step guide to building a Learning Management System (LMS) using React, Tailwind CSS, Node.js, Express.js, and MongoDB.",
        tags: ["MERN stack", "LMS", "React", "Node.js"],
        category: "Web Development",
        image: LMS,
    },
    {
        id: 3,
        title: "Top 10 WordPress Plugins for 2025",
        author: "Rohit Singh",
        date: "2025-03-27",
        content:
            "WordPress remains the most popular CMS. Here are the top 10 must-have plugins for SEO, security, and performance.",
        tags: ["WordPress", "plugins", "SEO"],
        category: "WordPress",
        image: LMS,
    },
    {
        id: 4,
        title: "How to Use APIs in Web Development",
        author: "Rohit Singh",
        date: "2025-03-27",
        content:
            "Learn how to integrate third-party APIs, build RESTful APIs with Node.js, and use authentication methods like OAuth.",
        tags: ["APIs", "web development", "Node.js"],
        category: "Web Development",
        image: LMS,
    },
    {
        id: 5,
        title: "SEO: The Complete Beginner’s Guide",
        author: "Rohit Singh",
        date: "2025-03-27",
        content:
            "This beginner guide covers keyword research, on-page SEO, off-page SEO, and technical SEO for Google rankings.",
        tags: ["SEO", "Google ranking", "keywords"],
        category: "Marketing",
        image: LMS,
    }
]

const Blog = () => {
    const dispatch = useDispatch()
    const { blog } = useSelector((store) => store.blog)

    useEffect(() => {
        const getAllPublsihedBlogs = async () => {
            try {
                // ✅ FIX: Use VITE_BASE_URL
                const URL = `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_GET_PUBLISHED_VLOGS_URL}`

                const res = await axios.get(URL, {
                    withCredentials: true,
                })

                if (res.data.success) {
                    dispatch(setBlog(res.data.blogs))
                } else {
                    dispatch(setBlog(blogJson)) // fallback
                }
            } catch (error) {
                console.log("API Error:", error)
                dispatch(setBlog(blogJson)) // fallback on error
            }
        }

        getAllPublsihedBlogs()
    }, [])

    return (
        <div className="pt-16">
            <div className="max-w-6xl mx-auto text-center flex flex-col space-y-4 items-center">
                <h1 className="text-4xl font-bold pt-10">Our Blogs</h1>
                <hr className="w-24 border-2 border-red-500 rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto grid gap-10 grid-cols-1 md:grid-cols-3 py-10 px-4 md:px-0">
                {blog?.map((b, i) => (
                    <BlogCard blog={b} key={i} />
                ))}
            </div>
        </div>
    )
}

export default Blog
