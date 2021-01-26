

class FireMaker {
    constructor(fireHeight, fireWidth) {
        this.fireHeight = fireHeight;
        this.fireWidth = fireWidth;
        this.firePixelsArray = [];
        this.intensityDecayFactor = 4;
        this.minIntensity = 50;
        this.maxIntensity = 2;
        this.fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }];
        this.debug = false;
    }

    changeDebug() {
        this.debug = !this.debug
    }

    getIntensityDecayFactor() {
        return this.intensityDecayFactor;
    }

    setIntensityDecayFactor(newIntensityDecayFactor) {
        const intensitySum = this.intensityDecayFactor + newIntensityDecayFactor
        this.intensityDecayFactor = newIntensityDecayFactor < 0 && intensitySum >= this.maxIntensity || newIntensityDecayFactor > 0 && intensitySum <= this.minIntensity ? intensitySum : this.intensityDecayFactor;
    }


    createFireDataStructure() {
        this.numberOfPixels = this.fireWidth * this.fireHeight;
        for (let i = 0; i < this.numberOfPixels; i++) {
            this.firePixelsArray[i] = 0;
        };
        this.baseZeroSize = this.firePixelsArray.length - 1;
    }

    calculateFirePropagation() {
        for (let col = 0; col < this.fireWidth; col++) {
            for (let row = 0; row < this.fireHeight; row++) {
                const pixelIndex = (this.fireWidth * row) + col;
                this.updateFireIntensity(pixelIndex);
            }
        }
    }

    updateFireIntensity(pixelIndex) {
        const previousColPixelIndex = pixelIndex + this.fireWidth;
        if (previousColPixelIndex > this.baseZeroSize) return;
        const intensityDecay = Math.floor(Math.random() * this.intensityDecayFactor);
        const decay = this.firePixelsArray[previousColPixelIndex] - intensityDecay >= 0 ? this.firePixelsArray[previousColPixelIndex] - intensityDecay : 0
        this.firePixelsArray[pixelIndex - intensityDecay] = decay;
    }

    renderFire() {
        let html = "<table cellpadding=0 cellspacing=0>";

        for (let row = 0; row < this.fireHeight; row++) {
            html += "<tr>";
            for (let col = 0; col < this.fireWidth; col++) {
                const pixelIndex = (this.fireWidth * row) + col;
                const fireIndex = this.firePixelsArray[pixelIndex];

                if (!this.debug) {
                    const color = this.fireColorsPalette[fireIndex];
                    const colorString = `${color.r},${color.g},${color.b}`
                    html += `<td class="pixel" style="background-color: rgb(${colorString})"></td>`
                } else {
                    const pixelDiv = `<div class="pixel-index">${pixelIndex}</div>`;
                    const fireIndexDiv = `<div class="fire-index">${fireIndex}</div>`;
                    html += `<td>${fireIndexDiv + pixelDiv}</td>`
                }

            }
            html += "</tr>";
        }

        html += "</table>";

        document.getElementById("fireCanvas").innerHTML = html;
    }

    createFireSource(maxIntensity) {
        if (maxIntensity > 36) maxIntensity = 36;
        for (let i = (this.baseZeroSize); i > (this.baseZeroSize - this.fireWidth); i--) this.firePixelsArray[i] = maxIntensity;
    }


}

class FireController {
    constructor(FireMaker, updateFrequency) {
        this.maker = FireMaker;
        this.updateFrequency = updateFrequency;
    }

    start() {
        this.maker.createFireDataStructure();
        this.maker.createFireSource(36);
        this.maker.renderFire();
        setInterval(() => {
            this.maker.calculateFirePropagation();
            this.maker.renderFire();
        }, this.updateFrequency)
    }

    changeFireIntensity(operationValue) {
        this.maker.setIntensityDecayFactor(operationValue);
    }

    maxFireIntensity() {
        const intensity = this.maker.getIntensityDecayFactor();
        const goToMaxValue = this.maker.maxIntensity - intensity;
        this.maker.setIntensityDecayFactor(goToMaxValue);
    }

    minFireIntensity() {
        const intensity = this.maker.getIntensityDecayFactor();
        const goToMinValue = this.maker.minIntensity - intensity;
        this.maker.setIntensityDecayFactor(goToMinValue);
    }

    switchDebug() {
        this.maker.changeDebug();
    }

};


const Maker = new FireMaker(40, 60);
const Controller = new FireController(Maker, 50);


document.getElementById("moreIntensity-button").onclick = () => {
    Controller.changeFireIntensity(-1);
}

document.getElementById("lessIntensity-button").onclick = () => {
    Controller.changeFireIntensity(1);
}

document.getElementById("maxFire-button").onclick = () => {
    Controller.maxFireIntensity();
}

document.getElementById("minFire-button").onclick = () => {
    Controller.minFireIntensity();
}

document.getElementById("changeDebug-button").onclick = () => {
    Controller.switchDebug();
}

document.getElementById("start-button").onclick = () => {
    Controller.start();
}