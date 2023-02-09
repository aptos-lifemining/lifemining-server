# Lifemining Server

(Project from Aptos Seoul Hackathon 2023)

The Lifemining solution involves connecting real life and digital life through the use of video and NFTs. Creators and followers can participate in challenges and document the process with videos. By completing the challenge, they can earn rewards and create a shared NFT to commemorate their achievement.

## Prerequisites
- Docker-Compose
- Elastic Beanstalk
- RDS (MySQL)
- PETRA wallet (for now)

## How it works
1. Challenge: The creator sets a challenge, and followers can stake tokens (APT) on it.
2. Record: Followers upload videos periodically to document their progress and when the challenge is complete, they can apply for a claim.
3. Mine: Followers can earn prize money (which is deducted if they fail), grow their own dynamic NFTs, and mint the group's challenge certification video as an NFT.

## Potential Use Cases
- Education: To increase completion rates of educational programs, the challenge process can be recorded and celebrated with an NFT.
- Entertainment: In the entertainment industry, idols can hold dance challenges with fans and share the rewards through an NFT.
- Sports: In the sports industry, companies like NIKE can release new products and incentivize people to participate in a daily running challenge, rewarding those who complete it with prizes and NFTs. This creates a more meaningful experience where people don't just consume, but also participate and feel a sense of ownership.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/aptos-lifemining/lifemining-server.git
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory of the project, and set the environment variables for the project. You have to set up elastic beanstalk, RDS, S3 to set up on your own.

```
NODE_ENV=dev
NGINX_PORT=80
BACKEND_PORT=8000
DB_HOST=[secret]
DB_PORT=[secret]
DB_USERNAME=[secret]
DB_PASSWORD=[secret]
DB_DATABASE=[secret]
DB_SYNCHRONIZE=true
JWT_SECRET_KEY=[secret]
AWS_BUCKET_REGION=ap-northeast-2
AWS_BUCKET_NAME=[secret]
AWS_ACCESS_KEY_ID=[secret]
AWS_SECRET_ACCESS_KEY=[secret]
AWS_S3_HLS_PATH=/Default/assets/VANLIFE/HLS/
AWS_S3_CLOUDFRONT_ENDPOINT=[secret]
```

4. Start the server:

```
npm start
```

5. Visit http://localhost:8000 in your browser to access the API endpoint. The API documentation is available at http://localhost:8000/api-docs

## Authentication
Authentication is based on the user's Aptos address, using the "address" key in the HTTP header. It will be updated to a more secure method in the future, and a custom wallet will be used for better UX integration instead of the PETRA wallet.

## Server API
You can access the API documentation at https://server-test.uzumeta.com/api-docs

## Contribution
The main branch is protected, so any contributions should be made through a pull request. If you have any questions or suggestions, you can reach the project owner at june@trinitystudio.io.

## Screenshots
<p align="center">
  <img width="252" alt="image" src="https://user-images.githubusercontent.com/84962016/217451813-c588996e-948f-430c-b1dd-bb19aeb789ce.png">
  <img width="252" alt="image" src="https://user-images.githubusercontent.com/84962016/217451886-3228dcb9-7005-4f37-97be-c24a4194982b.png">
  <img width="252" alt="image" src="https://user-images.githubusercontent.com/84962016/217451947-222f345a-8053-455f-8606-1fbe3522df88.png">
  <img width="252" alt="image" src="https://user-images.githubusercontent.com/84962016/217452371-e71a82af-fb70-4e88-928a-f085fc043e84.png">
  <img width="252" alt="image" src="https://user-images.githubusercontent.com/84962016/217452042-e096ffdd-e585-4302
