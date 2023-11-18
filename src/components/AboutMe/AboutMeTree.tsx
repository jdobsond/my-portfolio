import React, {useState, useEffect, useRef} from 'react';
import { motion } from 'framer-motion';

const experiences = [
    {
        title: "Robotics/Machine Learning Co-Op",
        date: "Sep 2023 - Current",
        location: "Mercedes-Benz Vans x College of Charleston (Ladson, SC)",
        details: [
            "Developing a large-scale, autonomous inventory system using a multi-layered machine learning system, robotics, and AWS cloud services.",
            "Leading a team of 4 students under 2 professors, in direct collaboration with Mercedes-Benz Vans stakeholders.",
            "Initial prototype displayed significant improvement of efficiency, accuracy and real-time awareness of high-value inventory."
        ]
    },
    {
        title: "Software Engineering Intern",
        date: "May 2023 - Aug 2023",
        location: "Savvas Learning Company (EdTech), Phoenix, AZ",
        details: [
            "Engineered accessibility solutions for a K-12 edtech platform using Angular 16 MFEs, GraphQL, Spring, Gradle, and AWS cloud services.",
            "Addressed 14 high-impact accessibility issues, aligning with WCAG 2.1 standards.",
            "Led hackathon projects, including API testing enhancements and a student analysis dashboard, winning the hackathon."
        ]
    },
    {
        title: "Data Engineering Intern",
        date: "Sep 2022 - Jan 2023",
        location: "Fiscal Spreading & Tracking (FinTech), Charleston, SC",
        details: [
            "Assisted in transition from a monolithic desktop app to a microserviced, serverless webapp, leveraging React, Django, and AWS.",
            "Performed API rework, assessing existing API call performance while implementing query and data handling optimizations.",
            "Containerized various data flows to separate concerns and minimize single point of failure situations."
        ]
    },
    {
        title: "Data Analyst / Scrum Master",
        date: "March 2018 - March 2021",
        location: "Ceterus (FinTech startup), Charleston, SC",
        details: [
            "Developed and analyzed financial data sets for a fintech app that enhances small-business' financial insights.",
            "Met with small-business owners on a weekly basis to discuss financial performance and provide recommendations for improvement.",
            "Led a Scrum team, achieving significant reductions in project lead time and increases in story point velocity."
        ]
    }
];

const AboutMeTree = () => {
    const [nodeVisibility, setNodeVisibility] = useState(Array(experiences.length).fill(false));
    const [textBoxVisible, setTextBoxVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;
            const textBox = textBoxRef.current;
            if (!container || !textBox) return;

            const containerBounds = container.getBoundingClientRect();
            const textBoxBounds = textBox.getBoundingClientRect();

            // For the experiences nodes
            const containerTop = containerBounds.top + window.scrollY;
            const containerHeight = containerBounds.height;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;
            const relativeScrollY = scrollY - containerTop + windowHeight / 2;

            // For the text box
            const textBoxTop = textBoxBounds.top + window.scrollY;
            const textBoxInView = textBoxTop < (scrollY + windowHeight) && textBoxTop > scrollY;

            // Update node visibility
            const newVisibility = nodeVisibility.map((isVisible, index) => {
                const nodeTop = index * verticalSpacing;
                return isVisible || relativeScrollY >= nodeTop;
            });

            setNodeVisibility(newVisibility);
            setTextBoxVisible(textBoxInView); // Update text box visibility
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nodeVisibility]);

    const nodeAnimation = {
        initial: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const verticalSpacing = 200;

    return (
        <div ref={containerRef} className="container mx-auto h-full pt-4 pb-44">
            <div>
                <motion.div
                    ref={textBoxRef}
                    className="text-3xl text-center mx-auto w-11/12 mb-24 bg-blend-multiply border-2 pt-1 pb-1 rounded-lg"
                    initial={{ opacity: 0, y: -45 }}
                    animate={textBoxVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -45 }}
                    transition={{ duration: 3.5 }}
                >
                    Delivering seamless, optimized solutions through collaboration and innovation.
                </motion.div>
            </div>
            <div className="relative pt-24" style={{ height: `${experiences.length * verticalSpacing}px` }}>
                <div className="absolute left-1/2 h-full border-r-4 border-gray-200 transform -translate-x-1/2" style={{ height: '100%' }}></div>

                {experiences.map((exp, index) => (
                    <motion.div
                        key={index}
                        className="flex justify-center items-center mb-52"
                        variants={nodeAnimation}
                        initial="initial"
                        animate={nodeVisibility[index] ? 'visible' : 'exit'} // Updated to use the new visibility state
                        style={{ top: `${index * verticalSpacing}px` }}
                        transition={{ delay: index * 0.4, duration: 3  }}
                    >
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>

                        <div
                            className={`absolute text-box-style p-2 shadow-lg rounded max-w-4xl ${index % 2 === 0 ? 'right-1/2 mr-14' : 'left-1/2 ml-14'}`}
                        >
                            <h3 className="font-bold text-lg text-white">{exp.title} <span className="text-sm text-gray-400">({exp.date})</span></h3>
                            <p className="text-orange-500 text-sm space-x-1 pb-2 pl-4">{exp.location}</p>
                            <ul className="list-disc text-light rounded pl-6">
                                {exp.details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className="text-white mb-4 p-0.5 ">{detail}</li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AboutMeTree;