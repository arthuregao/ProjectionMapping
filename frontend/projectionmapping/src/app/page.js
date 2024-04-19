import Link from "next/link";
import React from "react";

export default function Home() {

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            <h1>Welcome to the Homepage</h1>
            <p>Click below to go to the Avatar Creator page:</p>
            <Link href="/create-avatar">
                Create Avatar
            </Link>
            <Link href="/about">
                about
            </Link>
        </div>

    );
}
