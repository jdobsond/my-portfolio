import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';

// @ts-ignore
export default function BlogPost({ frontMatter, mdxSource }) {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{frontMatter.title}</h1>
            <p className="text-sm text-gray-500 mb-6">{frontMatter.date}</p>
            <img src={frontMatter.image} alt={frontMatter.title} className="mb-8" />
            <div className="prose prose-lg">
                <MDXRemote {...mdxSource} />
            </div>
        </div>
    );
}

export async function getStaticPaths() {
    const files = fs.readdirSync(path.join('pages/content'));

    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace('.mdx', ''),
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

// @ts-ignore
export async function getStaticProps({ params: { slug } }) {
    const markdownWithMeta = fs.readFileSync(
        path.join('pages/content', slug + '.mdx'),
        'utf-8'
    );

    const { data: frontMatter, content } = matter(markdownWithMeta);

    const mdxSource = await serialize(content);

    return {
        props: {
            frontMatter,
            mdxSource,
        },
    };
}
