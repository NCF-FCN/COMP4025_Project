
export function debugSliders(name, offset, range, callback) {
    const template = document.getElementById("debugSlider");
    const clone = template.cloneNode(true);
    template.parentElement.appendChild(clone);
    clone.style.display = 'block';
    clone.getElementsByClassName('name')[0].innerText = name;

    const inputs = [...clone.getElementsByClassName("debug-slider")];

    function getValues() {
        return inputs.map((el, i) => parseFloat(el.value) * range + (offset instanceof Array ? offset[i] : offset));
    }

    function onChange() {
        console.log("[Debug sliders]", name, getValues());
    }

    function onInput() {
        callback(getValues());
    }
    inputs.forEach(el => el.addEventListener("input", onInput));
    inputs.forEach(el => el.addEventListener("change", onChange));
    onInput();
}
