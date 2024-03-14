import { lightModeSVG, darkModeSVG } from '/svg.js'

const brightnessModeEl = document.getElementById("brightness-mode")
const seedColorEl = document.getElementById("seed-color")
const modeEl = document.getElementById("mode")
const colorSchemeEl = document.getElementById("color-scheme")

// default to light mode
let brightnessMode = "light"
renderBrightnessMode()

// Event Listeners
seedColorEl.addEventListener('change', () => {
    updateColorScheme()
})

function updateColorScheme() {
    // Call the Color API
    fetch(`https://www.thecolorapi.com/scheme?hex=${seedColorEl.value.slice(1)}&count=5&mode=${modeEl.value}`)
        .then(response => response.json())
        .then( ({ colors }) => {
            // Build color scheme display.
            let html = ""
            // First add color blocks
            for (const { hex } of colors) {
               html += `<div class='color-block' id='${hex.value}' style='background-color: ${hex.value}'></div>`
            }
            // Add hex values
            for (const { hex } of colors) {
                html += `<div class='color-hex' id='${hex.value}-hex'>${hex.value}</div>`
            }
            colorSchemeEl.style.gridTemplateColumns = "repeat(5, 1fr)"
            colorSchemeEl.innerHTML = html
        })
}

function renderBrightnessMode() {
    brightnessModeEl.innerHTML = brightnessMode !== "light" ? lightModeSVG : darkModeSVG

    // set classes here
}
