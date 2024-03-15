import { lightModeSVG, darkModeSVG } from '/svg.js'

// HTML Element variables
const headerEl = document.getElementById("header")
const brightnessModeEl = document.getElementById("brightness-mode")
const seedColorEl = document.getElementById("seed-color")
const modeEl = document.getElementById("mode")
const colorSchemeEl = document.getElementById("color-scheme")
const sliderEl = document.getElementById("input-scheme-size")
const schemeSizeEl = document.getElementById("scheme-size")
const titleEl = document.getElementById("title")

// defaults
let brightnessMode = "light"

// Event Listeners
seedColorEl.addEventListener('input', updateColorScheme)
modeEl.addEventListener('input', updateColorScheme)
sliderEl.addEventListener('input', () => { 
    schemeSizeEl.innerHTML = sliderEl.value 
    updateColorScheme()
})
brightnessModeEl.addEventListener('click', ()=> {
    brightnessMode = brightnessMode === "light" ? "dark" : "light"
    renderBrightnessMode()
})
colorSchemeEl.addEventListener('click', copyColorToClipboard)

// Where the magic happens! Create the color scheme and update the screen elements
function updateColorScheme() {
    // Display proper elements
    document.getElementById("instructions").style.display = "none"
    document.getElementById("scheme-size-control").style.display = "flex"
    document.getElementById("mode").style.display = "block"

    // Call the Color API
    fetch(`https://www.thecolorapi.com/scheme?hex=${seedColorEl.value.slice(1)}&count=${sliderEl.value}&mode=${modeEl.value}`)
        .then(response => response.json())
        .then( ({ colors }) => {
            // Build color scheme display.
            let html = ""
            for (const color of colors) {
                const colorCode = color.hex.value
                const textColor = color.hsl.l < 70 ? "#FFFFFF" : "#000000"
                const colorName = color.name.value
                html += `<div class='color-block' id='${colorCode}' 
                            style='background-color: ${colorCode}; color: ${textColor}'>
                            <div class="color-info">
                                <h2>${colorCode}</h2>
                                <h3>${colorName}</h3>
                            </div>
                        </div>`
            }
            let numColumns = sliderEl.value < 6 ? sliderEl.value : Math.ceil(sliderEl.value / 2)
            colorSchemeEl.style.gridTemplateColumns = `repeat(${numColumns}, 1fr)`
            colorSchemeEl.innerHTML = html

            // Add popup elements
            colorSchemeEl.innerHTML += `<div class="notification" id="clipboard"></div>`

            // Update title bar color
            titleEl.style.backgroundColor = `${seedColorEl.value}4d`
            
        })
}

// Set classes and icons to represent light vs. dark mode
function renderBrightnessMode() {
    brightnessModeEl.innerHTML = brightnessMode !== "light" ? lightModeSVG : darkModeSVG

    // set classes here
    if (brightnessMode === "dark") {
        headerEl.classList.add("dark")
        colorSchemeEl.classList.add("dark")
        modeEl.classList.add("dark")
    } else {
        headerEl.classList.remove("dark")
        colorSchemeEl.classList.remove("dark")
        modeEl.classList.remove("dark")
    }
}

function copyColorToClipboard(event) {

        // Write to clipboard
        navigator.clipboard.writeText(event.target.id)
    
        // Notify user of clipboard copy
        const notifyEl = document.getElementById("clipboard")
    
        // Set light/dark
        if (brightnessMode === "light") {
            notifyEl.classList.remove("dark")
        } else {
            notifyEl.classList.add("dark")
        }
        notifyEl.textContent = `${event.target.id} copied to clipboard`
        notifyEl.style.position = "absolute"
        notifyEl.style.display = "block"
    
        // Calculate Y-position for notification popup
        const mouseY = event.clientY;
        const elementsAbove = document.querySelectorAll("nav, header");
        let offsetDueToElementsAbove = 0;
        elementsAbove.forEach((element) => {
          offsetDueToElementsAbove += element.offsetHeight;
        });
        notifyEl.style.top = `${mouseY - offsetDueToElementsAbove - notifyEl.offsetHeight - 15}px`
        
        // Calculate X-position for notification popup
        const mouseX = event.clientX;
        if (mouseX > colorSchemeEl.offsetWidth / 2) {
            notifyEl.style.left = `${mouseX - notifyEl.offsetWidth - 15}px`
        } else {
            notifyEl.style.left = `${mouseX + 15}px`
        }    
        
        // Clear popup after 2 seconds
        setTimeout(() => { notifyEl.style.display = "none" }, 2000)
}