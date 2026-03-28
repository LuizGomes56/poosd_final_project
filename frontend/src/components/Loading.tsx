export default function Loading() {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex flex-col items-center justify-center gap-6">
            <span className="text-2xl font-medium text-white animate-pulse">Loading</span>
            <div
                className="relative rounded-full w-36 aspect-square animate-spin"
                style={{
                    background: "conic-gradient(#ff0000, #9b00ff, #ff00aa, #ff0000)",
                    WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 0%)",
                    maskImage: "radial-gradient(circle, transparent 60%, black 0%)",
                }}>
            </div>
        </div>
    );
};