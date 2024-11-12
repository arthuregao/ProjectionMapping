import React from "react";


export default function loading() {
     return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <div className="text-xl font-semibold text-gray-100">
                    Loading...
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-blue-100 opacity-75"></span>
                </div>
            </div>

        )
} 