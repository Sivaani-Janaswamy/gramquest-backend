# Gramquest Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)
[![Last Commit](https://img.shields.io/github/last-commit/Sivaani-Janaswamy/gramquest-backend)](https://github.com/Sivaani-Janaswamy/gramquest-backend)
[![Issues](https://img.shields.io/github/issues/Sivaani-Janaswamy/gramquest-backend)](https://github.com/Sivaani-Janaswamy/gramquest-backend/issues)
[![Build](https://img.shields.io/github/actions/workflow/status/Sivaani-Janaswamy/gramquest-backend/node.js.yml?branch=main)](https://github.com/Sivaani-Janaswamy/gramquest-backend/actions)
[![License](https://img.shields.io/github/license/Sivaani-Janaswamy/gramquest-backend)](https://opensource.org/licenses/MIT)


## Quick Setup Guide

This repository contains the backend API for **Gramquest**. It manages user authentication, content, and interactions, serving data to the frontend.

### Technologies Used

* Node.js, Express.js
* MongoDB, Mongoose
* bcryptjs, jsonwebtoken, dotenv

### Prerequisites

Ensure you have these installed:

* [Node.js](https://nodejs.org/) (LTS)
* [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (running locally or cloud access)

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/your-username/gramquest-backend.git](https://github.com/your-username/gramquest-backend.git)
    cd gramquest-backend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    # OR
    yarn install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root (`/server/.env`) with:
    ```
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/gramquest_db
    JWT_SECRET=YOUR_VERY_SECRET_JWT_KEY_HERE
    ```
    *(Adjust `MONGO_URI` if using a cloud database.)*
4.  **MongoDB Setup:**
    Ensure your MongoDB instance is running. No manual schema creation is needed; Mongoose handles it on data insertion.

### Running the Server

To start the backend in development mode:

```bash
npm run dev
# OR
yarn dev
````

The server will typically run on `http://localhost:3000`.

-----

## Contributing

We welcome contributions\! Please follow these steps:

1.  **Fork the repository** to your GitHub account.
2.  **Clone your forked repository** to your local machine:
    ```bash
    git clone [https://github.com/your-github-username/gramquest-backend.git](https://github.com/your-github-username/gramquest-backend.git)
    cd gramquest-backend
    ```
3.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name 
    # OR
    git checkout -b bugfix/issue-description
    ```
4.  **Make your changes** and commit them with a clear message:
    ```bash
    git add .
    git commit -m "feat: Add user profile update functionality"
    ```
5.  **Push your changes** to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request** from your forked repository's branch to the `main` branch of the original Gramquest Backend repository.


