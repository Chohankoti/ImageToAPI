const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 9000;

const imagesDir = path.join(__dirname, 'images');

// Middleware to serve individual images
app.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params;
    const imagePath = path.join(imagesDir, imageName);

    // Check if the image file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Image not found');
        }

        // Read the image file and send it in the response
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return res.status(500).send('Error reading the image');
            }
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        });
    });
});

// Middleware to list available images
app.get('/images', (req, res) => {
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading images directory');
        }

        const images = files.filter(file => file.endsWith('.jpg'));

        // Generate HTML for image links with CSS styling
        const imageLinks = images.map(image => `<a class="image-link" href="/images/${image}" target="_blank">${image}</a>`);

        // Send HTML response with image links and CSS
        const htmlResponse = `
            <html>
                <head>
                    <style>
                        body {
                            text-align: center;
                        }
                        h1 {
                            margin-bottom: 20px;
                        }
                        .image-link {
                            display: block;
                            margin-bottom: 10px;
                            text-decoration: none;
                            color: #333;
                            font-size: 16px;
                            font-weight: bold;
                        }
                        .image-link:hover {
                            color: #007bff;
                        }
                    </style>
                </head>
                <body>
                    <h1>Image List</h1>
                    ${imageLinks.join('')}
                </body>
            </html>`;
        res.send(htmlResponse);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
