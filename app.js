const canvas = document.getElementById('canvas1');
canvas.width = 700;
canvas.height = 350;

const ctx = canvas.getContext('2d');

const image1 = new Image();
image1.src = './assets/Luffy-pic-2.png';

image1.addEventListener('load', () => {
  ctx.drawImage(image1, 0, 0);
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  console.log(scannedImage);
  const scannedData = scannedImage.data;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const calculateRelativeBrightness = (red, green, blue) => {
    return (
      Math.sqrt(
        red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
      ) / 100
    );
  };

  let mappedImage = [];
  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = scannedData[(y * 4 * scannedImage.width) + (x * 4)];
      const green = scannedData[(y * 4 * scannedImage.width) + (x * 4 + 1)];
      const blue = scannedData[(y * 4 * scannedImage.width) + (x * 4 + 2)];
      const brightness = calculateRelativeBrightness(red, green, blue);
      const cell = [brightness, `rgb(${red}, ${green}, ${blue})`];
      row.push(cell);
    }
    mappedImage.push(row);
  }
  console.log(mappedImage);
  console.log(mappedImage[349])


  let particlesArray = [];
  const numberOfParticles = 5000;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 0.5;
      this.positionY = Math.floor(this.y);
      this.positionX = Math.floor(this.x);
    }

    update() {
      this.positionY = Math.floor(this.y);
      this.positionX = Math.floor(this.x);
      this.speed = mappedImage[this.positionY][this.positionX][0];

      let movement = (3 - this.speed) + this.velocity;


      this.y += movement;
      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
    }

    draw() {
      const rgb = mappedImage[this.positionY][this.positionX][1];

      ctx.beginPath();
      ctx.fillStyle = rgb;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initParticles = (numberOfParticles) => {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  };
  initParticles(numberOfParticles);
  console.log(particlesArray);

  const animate = () => {
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      ctx.globalAlpha = particlesArray[i].speed * 0.5;
      particlesArray[i].draw();
    }

    requestAnimationFrame(animate);
  };
  animate();
});

const image2 = new Image();
image2.src = './assets/Luffy-pic-2.png';

image2.addEventListener('load', () => {
  const canvas2 = document.getElementById('canvas2');
  canvas2.width = 700;
  canvas2.height = 350;
  const ctx2 = canvas2.getContext('2d');

  ctx2.drawImage(image2, 0, 0);
  const scannedImage = ctx2.getImageData(0, 0, canvas.width, canvas.height);
  console.log(scannedImage);
  const scannedData = scannedImage.data;

  const changeGrayscale = () => {
    for (let i = 0; i < scannedData.length; i += 4) {
      const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
      const averageColorValue = total / 3;

      scannedData[i] = averageColorValue;
      scannedData[i + 1] = averageColorValue;
      scannedData[i + 2] = averageColorValue;
    }
    scannedImage.data = scannedData;
  };

  changeGrayscale();
  ctx2.putImageData(scannedImage, 0, 0);
})
