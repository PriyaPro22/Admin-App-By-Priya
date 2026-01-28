import React from "react";

interface PageProps {
    title: string;
}

const PlaceholderPage: React.FC<PageProps> = ({ title }) => {
    return (
        <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-3xl font-bold text-blue-900">{title}</h1>
            <p className="text-gray-500">This page is currently under implementation.</p>
        </div>
    );
};

export default PlaceholderPage;
