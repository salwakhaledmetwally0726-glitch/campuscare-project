# SRS — CampusCare Smart Facility Management System

**Team:** LogicLab

**Members:**

| Name | ID | Role |
|---|---|---|
| Lojaina Mohamed | 13007458 | Team Leader |
| Salwa Khaled | 13007498 | |
| Eslam Yasser | 13005335 | |
| Yousof Hariry | 13007173 | |
| Marwan Mohamed | 13005980 | |
| Mazen Maged | 13005396 | |
| Ahmed Walid | 13001202 | |

---

## Contents

1. [Introduction](#1-introduction)
   - [Purpose](#purpose)
   - [Intended Audience](#intended-audience)
   - [Overview of the Software](#overview-of-the-software)
   - [1.1 Product Vision & Scope](#11-product-vision--scope)
   - [1.2 Definitions and Acronyms](#12-definitions-and-acronyms)
2. [User Roles](#2-user-roles)
   - [2.1 Community Member](#21-community-member)
   - [2.2 Facility Manager](#22-facility-manager)
   - [2.3 Worker](#23-worker)
3. [Functional Requirements](#3-functional-requirements)
   - [3.1 Community Member Functional Requirements](#31-community-member-functional-requirements)
   - [3.2 Facility Manager Functional Requirements](#32-facility-manager-functional-requirements)
   - [3.3 Worker Functional Requirements](#33-worker-functional-requirements)
4. [Implemented Enhancements](#4-implemented-enhancements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
   - [5.1 Performance Requirements](#51-performance-requirements)
   - [5.2 Security Requirements](#52-security-requirements)
   - [5.3 Usability Requirements](#53-usability-requirements)
   - [5.4 Reliability Requirements](#54-reliability-requirements)
   - [5.5 Scalability Requirements](#55-scalability-requirements)
6. [Technology Stack](#6-technology-stack)
7. [Database Design](#7-database-design)
8. [Conclusion](#8-conclusion)

---

## 1. Introduction

### Purpose

This Software Requirements Specification (SRS) document provides a detailed description of the CampusCare mobile application, a Smart Facility Management System developed for the German International University (GIU) campus.

The purpose of this document is to define the system objectives, functionality, scope, architecture, user roles, and technical requirements in order to guide the development, implementation, and evaluation of the application.

CampusCare was developed to solve the problem of inefficient communication between university community members and the Facility Management team. Maintenance issues such as broken furniture, electrical problems, plumbing leaks, damaged equipment, and cleanliness issues are often reported informally, which may result in delayed response times and poor issue tracking.

The application introduces a centralized digital solution that allows users to report issues quickly through their mobile devices while enabling the Facility Management team to track, assign, manage, and resolve issues efficiently.

---

### Intended Audience

This document is intended for:

- Software developers implementing the system
- Course instructors and evaluators
- Business analysts involved in requirements validation
- Facility Management stakeholders
- Future contributors and maintainers of the system

---

### Overview of the Software

CampusCare is a mobile application that digitizes the campus maintenance workflow.

The system enables students, academic staff, and university employees to report infrastructure and maintenance issues directly from their mobile devices.

Users can submit an issue by:

- Uploading a photo
- Entering a description
- Selecting a category
- Specifying the location

The system forwards submitted issues to the Facility Management team, who can:

- View all submitted issues
- Assign issues to workers
- Track issue progress
- Update issue statuses
- Monitor worker activity

Workers can:

- View assigned tasks
- Update issue status
- Upload completion photos
- Add work completion comments

The system provides a complete workflow from issue reporting until issue resolution while maintaining structured records in the database.

---

## 1.1 Product Vision & Scope

### Product Vision

The vision of CampusCare is to provide a centralized, user-friendly, and efficient digital platform that improves communication between university community members and the Facility Management department.

The system aims to:

- Reduce the time between issue reporting and issue resolution
- Improve transparency in maintenance operations
- Improve campus cleanliness and safety
- Allow users to track issue progress
- Enable efficient task assignment and workforce management
- Maintain historical issue records for future analysis

The long-term vision is to transform maintenance operations from a reactive approach into a data-driven proactive maintenance system.

### Scope

The system includes:

- Mobile application for students and staff
- Facility Manager dashboard
- Worker dashboard
- Issue submission and tracking
- Role-based authentication and authorization
- Worker assignment functionality
- Issue status management
- Worker comments
- Completion photo uploads
- Cloud-based image storage
- PostgreSQL database storage using Supabase
- JWT-secured backend APIs

The system supports a complete issue lifecycle from issue creation until issue resolution.

---

## 1.2 Definitions and Acronyms

| Term | Meaning |
|---|---|
| FM | Facility Management |
| SRS | Software Requirements Specification |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| API | Application Programming Interface |
| PostgreSQL | Relational Database used through Supabase |
| Expo | React Native development framework |
| Supabase | Backend platform providing PostgreSQL database and cloud storage |

---

## 2. User Roles

The CampusCare system supports three primary user roles.

---

## 2.1 Community Member

### Description

A Community Member is any student, academic staff member, or administrative employee who reports campus issues using the mobile application.

### Responsibilities

- Report facility and maintenance issues
- Provide accurate issue information
- Track issue status
- View submitted issues

### Permissions

- Register account
- Login/logout
- Submit issues
- Upload issue photos
- View submitted issues
- View issue details
- Track issue status

---

## 2.2 Facility Manager

### Description

A Facility Manager supervises the maintenance workflow and manages all submitted issues.

### Responsibilities

- Monitor all issues
- Assign issues to workers
- Track issue progress
- Update issue statuses
- Close resolved issues

### Permissions

- Login/logout
- View all submitted issues
- View issue details
- Assign issues to workers
- Update issue status
- Close issues
- View worker information

---

## 2.3 Worker

### Description

A Worker is responsible for resolving assigned maintenance issues.

### Responsibilities

- View assigned issues
- Update issue progress
- Upload completion photos
- Add work comments

### Permissions

- Login/logout
- View assigned issues
- View issue details
- Mark issues as In Progress
- Mark issues as Resolved
- Upload completion photos
- Add worker comments

---

## 3. Functional Requirements

## 3.1 Community Member Functional Requirements

**FR-CM-01 — Registration**

The system shall allow Community Members to create accounts using name, email, password, and role.

**FR-CM-02 — Login**

The system shall allow Community Members to log in using email and password.

**FR-CM-03 — Submit Issue**

The system shall allow Community Members to submit issues including:

- Title
- Description
- Category
- Building
- Floor
- Room
- Photo

**FR-CM-04 — Upload Issue Photo**

The system shall allow Community Members to upload issue photos.

**FR-CM-05 — View My Issues**

The system shall allow Community Members to view their submitted issues.

**FR-CM-06 — View Issue Details**

The system shall allow Community Members to view full issue details.

**FR-CM-07 — Track Issue Status**

The system shall display issue statuses including:

- Pending
- In Progress
- Resolved
- Closed

**FR-CM-08 — Logout**

The system shall allow Community Members to logout securely.

---

## 3.2 Facility Manager Functional Requirements

**FR-FM-01 — Login**

The system shall allow Facility Managers to log in securely.

**FR-FM-02 — View All Issues**

The system shall allow Facility Managers to view all submitted issues.

**FR-FM-03 — View Issue Details**

The system shall allow Facility Managers to view full issue details.

**FR-FM-04 — Assign Worker**

The system shall allow Facility Managers to assign issues to workers.

**FR-FM-05 — Update Issue Status**

The system shall allow Facility Managers to update issue statuses.

**FR-FM-06 — Close Issue**

The system shall allow Facility Managers to close resolved issues.

**FR-FM-07 — View Workers**

The system shall allow Facility Managers to view available workers.

**FR-FM-08 — Logout**

The system shall allow Facility Managers to logout securely.

---

## 3.3 Worker Functional Requirements

**FR-W-01 — Login**

The system shall allow Workers to log in securely.

**FR-W-02 — View Assigned Issues**

The system shall allow Workers to view issues assigned to them.

**FR-W-03 — View Issue Details**

The system shall allow Workers to view full issue details.

**FR-W-04 — Update Status**

The system shall allow Workers to mark issues as:

- In Progress
- Resolved

**FR-W-05 — Upload Completion Photo**

The system shall allow Workers to upload completion photos after completing work.

**FR-W-06 — Add Worker Comment**

The system shall allow Workers to add work comments.

**FR-W-07 — Logout**

The system shall allow Workers to logout securely.

---

## 4. Implemented Enhancements

The following enhancements were implemented during Milestone 2:

- Role-based navigation
- JWT-secured authentication
- Role-based backend middleware
- Cloud image uploads using Supabase Storage
- Worker assignment workflow
- Completion photo uploads
- Worker comments
- Detailed issue tracking
- Real-time database updates after refresh
- Responsive mobile UI using React Native

---

## 5. Non-Functional Requirements

## 5.1 Performance Requirements

**NFR-01**

The system shall load screens within 5 seconds under normal conditions.

**NFR-02**

The system shall support image uploads up to 5 MB.

**NFR-03**

The system shall support multiple concurrent users.

---

## 5.2 Security Requirements

**NFR-04**

The system shall implement JWT authentication.

**NFR-05**

The system shall implement Role-Based Access Control (RBAC).

**NFR-06**

Passwords shall be securely hashed using bcrypt.

**NFR-07**

Protected APIs shall require valid authentication tokens.

**NFR-08**

Only authorized roles shall access protected routes.

---

## 5.3 Usability Requirements

**NFR-09**

The application shall provide a clean and consistent user interface.

**NFR-10**

The system shall display meaningful error messages.

**NFR-11**

The application shall support mobile-friendly navigation.

---

## 5.4 Reliability Requirements

**NFR-12**

Issue data shall be stored immediately after submission.

**NFR-13**

Uploaded images shall remain accessible through cloud storage.

---

## 5.5 Scalability Requirements

**NFR-14**

The system architecture shall support future feature expansion.

**NFR-15**

The database design shall support additional campuses in future versions.

---

## 6. Technology Stack

**Frontend**
- React Native
- Expo
- React Navigation
- Axios

**Backend**
- Node.js
- Express.js
- JWT Authentication
- bcrypt Password Hashing

**Database**
- PostgreSQL (Supabase)

**Cloud Storage**
- Supabase Storage

**Development Tools**
- VS Code
- Thunder Client
- GitHub

---

## 7. Database Design

The database contains the following primary tables:

- `users`
- `issues`
- `comments`
- `issue_photos`

**Relationships:**

- One user can create many issues
- One worker can be assigned many issues
- One issue can contain many comments
- One issue can contain multiple photos

---

## 8. Conclusion

CampusCare successfully digitizes the university maintenance workflow through a secure and role-based mobile application.

The system enables efficient communication between community members, facility managers, and workers while improving issue tracking, maintenance response time, and operational transparency.

The implemented solution demonstrates a complete end-to-end workflow from issue reporting until issue resolution using modern mobile and backend technologies.
