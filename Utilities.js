export function LiveWrite({text, selector, speed = 0.1, delay = 0, cursor = "●"}) {
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

export function DisplayLogoAtCenter({ imageUrl, duration = 2, delay = 0, maxWidth = "20vw", maxHeight = "20vh", fadeDuration = 2, zIndex = 1000} = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const imgElement = document.createElement("img");

            imgElement.src = imageUrl;
            imgElement.style.position = "fixed";
            imgElement.style.top = "50%";
            imgElement.style.left = "50%";
            imgElement.style.transform = "translate(-50%, -50%)";
            imgElement.style.zIndex = zIndex;
            imgElement.style.maxWidth = maxWidth;
            imgElement.style.maxHeight = maxHeight;

            imgElement.style.opacity = "0";
            imgElement.style.transition = `opacity ${fadeDuration}s ease-in-out`;

            document.body.appendChild(imgElement);

            // Fade in
            setTimeout(() => {
                imgElement.style.opacity = "1";
            }, 10);

            // Fade out after duration
            setTimeout(() => {
                imgElement.style.opacity = "0";

                setTimeout(() => {
                    imgElement.remove();
                    resolve(); // Resolve when the animation is fully done
                }, fadeDuration * 1000);
            }, duration * 1000);

            // Return a function to manually cancel and remove the logo
            return () => {
                imgElement.remove();
                resolve();
            };
        }, delay * 1000);
    });
}

export function checkInternetConnection() {
    window.onload = function() {
        if (!navigator.onLine) {
            alert("No internet connection.");
            window.close()
        }
    }
} 
