# 🎯 Job Board Management Project

## 🌟 Introduction
The **Job Board Management Project** is a dynamic and comprehensive web and mobile application tailored to streamline the management and distribution of job postings. Designed to empower administrators in creating and overseeing job listings and related blog content, this application helps job seekers effortlessly discover relevant opportunities and stay updated on industry trends. Our repository includes five key projects:

- **JobBoardApp** (Main application using ReactJS)
- **JobBoardEmployer** (Employer management using ReactJS)
- **JobBoardManagement** (Admin management using ReactJS)
- **JobBoardService** (Backend service using Spring Boot)
- **jobboardmobile** (Mobile application using Flutter)

## 🚀 Features
- **Job Listings Management**: Effortlessly create, update, delete, and view job postings.
- **Blog Management**: Manage blog posts, including creation, updates, deletions, and viewing.
- **Category Management**: Organize job listings and blogs into categories for intuitive navigation.
- **User Authentication**: Secure and manage access for administrators and users.
- **Responsive Design**: A seamless, user-friendly interface that adapts to various devices.

## 🛠️ Technologies Used
- **Backend (JobBoardService)**: Java, Spring Boot, Hibernate, JPA, MySQL, Lombok, Jakarta Persistence.
- **Web Frontend (JobBoardApp, JobBoardEmployer, JobBoardManagement)**: ReactJS, Redux, Axios, React Router, Material-UI.
- **Mobile Frontend (jobboardmobile)**: Flutter.

## 📥 Installation and Setup
To get started with the Job Board Management Project, ensure you have the following prerequisites installed: JDK 20 or later, Gradle, MySQL, Node.js and npm (or Yarn), and Flutter SDK.

### Backend Setup (JobBoardService)
1. **Clone the Repository**:
    ```bash
    git clone https://github.com/haphong463/job-board-project && cd job-board-project/JobBoardService
    ```
2. **Configure MySQL Database**: Update the `application.properties` file with your MySQL database credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/jobboard
    spring.datasource.username=root
    spring.datasource.password=yourpassword
    ```
3. **Build and Run the Application**:
    ```bash
    ./gradlew build
    ./gradlew bootRun
    ```

### Web Frontend Setup (JobBoardApp, JobBoardEmployer, JobBoardManagement)
1. **Clone the Repository**:
    ```bash
    git clone https://github.com/haphong463/job-board-project && cd job-board-project/JobBoardApp
    ```
2. **Install Dependencies**:
    ```bash
    npm install
    ```
3. **Start the Application**:
    ```bash
    npm start
    ```

### Mobile Frontend Setup (jobboardmobile)
1. **Clone the Repository**:
    ```bash
    git clone https://github.com/haphong463/job-board-project && cd job-board-project/jobboardmobile
    ```
2. **Install Dependencies**:
    ```bash
    flutter pub get
    ```
3. **Run the Application**:
    ```bash
    flutter run
    ```

We encourage contributions to improve this project. Please fork the repository and submit a pull request with your enhancements. This project is licensed under the MIT License. See the LICENSE file for details.
