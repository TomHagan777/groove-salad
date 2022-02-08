let capture;
let mic;


function setup() {
  cnv = createCanvas(989,560);
  cnv.style('padding:20px;');

  capture = createCapture(VIDEO);
  capture.hide();
  rectMode(CENTER);

  mic = new p5.AudioIn();
  mic.start();
  
  // compressor = new p5.Compressor();
  // mic.disconnect();
  // compressor.process(mic);
  //https://github.com/processing/p5.js-sound/blob/main/examples/Compressor/sketch.js
  //https://processing.github.io/p5.js-sound/examples/Compressor/
  // , [0.00], [17.00], [20.00], [0.00], [0.00]
  
  fft = new p5.FFT();
  fft.setInput(mic);

  slider1 = createSlider(0,5,0);
  slider2 = createSlider(0,225,225);
  slider3 = createSlider(0,225,130);
    slider1.position(1038,379);
    slider2.position(1038,310);
    slider3.position(1038,275);

    micSensitivity = createSlider(1,5,4);
    micSensitivity.position(1188,275);

    slider5 = createSlider(0,10,0);
    slider5.position(1038,445);
  
  button1 = createButton('On');
  button2 = createButton('Off');
    button1.position(1041,550);
    button2.position(1101,550);
      button1.style('padding-left:20px; padding-right:20px; padding-top:5px; padding-bottom:5px;');
      button2.style('padding-left:20px; padding-right:20px; padding-top:5px; padding-bottom:5px;');
    
  button1.mousePressed(startNoise);
    filter = new p5.BandPass();
    noise = new p5.Noise();
    noise.disconnect();
    noise.connect(filter);
  
  button2.mousePressed(stopNoise);
  
  title1 = createP ('Colour Shift');
  title2 = createP ('EQ Spread');
  title5 = createP ('Transform');
  title6 = createP ('Mic Sensitivity');
  title6.position(1188,226);
    title1.position(1041,226);
    title2.position(1041,330);
    title5.position(1041,399);
    
  title3 = createP ('Test: EQ Sweep');
    title3.position(1041,500);
    
  title4 = createP ('Click Here to Start');
    title4.position(450,height/2);
  
  cnv.mousePressed(titleInvisible);
  title4.mousePressed(titleInvisible);
  
  paragraph1 = createP ('Best paired with Google Chrome. Ensure the browser mic and camera are accessible. There is a simple SomaFM radio stream embedded above for demonstration - but use whatever you like! Additionally, to test the EQ spectrum, switch on EQ Sweep below to allow a y-controlled noise filter. Thank you.');
    paragraph1.position(1041,0);
    
  button3 = createImg('Images/expand05.png', 'Full Screen');
    button3.position(968,548);
    button3.mousePressed(fullScreen);
    button3.style("height: 20px;")
    
  button6 = createImg('Images/exitfull02.png', 'Exit');
    button6.position(displayWidth-55, 20);
    button6.mousePressed(fullScreen);
    button6.style('height: 20px; display: none;');
    
  button4 = createImg('Images/MenuOpen03.png', 'Menu');
    button4.position(20, 20);
    button4.mousePressed(fullscreen_menu);
    button4.style('height: 20px; display: none;');
  
  button5 = createImg('Images/MenuClose02.png', 'Close');
    button5.position(20,20);
    button5.style('height: 20px; display: none;');
    button5.mousePressed(fullscreen_menu_off);

//Fullscreen Visualiser Changes    
    cyNumberChange = 13;
    spectrumMultiplyer = 2;
}

function draw() {
    
  //NOISE FILTER//
  
  let freq = map(mouseY, 0, 380, 380, 15000);
  freq = constrain(freq, 380, 22000);
  filter.freq(freq); 
  filter.res(50);
  
  //BACKGROUND//

  let eq = fft.analyze()
  
  Lows = (int)(fft.getEnergy("bass"));
  LowMids = (int)(fft.getEnergy("lowMid"));
  Mids = (int)(fft.getEnergy("mid"));
  HighMids = (int)(fft.getEnergy("highMid"));
  Highs = (int)(fft.getEnergy("treble"));
  
  background([Lows + LowMids]/2, HighMids + Highs, Mids + slider3.value());

  //VIDEO AND EQ PIXEL LOAD//
    
  translate(slider5.value()*50,slider5.value()*50);

  capture.loadPixels();
  spectrum = fft.analyze();
  noStroke();
  fill([HighMids + Highs]*1.5, slider2.value() + Mids, [Lows + LowMids]/2,70*[slider1.value()+1]/1.5);

  for (let cy = capture.height; cy > 0; cy -= cyNumberChange) {
    for (let cx = 0; cx < capture.width; cx += 1+slider1.value()) {
      let xpos = (cx / capture.width) * width;
      let ypos = (cy / capture.height) * height;
      let offset = ((cy * capture.width) + cx) * 4;
      
      rect(xpos, ypos, 6-slider1.value(), 
      spectrum[cy] * spectrumMultiplyer * 
      ((capture.pixels[offset + 1] / 255) / (6-micSensitivity.value()) )); 
    
  //TRANSFORM//
        
  rotate(PI / 180 * slider5.value());
        
    }      
  } 
}

