export default function StarBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div id="stars" className="absolute top-0 left-0"></div>
            <div id="stars2" className="absolute top-0 left-0"></div>
            <div id="stars3" className="absolute top-0 left-0"></div>
        </div>
    );
}
