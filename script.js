const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvas = document.querySelector(".clear-canvas"),
  saveImage = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");

// Global variables with default values
let startX, startY,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor="#000",
    snapshot;


const  setCanvasBackground = () =>{
  ctx.fillStyle ="#fff";
  ctx.fillRect(0 , 0 , canvas.width , canvas.height);
  ctx.fillStyle =selectedColor;
}    

window.addEventListener("load", () => {
  // Setting canvas width/height with offsetWidth
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRecta = (e) => {
  const width = e.offsetX - startX;
  const height = e.offsetY - startY;
  ctx.beginPath();
  if (!fillColor.checked) {
    ctx.strokeRect(startX, startY, width, height);
  } else {
    ctx.fillRect(startX, startY, width, height);
  }
};

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(Math.pow((startX - e.offsetX), 2) + Math.pow((startY - e.offsetY), 2));
  ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(startX * 2 - e.offsetX, e.offsetY); // Calculate third point based on the first and second
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};


const startDraw = (e) => {
  isDrawing = true;
  startX = e.offsetX; // Capture starting X position
  startY = e.offsetY; // Capture starting Y position
  ctx.beginPath(); // Create a new path to draw
  ctx.lineWidth = brushWidth; // Set brush size as lineWidth
  ctx.strokeStyle =selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // Capture canvas state
};

const drawing = (e) => {
  if (!isDrawing) return; // If not drawing, return

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.putImageData(snapshot, 0, 0); // Restore canvas state
    ctx.lineTo(e.offsetX, e.offsetY); // Create line according to mouse
    ctx.stroke(); // Draw/fill line with color
  } else if (selectedTool === "rectangle") {
    ctx.putImageData(snapshot, 0, 0); // Restore canvas state
    drawRecta(e); // Draw rectangle
  } else if (selectedTool === "circle") {
    ctx.putImageData(snapshot, 0, 0); // Restore canvas state
    drawCircle(e); // Draw circle
  } else if (selectedTool === "triangle") {
    ctx.putImageData(snapshot, 0, 0); // Restore canvas state
    drawTriangle(e); // Draw triangle
  }
};

toolBtns.forEach(btn => {
  btn.addEventListener("click", () => { // Adding click event to all tool options (shapes, brush)
    document.querySelector(".options .active").classList.remove("active"); // Remove class & add to clicked option
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});


sizeSlider.addEventListener("change",()=> brushWidth =sizeSlider.value);

colorBtns.forEach(btn =>{
  btn.addEventListener("click",()=>{

    document.querySelector(".options .selected").classList.remove("selected"); // Remove class & add to clicked option
    btn.classList.add("selected");  
    //passing the selected color
    selectedColor =window.getComputedStyle(btn).getPropertyValue("background-color");
    
  });

});

colorPicker.addEventListener("change",()=>{
  //passing color picker color
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click(); 
});

//clear canvas
clearCanvas.addEventListener("click",()=>{
ctx.clearRect(0,0,canvas.width,canvas.height);
setCanvasBackground();
});

saveImage.addEventListener("click",()=>{
  const link = document.createElement("a");//creating a <a> element
  link.download = `${Date.now}.jpg`;
  link.href = canvas.toDataURL(); //return a data url of the image
  link.click(); //clicking  link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
