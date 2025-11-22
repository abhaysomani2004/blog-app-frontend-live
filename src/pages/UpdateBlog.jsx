import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import JoditEditor from 'jodit-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setBlog } from '@/redux/blogSlice'

// ENV URLs
const BASE_URL = import.meta.env.VITE_BASE_URL;
const UPDATE_BLOG = `${BASE_URL}/blog/`; 
const BLOG_ACTION = `${BASE_URL}/blog/`; 
const DELETE_BLOG = `${BASE_URL}/blog/delete/`;

const UpdateBlog = () => {
    const editor = useRef(null);

    const [loading, setLoading] = useState(false);
    const params = useParams();
    const id = params.blogId;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { blog } = useSelector((store) => store.blog);
    const selectBlog = blog.find((b) => b._id === id);

    const [content, setContent] = useState(selectBlog?.description || "");

    const [blogData, setBlogData] = useState({
        title: selectBlog?.title || "",
        subtitle: selectBlog?.subtitle || "",
        description: selectBlog?.description || "",
        category: selectBlog?.category || "",
        thumbnail: selectBlog?.thumbnail || "",
    });

    const [previewThumbnail, setPreviewThumbnail] = useState(selectBlog?.thumbnail);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const selectCategory = (value) => {
        setBlogData({ ...blogData, category: value });
    };

    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setBlogData({ ...blogData, thumbnail: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreviewThumbnail(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // ================= UPDATE BLOG =================
    const updateBlogHandler = async () => {
        const formData = new FormData();
        formData.append("title", blogData.title);
        formData.append("subtitle", blogData.subtitle);
        formData.append("description", content);
        formData.append("category", blogData.category);

        if (blogData.thumbnail instanceof File) {
            formData.append("file", blogData.thumbnail);
        }

        try {
            setLoading(true);
            // ✅ FIX: URL construction
            const res = await axios.put(`${UPDATE_BLOG}${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Blog updated successfully");
                navigate("/dashboard/your-blog");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error updating blog");
        } finally {
            setLoading(false);
        }
    };

    // ================= PUBLISH / UNPUBLISH =================
    const togglePublishUnpublish = async () => {
        try {
            const publishStatus = selectBlog.isPublished ? "false" : "true";
            const res = await axios.patch(
                `${BLOG_ACTION}${id}?publish=${publishStatus}`, 
                {}, // Empty body
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/dashboard/your-blog");
            }
        } catch (error) {
            toast.error("Unable to update publish state");
        }
    };

    // ================= DELETE BLOG =================
    const deleteBlog = async () => {
        try {
            const res = await axios.delete(`${DELETE_BLOG}${id}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                const updatedBlog = blog.filter((b) => b._id !== id);
                dispatch(setBlog(updatedBlog));
                toast.success("Blog deleted");
                navigate("/dashboard/your-blog");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="pb-10 px-3 pt-20 md:ml-[320px]">
            <div className="max-w-6xl mx-auto mt-8">
                <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">

                    <h1 className="text-4xl font-bold">Edit Blog</h1>
                    <p>Make changes and save your blog.</p>

                    <div className="space-x-2">
                        <Button onClick={togglePublishUnpublish}>
                            {selectBlog?.isPublished ? "Unpublish" : "Publish"}
                        </Button>

                        <Button variant="destructive" onClick={deleteBlog}>
                            Delete Blog
                        </Button>
                    </div>

                    <div className="pt-10">
                        <Label>Title</Label>
                        <Input
                            type="text"
                            name="title"
                            value={blogData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type="text"
                            name="subtitle"
                            value={blogData.subtitle}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            onChange={(newContent) => setContent(newContent)}
                        />
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select onValueChange={selectCategory}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={blogData.category} />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    <SelectItem value="Web Development">Web Development</SelectItem>
                                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                    <SelectItem value="Blogging">Blogging</SelectItem>
                                    <SelectItem value="Photography">Photography</SelectItem>
                                    <SelectItem value="Cooking">Cooking</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={selectThumbnail}
                            className="w-fit"
                        />

                        {previewThumbnail && (
                            <img
                                src={previewThumbnail}
                                className="w-64 my-2 rounded"
                                alt="Thumbnail Preview"
                            />
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>

                        <Button onClick={updateBlogHandler}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default UpdateBlog;
