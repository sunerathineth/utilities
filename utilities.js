function LiveWrite({text, selector, speed = 0.1, delay = 0, cursor = "●"}) {
    return new Promise((resolve) => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element "${selector}" not found.`);
            return resolve();
        }

        let index = 0;
        let writtenText = "";
        let animationFrame;
        let stopRequested = false;
        
        setTimeout(() => {
            function writeNextCharacter() {
                if (stopRequested || index >= text.length) {
                    element.innerHTML = writtenText; // Ensure final text is set
                    resolve();
                    return;
                }

                writtenText += text[index];
                index++;
                element.innerHTML = writtenText + cursor;
                animationFrame = setTimeout(writeNextCharacter, speed * 100);
            }

            writeNextCharacter();
        }, delay * 1000);

        // Return a function to allow stopping the animation
        return () => {
            stopRequested = true;
            clearTimeout(animationFrame);
            element.innerHTML = writtenText; // Show whatever was written so far
        };
    });
}
