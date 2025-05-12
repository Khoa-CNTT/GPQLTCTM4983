import { SVGProps } from "react";

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    src?: string;
    videoSrc?: string;
    screenOpacity?: number;
}

export default function Iphone15Pro({
    width = 300,
    height,
    src,
    videoSrc,
    screenOpacity = 1,
    ...props
}: Iphone15ProProps) {
    // Standard iPhone 15 Pro aspect ratio (close to real device)
    const aspectRatio = 2.1652;
    const calculatedHeight = typeof width === 'number' ? Math.round(width * aspectRatio) : height;
    
    return (
        <svg
            width={width}
            height={calculatedHeight}
            viewBox="0 0 390 844"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            {...props}
        >
            <defs>
                {/* Frame shadow */}
                <filter id="phone-shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="2" stdDeviation="6" floodOpacity="0.15" />
                </filter>
                
                {/* Screen reflection gradient */}
                <linearGradient id="screen-reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.04" />
                    <stop offset="40%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.06" />
                </linearGradient>
                
                {/* Screen clipping path with accurate corner radius */}
                <clipPath id="screen-clip">
                    <rect 
                        x="18" 
                        y="18" 
                        width="354" 
                        height="808" 
                        rx="38" 
                        ry="38"
                    />
                </clipPath>
            </defs>
            
            {/* Main frame - slightly darker in dark mode */}
            <rect
                x="0" 
                y="0" 
                width="390" 
                height="844"
                rx="54" 
                ry="54"
                className="fill-[#1A1A1C] dark:fill-[#111112]"
                filter="url(#phone-shadow)"
            />
            
            {/* Inner bezel */}
            <rect 
                x="4" 
                y="4" 
                width="382" 
                height="836"
                rx="50" 
                ry="50"
                className="fill-[#343438] dark:fill-[#232326]"
            />
            
            {/* Screen background */}
            <rect 
                x="18" 
                y="18" 
                width="354" 
                height="808"
                rx="38" 
                ry="38"
                className="fill-black"
            />
            
            {/* Screen content */}
            {src && (
                <g clipPath="url(#screen-clip)">
                    <image
                        href={src}
                        x="18"
                        y="18"
                        width="354"
                        height="808"
                        preserveAspectRatio="xMidYMid meet"
                        style={{opacity: screenOpacity}}
                    />
                    <rect
                        x="18"
                        y="18"
                        width="354"
                        height="808"
                        fill="url(#screen-reflection)"
                    />
                </g>
            )}
            
            {videoSrc && (
                <foreignObject 
                    x="18" 
                    y="18" 
                    width="354" 
                    height="808" 
                    clipPath="url(#screen-clip)"
                >
                    <video
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: screenOpacity
                        }}
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 100%)',
                            pointerEvents: 'none'
                        }}
                    />
                </foreignObject>
            )}
            
            {/* Dynamic Island */}
            <rect
                x="125"
                y="18"
                width="140"
                height="34"
                rx="17"
                ry="17"
                className="fill-black"
            />
            
            {/* Camera/sensor cluster */}
            <circle cx="150" cy="35" r="6" className="fill-[#1F2937] opacity-90" />
            <circle cx="150" cy="35" r="3" className="fill-[#121212]" />
            
            {/* Side buttons */}
            <rect 
                x="0" 
                y="170" 
                width="3.5" 
                height="40" 
                rx="1" 
                ry="1"
                className="fill-[#343438] dark:fill-[#232326]" 
            />
            <rect 
                x="0" 
                y="230" 
                width="3.5" 
                height="60" 
                rx="1" 
                ry="1"
                className="fill-[#343438] dark:fill-[#232326]" 
            />
            <rect 
                x="0" 
                y="310" 
                width="3.5" 
                height="60" 
                rx="1" 
                ry="1" 
                className="fill-[#343438] dark:fill-[#232326]" 
            />
            
            {/* Power button */}
            <rect 
                x="386.5" 
                y="250" 
                width="3.5" 
                height="80" 
                rx="1" 
                ry="1" 
                className="fill-[#343438] dark:fill-[#232326]" 
            />
            
            {/* Home indicator */}
            <rect 
                x="165" 
                y="813" 
                width="60" 
                height="4" 
                rx="2" 
                ry="2" 
                className="fill-white opacity-30" 
            />
        </svg>
    );
}
