(function() {
    const text = "🤍Wellett info🤍";
    let index = 0;
    let isDeleting = 0;
    let isPaused = 0;
    let minIndex = 0;
    
    setInterval(() => {
        if (isPaused) return;
        
        if (!isDeleting) {
            index++;
            if (index > text.length) {
                isDeleting = 1;
                isPaused = 1;
                setTimeout(() => {
                    isPaused = 0;
                }, 1000);
            }
        } else {
            index--;
            if (index < 1) {
                isDeleting = 0;
                index = 0;
                isPaused = 1;
                setTimeout(() => {
                    isPaused = 0;
                }, 500);
            }
        }
        
        if (!isPaused) {
            document.title = text.substring(0, Math.max(index, 1));
        }
    }, 150);
})();