function startNoise() {
  noise.start();
  noise.amp(2);
}

function stopNoise() {
  noise.stop();
}

function titleInvisible() {
  title4.style('display:none')
}

function keyPressed() {
  if (cnv.width >= 1000 && keyCode === ESCAPE) {
    key = 0;
    fullScreen();
  }
}

function fullScreen() {
    let fs = fullscreen();
    fullscreen(!fs);

    if (fullscreen()) {
    createCanvas(989,560);
    cnv.style('padding:20px; border-width:1px');
        title1.style('display:block');
        title2.style('display:block');
        title3.style('display:block');
        title5.style('display:block');
        title6.style('display:block');
            slider1.style('display:block');
            slider2.style('display:block');
            slider3.style('display:block');
            slider5.style('display:block');
            micSensitivity.style('display:block')
                button1.style('display:block');
                button2.style('display:block');
        title4.position(450,height/2);
        button3.position(955,537);
            button3.style('display:block');
            button4.style('display:none');
            button6.style('display:none');
            button5.style('display:none');
        title1.position(1041,226);
        title2.position(1041,330);
        title3.position(1041,500);
        title5.position(1041,399);
        title6.position(1188,226);
            slider1.position(1038,379);
            slider2.position(1038,310);
            slider3.position(1038,275);
            slider5.position(1038,445);
            micSensitivity.position(1188,275);
                button1.position(1041,550);
                button2.position(1101,550);
        paragraph1.style('display:block');
                
    cyNumberChange = 13;
    spectrumMultiplyer = 1;
    transparencyChange = 255;

    } else {
    createCanvas(displayWidth-2, displayHeight-2);
    cnv.style('padding:0px; border-width:0px');
        title1.style('display:none');
        title2.style('display:none');
        title3.style('display:none');
        title5.style('display:none');
        title6.style('display:none');
            slider1.style('display:none');
            slider2.style('display:none');
            slider3.style('display:none');
            slider5.style('display:none');
            micSensitivity.style('display:none')
                button1.style('display:none');
                button2.style('display:none');
        title4.position(800,height/2);
            button3.style('display:none');
            button4.style('display:block');
            button6.style('display:block');
        title1.position(22,displayHeight-374);
        title2.position(22,displayHeight-270);
        title5.position(22,displayHeight-201); 
        title6.position(22,displayHeight-120);  
            slider1.position(20,displayHeight-221);
            slider2.position(20,displayHeight-290);
            slider3.position(20,displayHeight-325);
            slider5.position(20,displayHeight-155);
            micSensitivity.position(20,displayHeight-80);
        paragraph1.style('display:none');
                         
    cyNumberChange = 11;
    spectrumMultiplyer = 1.5;
    
    }
}

function fullscreen_menu() {
    title1.style('display:block');
    title2.style('display:block');
    title3.style('display:none');
    title5.style('display:block');
    title6.style('display:block');
        slider1.style('display:block');
        slider2.style('display:block');
        slider3.style('display:block');
        slider5.style('display:block');
        micSensitivity.style('display:block')
            button1.style('display:none');
            button2.style('display:none');
    button4.style('display:none');
    button5.style ('display:block');
    // button5.position(15);
}

function fullscreen_menu_off(){
    title1.style('display:none');
        title2.style('display:none');
        title3.style('display:none');
        title5.style('display:none');
        title6.style('display:none');
            slider1.style('display:none');
            slider2.style('display:none');
            slider3.style('display:none');
            slider5.style('display:none');
            micSensitivity.style('display:none')
                button1.style('display:none');
                button2.style('display:none');
    button4.style('display:block');
    button5.style('display:none');
}
    
function touchStarted() {
  getAudioContext().resume()
}

