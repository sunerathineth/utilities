# Usage

> Live write
```
LiveWrite({
    text: "Hello, this is a typing effect!",
    selector: ".newTask",
    speed: 0.05, // 50ms per letter
    delay: 1,    // Start after 1 second
    cursor: "|"  // Custom cursor
});

```

> Display logo at center of screen
#### Basic
```
displayLogoAtCenter({ imageUrl: "https://example.com/logo.png" });
```

#### Custom Size & Delay
```
displayLogoAtCenter({
    imageUrl: "https://example.com/logo.png",
    duration: 3,
    delay: 1,
    maxWidth: "100px",
    maxHeight: "100px"
});

```

#### Manually Remove Before Animation Ends
```
const removeLogo = displayLogoAtCenter({
    imageUrl: "https://example.com/logo.png",
    duration: 10
});

// Remove after 3 seconds (before fade-out)
setTimeout(removeLogo, 3000);

```
