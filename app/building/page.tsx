"use client";

import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      backgroundColor: "#fcfaf7", // Your cream background
      padding: "2rem",
      textAlign: "center",
      fontFamily: "Georgia, serif"
    }}>
      <div style={{ 
        fontSize: "4rem", 
        marginBottom: "1rem" 
      }}>🚧</div>
      
      <h1 style={{ 
        fontSize: "2.5rem", 
        color: "#333", 
        fontWeight: 400,
        marginBottom: "1rem" 
      }}>
        Coming Soon
      </h1>
      
      <p style={{ 
        fontSize: "1.1rem", 
        color: "#666", 
        maxWidth: "500px", 
        lineHeight: "1.6",
        marginBottom: "2rem" 
      }}>
        We are currently refining this feature to ensure the best possible experience for the South Bend community. Check back shortly!
      </p>

      <Link href="/" style={{
        padding: "0.8rem 2rem",
        backgroundColor: "#d97706", // Your terra cotta / orange action color
        color: "white",
        borderRadius: "2rem",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "opacity 0.2s"
      }}>
        Back to Home
      </Link>
    </div>
  );
}
