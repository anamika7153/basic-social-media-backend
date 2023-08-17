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
## Screenshots
|||
|---|---|
| ![image](https://github.com/anamika7153/social-media-backend/assets/66116440/65024fb4-3be2-4e91-a78a-ceb4bbf5e7dc) | ![image](https://github.com/anamika7153/social-media-backend/assets/66116440/f736a971-b379-4157-8ef4-d87b4766e700) |
| | |
|![image](https://github.com/anamika7153/social-media-backend/assets/66116440/698c867c-52ca-49f6-a47d-aa1fd96b817d)|![image](https://github.com/anamika7153/social-media-backend/assets/66116440/d71e570e-8414-4b02-a192-1ab2d38001a6)|
|||
|![image](https://github.com/anamika7153/social-media-backend/assets/66116440/1145e66c-a962-4160-b0ac-2920caa252c7)|![image](https://github.com/anamika7153/social-media-backend/assets/66116440/31b6d156-0307-4794-afe4-948c3f9480e2)|

