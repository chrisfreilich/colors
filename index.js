import { lightModeSVG, darkModeSVG } from '/svg.js'

const brightnessModeEl = document.getElementById("brightness-mode")
const seedColorEl = document.getElementById("seed-color")
const modeEl = document.getElementById("mode")
const colorSchemeEl = document.getElementById("color-scheme")
const sliderEl = document.getElementById("input-scheme-size");
const schemeSizeEl = document.getElementById("scheme-size");

// defaults
schemeSizeEl.innerHTML = sliderEl.value; 
let brightnessMode = "light"
renderBrightnessMode()

// Event Listeners
seedColorEl.addEventListener('input', updateColorScheme)
modeEl.addEventListener('input', updateColorScheme)
sliderEl.addEventListener('input', (event) => { 
        schemeSizeEl.innerHTML = event.target.value 
        updateColorScheme()
})

function updateColorScheme() {
    // Hide instructions
    document.getElementById("instructions").style.display = "none"

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

            // Update title bar colors
            
        })
}

function renderBrightnessMode() {
    brightnessModeEl.innerHTML = brightnessMode !== "light" ? lightModeSVG : darkModeSVG

    // set classes here
}
