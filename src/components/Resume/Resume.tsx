import React from 'react';
import Image from 'next/image'; // Import Next.js Image component

function Resume() {
    const resumePDFPath = '/resumepdf.pdf';
    const resumeIMGPath = '/resumeimg.png';

    return (
        <div className="flex flex-col items-center bg-darkGreen text-white p-4 px-4">
            <h2 className="text-4xl font-bold underline mb-4 z-0">Resume</h2> {/* Enlarged and underlined title */}
            <div className="self-end sticky top-20 pr-12 z-10"> {/* Sticky download button container */}
                <a
                    href={resumePDFPath}
                    download="John_Dobson_Dunavant_Jr_Resume.pdf"
                    className="bg-amber-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xl"
                    title="Download Resume as PDF"
                >
                    Download as PDF
                </a>
            </div>
            <div className="w-full flex justify-center">
                <div className="relative max-w-screen-md w-full"> {/* Adjust max-width to match the image's width */}
                    {/* The image will fill this container */}
                    <Image src={resumeIMGPath} alt="Resume" layout="responsive" width={700} height={900} objectFit="contain" />
                </div>
            </div>
        </div>
    );
}

export default Resume;
