<a name="readme-top">

<br/>

<br />
<div align="center">
  <a href="https://github.com/zyx-0314/">
  <!-- TODO: If you want to add logo or banner you can add it here -->
    
  </a>
<!-- TODO: Change Title to the name of the title of your Project -->
  <h3 align="center">Alaga - Your Pet's Best Companion</h3>
</div>
<!-- TODO: Make a short description -->
<div align="center">

</div>

<br />

<!-- TODO: Change the zyx-0314 into your github username  -->
<!-- TODO: Change the WD-Template-Project into the same name of your folder -->
![](https://visit-counter.vercel.app/counter.png?page=zyx-0314/WD-Template-Project)

[![wakatime](https://wakatime.com/badge/user/018dd99a-4985-4f98-8216-6ca6fe2ce0f8/project/63501637-9a31-42f0-960d-4d0ab47977f8.svg)](https://wakatime.com/badge/user/018dd99a-4985-4f98-8216-6ca6fe2ce0f8/project/63501637-9a31-42f0-960d-4d0ab47977f8)

---

<br />
<br />

<!-- TODO: If you want to add more layers for your readme -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#overview">Overview</a>
      <ol>
        <li>
          <a href="#key-components">Key Components</a>
        </li>
        <li>
          <a href="#technology">Technology</a>
        </li>
      </ol>
    </li>
    <li>
      <a href="#rule,-practices-and-principles">Rules, Practices and Principles</a>
    </li>
    <li>
      <a href="#resources">Resources</a>
    </li>
  </ol>
</details>

---

## Overview

Alaga is a pet care platform that helps owners keep their pets healthy and happy. It offers tools for tracking health, managing vet appointments, and connecting with other pet lovers. You can also store pet health records, track vaccinations, and find nearby vets and services.

Guiding Question:
- What is the project? 
    - Alaga is a pet care platform that enables users to track their pet’s health, schedule vet visits, and engage with a pet-loving community.
- Whats the purpose? 
    - To help pet owners stay informed with trusted resources on pet health and foster a community of responsible pet owners.
- What are key components? 
    - User Authentication: Secure login and registration using Firebase Authentication.

    - Pet Health Tracker: Log pet health updates, vaccinations, and medical history.

    - Vet Scheduler: Book and manage veterinary appointments with reminders.

    - Community Forum: Discuss pet care topics and share experiences with other owners.
    - Resource Library: Access a collection of trusted pet care guides.
    - Admin Dashboard: Manage forum posts, vet listings, and user-reported issues.
- What technology used and how it is used
    - Frontend: React.js with Tailwind CSS for a clean and responsive UI.
    - Backend: Node.js and Firebase Firestore for real-time data management.
    - Database: Firestore for storing pet health data, appointments, and forum posts.
    - Notifications: Real-time alerts for forum replies and vet appointment reminders.

### Key Components
<!-- TODO: List of Key Components -->
<!-- The following are just sample -->
- User Authentication (Firebase Auth)
- Pet Health Tracking (Firestore)
- Appointment Scheduling (Calendar-based UI)
- Community Forum (Real-time discussions)
- Admin Dashboard (Content moderation)

### Technology
<!-- TODO: List of Technology Used -->
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)


## Rules, Practices and Principles
1. Always use `WD-` in the front of the Title of the Project for the Subject followed by your custom naming.
2. Do not rename any .html files; always use `index.html` as the filename.
3. Place Files in their respective folders.
4. All file naming are in camel case.
   - Camel case is naming format where there is no white space in separation of each words, the first word is in all lower case while the succeding words first letter are in upper followed by lower cased letters.
   - ex.: buttonAnimatedStyle.css
5. Use only `External CSS`.
6. Renaming of Pages folder names are a must, and relates to what it is doing or data it holding.
7. File Structure to follow below.

```
WD-ProjectName
└─ assets
|   └─ css
|   |   └─ style.css
|   └─ img
|   |   └─ fileWith.jpeg/.jpg/.webp/.png
|   └─ js
|       └─ script.js
└─ pages
|  └─ pageName
|     └─ assets
|     |  └─ css
|     |  |  └─ style.css
|     |  └─ img
|     |  |  └─ fileWith.jpeg/.jpg/.webp/.png
|     |  └─ js
|     |     └─ script.js
|     └─ index.html
└─ index.html
└─ readme.md
```

## Resources

<!-- TODO: Add References -->
| Title | Purpose | Link |
|-|-|-|
| Firebase Documentation | Official Firebase guide for authentication and Firestore | firebase.google.com
| React Docs | Reference for React.js development | reactjs.org
| Tailwind CSS Docs | Styling guide for Tailwind CSS | tailwindcss.com
| Node.js Docs | Backend framework documentation | nodejs.org
