BreakableToy Todo App 

 

A simple To-Do List application that allows users to create, edit, delete and manage tasks with priorities and due dates. It includes filtering, sorting, pagination and task completion tracking. 

 

Technologies Used 

Frontend: React, Typescript 
Backend: Spring Boot, Java 
Build Tools: Maven, npm 
Testing: Jest (frontend), Junit (backend) 
Version Control: Git 
 

Installation and Setup 

Backend 

Navegate to the backend folder: 
cd backend-todo-app 
Install dependencies and build the project: 
mvn clean install 
Run the backend server: 
mvn spring-boot: run 

The backend will start on http://localhost:9090 

Frontend 

Navigate to the frontend folder: 
cd frontend-todo-app 
Install dependencies: 
npm install 
Start the frontend server: 
npm start 

The frontend will run on http://localhost:8080 



Running Tests 

Backend Tests: 

mvn test 

Frontend Tests: 

npm test 

 

Features 

Create, edit and delete tasks 

Assign priorities (High, Medium, Low) 

Set and clear due dates 

Filter tasks by name, priority and completion status 

Sort tasks by priority and due date 

Mark tasks as done or undone 

Paginate tasks (10 per page) 

View tasks completion time metrics 
