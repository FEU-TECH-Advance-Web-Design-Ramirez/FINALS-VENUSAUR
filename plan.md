**Alaga - Your Pet’s Best Companion - Project Plan**

### 1. Persona
**Name:** Pet Owner & Enthusiast  
**Age:** 30 years old  
**Background:**
- A dedicated pet owner who wants to track their pet’s health, schedule vet visits, and engage with a pet-loving community.
- Interested in learning best practices for pet care and connecting with other pet owners.
  
**Key Characteristics:**
- Responsible and caring
- Seeks trustworthy information on pet health
- Enjoys engaging in community discussions
- Prefers a well-organized and intuitive user experience

---

### 2. UX Flow
**User Authentication:**
- **Login/Registration:** Secure sign-in via Firebase Authentication.
- **Welcome/Tutorial:** Onboarding flow to introduce app features.

**Home Screen:**
- **Featured Content:** Display key platform features like pet tracking, forum activity, and vet scheduling.
- **Navigation Menu:** Quick links to Forum, Vet Scheduler, and Pet Care Resources.

**Feature Interaction:**
- **Pet Health Tracker:** Allows users to log pet health updates, vaccinations, and medical history.
- **Vet Scheduler:** Appointment booking system with notifications.
- **Resource Library:** Collection of trusted pet care guides.


**Admin Workflow:**
- **Admin Dashboard:** Moderators can manage vet listings and user-reported issues.
- **Notification System:** Alerts for new content moderation requests.

---

### 3. Layout and Navigation
**Navigation Drawer / Bottom Navigation Bar:**
- **Home:** Overview of platform activity.
- **Vet Scheduler:** Schedule and manage vet visits.
- **Community Forum:** Engage in pet-related discussions.
- **Resources:** Access pet care guides.
- **Profile:** User settings and pet information.

**Screen Layouts:**
- **Home Screen:** Feature-rich dashboard summarizing pet health and upcoming appointments.
- **Vet Scheduler:** Calendar-based UI with appointment details and reminders.
- **Resource Library:** Organized categories with pet care articles.
- **Profile Screen:** User and pet management settings.

**Consistent Navigation:**
- Clear back navigation and user-friendly UI elements for easy access.

---

### 4. Color Scheme and Visual Style
**Primary Colors:**
- **Warm Brown (#443737):** Conveys comfort and trust.
- **Soft Beige (#f9f0e6):** Clean and neutral background.
- **Accent Colors:**
  - **Rust (#A27597):** Adds a touch of personality.
  - **Olive Green:** Represents nature and pets.

**Visual Style:**
- Clean layout with white space and large images.
- User-friendly typography for easy reading.
- Consistent iconography reflecting pet-related themes.

---

### 5. Entity Relational Database (ERD)
#### **Key Entities:**
**User**
- user_id (Primary Key)
- name
- email
- password_hash
- profile_image_url
- date_joined

**Pet_Profile**
- pet_id (Primary Key)
- user_id (Foreign Key - User)
- name
- species
- breed
- age
- health_notes

**Vet_Appointment**
- appointment_id (Primary Key)
- user_id (Foreign Key - User)
- pet_id (Foreign Key - Pet_Profile)
- date
- vet_name
- notes

---

### 6. Dataflow
**User Authentication & Registration:**
- Firebase Authentication handles secure user login and registration.
- **Dataflow:** User credentials → Firebase Auth → Secure session token.

**Pet Health Tracker:**
- Users log pet health updates, which are stored in Firestore.
- **Dataflow:** User inputs (health data) → Firestore → Displayed on pet profile.

**Vet Scheduler:**
- Users book appointments through the scheduling system.
- **Dataflow:** Appointment data → Firestore → User notifications for reminders.


**Admin Confirmation Workflow:**
- Admins review forum reports and vet listings for approval.
- **Dataflow:** New submissions trigger notifications → Admin dashboard accesses pending content → Approval updates reflected in real-time.

---

### Summary
**Alaga** aims to simplify pet care by integrating health tracking, vet scheduling, and a supportive pet-loving community into one intuitive app. With Firebase backend, Calendly API for scheduling, and a clean, engaging UI, this platform provides an all-in-one solution for responsible pet owners.

