const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Twitch Clip Downloader</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-image: url("img1.PNG");
            background-repeat: no-repeat;
            background-size: cover;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .container {
            text-align: center;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            opacity: 0.8;
            margin-bottom: 20px;
          }

          h1 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #6441a5; /* Twitch purple */
          }

          input[type="text"] {
            width: 90%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #9e9b9b;
            border-radius: 5px;
            font-size: 16px;
          }

          button {
            background-color: #6441a5; /* Twitch purple */
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
          }

          button:hover {
            background-color: #50397f; /* Darker purple */
          }

          .container2 {
            text-align: center;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            opacity: 0.8;
            height: 220px;
          }

          .carousel {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
          }

          .carousel-inner {
            display: flex;
            transition: transform 0.5s ease-in-out;
          }

          .carousel-item {
            flex: 0 0 100%;
            max-width: 100%;
            transition: transform 0.5s ease-in-out;
            text-align: center;
          }

          .carousel-item.active {
            display: block;
          }

          .carousel-control {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            z-index: 10;
            color: #6441a5; /* Twitch purple */
            outline: none;
          }

          .carousel-control.prev {
            left: 10px;
          }

          .carousel-control.next {
            right: 10px;
          }

          /* Responsiveness */
          @media (max-width: 768px) {
            .container,
            .container2 {
              max-width: 90%;
            }
          }

          @media (max-width: 480px) {
            h1 {
              font-size: 20px;
            }

            .carousel-control {
              font-size: 1.5rem;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Enter Twitch Clip URL</h1>
          <input
            type="text"
            id="clipUrl"
            placeholder="https://clips.twitch.tv/FantasticShinyRhinocerosAMPEnergyCherry-gZc2-c09qyxYlSfZ"
          />
          <button onclick="downloadClip()">Download</button>
        </div>
        <div class="container2">
          <div class="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <h1>Get Started</h1>
                <ol>
                  <li>
                    Locate the video that you want to download, then copy the URL.
                  </li>
                  <br />
                  <li>
                    Copy the URL, paste it into the box above, and select "Download"
                  </li>
                  <br />
                  <li>And that's it! All you have to do is save the video.</li>
                </ol>
              </div>
              <div class="carousel-item">
                <h1>Copying a Twitch Video Link</h1>
                <ol>
                  <li>Use a browser to access the video on Twitch.tv.</li>
                  <br />
                  <li>With a right-click, choose "Copy" from the address bar.</li>
                  <br />
                  <li>
                    As an alternative, choose "Copy Link" from the menu by clicking
                    the video sharing button.
                  </li>
                </ol>
              </div>
              <div class="carousel-item">
                <h1>twitch video / mp4</h1>
                <p>
                  We have an Twitch video converter available for you! Although it
                  can only convert videos under 30 sec, it works great for short MP4
                  clips. Although longer videos aren't the best for conversion, you
                  can download them or convert to MP4 on YouTube. Try it out!
                </p>
              </div>
            </div>
            <button class="carousel-control prev" onclick="prevSlide()">‹</button>
            <button class="carousel-control next" onclick="nextSlide()">›</button>
          </div>
        </div>

        <script>
          let slideIndex = 1;

          showSlides(slideIndex);

          function plusSlides(n) {
            showSlides((slideIndex += n));
          }

          function currentSlide(n) {
            showSlides((slideIndex = n));
          }

          function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("carousel-item");
            let dots = document.getElementsByClassName("dot");
            if (n > slides.length) {
              slideIndex = 1;
            }
            if (n < 1) {
              slideIndex = slides.length;
            }
            for (i = 0; i < slides.length; i++) {
              slides[i].style.display = "none";
            }
            for (i = 0; i < dots.length; i++) {
              dots[i].className = dots[i].className.replace(" active", "");
            }
            slides[slideIndex - 1].style.display = "block";
            dots[slideIndex - 1].className += " active";
          }

          function prevSlide() {
            plusSlides(-1);
          }

          function nextSlide() {
            plusSlides(1);
          }

          async function downloadClip() {
            const clipUrl = document.getElementById("clipUrl").value;
            const clipId = clipUrl.split("/").pop().split("?")[0];
            console.log("Clip URL:", clipUrl); // Debugging line
            console.log("Extracted Clip ID:", clipId); // Debugging line

            try {
              const response = await fetch("/getClip", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ clipId }),
              });

              const data = await response.json();
              console.log("Server Response:", data); // Debugging line

              if (data.data && data.data.length > 0) {
                const downloadUrl =
                  data.data[0].thumbnail_url.split("-preview-")[0] + ".mp4";
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = \`\${clipId}.mp4\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } else {
                alert("Clip not found. Please check the URL.");
              }
            } catch (error) {
              console.error("Error:", error);
              alert("Failed to download the clip. Please try again.");
            }
          }
        </script>
      </body>
    </html>
  `);
});

app.post('/getClip', async (req, res) => {
  const { clipId } = req.body;

  try {
    const response = await axios.get(`https://api.twitch.tv/helix/clips?id=${clipId}`, {
      headers: {
        'Client-ID': process.env.CLIENT_ID, 
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}` 
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching clip');
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
