// --- 1. Dark/Light Mode Toggle (Root-level Flash-Free) ---
const toggleBtn = document.getElementById('theme-toggle');

// Check the html element instead of the body
if (document.documentElement.classList.contains('dark-mode')) {
    toggleBtn.innerText = '[ ☼ ]';
} else {
    toggleBtn.innerText = '[ ☽ ]';
}

toggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-mode');
    
    if (document.documentElement.classList.contains('dark-mode')) {
        toggleBtn.innerText = '[ ☼ ]'; 
        localStorage.setItem('theme', 'dark'); 
    } else {
        toggleBtn.innerText = '[ ☽ ]'; 
        localStorage.setItem('theme', 'light'); 
    }
});

// --- 2. Faint Mandelbrot Background ---
const mandelbrotSketch = (p) => {
    p.setup = () => {
        let canvas = p.createCanvas(200, 200); 
        canvas.parent('mandelbrot-bg');
        p.pixelDensity(1);
        p.noLoop(); 
        drawMandelbrot();
    };

    function drawMandelbrot() {
        p.loadPixels();
        const maxiterations = 40; 
        for (let x = 0; x < p.width; x++) {
            for (let y = 0; y < p.height; y++) {
                let a = p.map(x, 0, p.width, -2.5, 1.5);
                let b = p.map(y, 0, p.height, -2, 2);
                let ca = a;
                let cb = b;
                let n = 0;
                while (n < maxiterations) {
                    let aa = a * a - b * b;
                    let bb = 2 * a * b;
                    a = aa + ca;
                    b = bb + cb;
                    if (a * a + b * b > 16) break;
                    n++;
                }
                let bright = p.map(n, 0, maxiterations, 255, 200);
                if (n === maxiterations) bright = 255;
                
                let pix = (x + y * p.width) * 4;
                p.pixels[pix + 0] = bright;
                p.pixels[pix + 1] = bright;
                p.pixels[pix + 2] = bright;
                p.pixels[pix + 3] = 255;
            }
        }
        p.updatePixels();
    }
};
new p5(mandelbrotSketch);

// --- 3. Image Scratch Effect with Double-Click Reset ---
const scratchSketch = (p) => {
    let img;

    p.preload = () => {
        img = p.loadImage('Ashutosh Kumar.jpg'); 
    };

    p.setup = () => {
        let canvas = p.createCanvas(400, 400);
        canvas.parent('scratch-canvas-container');
        p.image(img, 0, 0, p.width, p.height);
    };

    p.draw = () => {
        if (p.mouseIsPressed) {
            p.erase();
            p.strokeWeight(40); 
            p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
            p.noErase();
        }
    };

    // Resets the image when you double click the canvas
    p.doubleClicked = () => {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            p.image(img, 0, 0, p.width, p.height);
        }
    };
};
// Only run the scratch sketch if the container exists (so it doesn't break other pages)
if (document.getElementById('scratch-canvas-container')) {
    new p5(scratchSketch);
}