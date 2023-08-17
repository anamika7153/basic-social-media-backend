<h1 align="center" id="title">Social media backend</h1>

<p id="description">Welcome to the README file for your backend app. This document provides instructions on how to install run test and use your app along with information about Docker containerization.</p>

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository:</p>

```
git clone https://github.com/yourusername/your-backend-app.git
```
<p>2.</p>

```
cd your-backend-app
```
<p>3.</p>

```
npm install or yarn install
```

<p>4. Create .env file in root directory and add the necessary configuration variables</p>

```
PORT = your_port
```

```
MONGO_URI = your_mongodb_url
```

```
JWT_SECRET = your_secret_key
```

<h2>🛠️ Testing Steps:</h2>

```
cd your-backend-app
```

```
npm run test
```

## Docker Image

You can find the Docker image for this project on Docker Hub:

[anamikayadav/social-media-backend](https://hub.docker.com/layers/anamikayadav/social-media-backend/latest/images/sha256-b44e3209439a5ad42d925bb5ab5bbb50c28d5ef441117b47ff1c4ec827071776?context=repo)

<h2>🛠️ Docker setup:</h2>

<p>1. Build the Docker image:</p>

```
docker build -t image_name .

```

<p>1. Run the Docker container:</p>

```
docker run -d -p 8080:8080 --name container_name image_name
```
