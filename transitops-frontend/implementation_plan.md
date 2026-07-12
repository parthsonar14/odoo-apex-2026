# Dynamic RBAC (User Management) Implementation Plan

User wants a Super Admin feature to assign permissions (roles) to other users.

## Proposed Changes

### 1. Backend: API Endpoints for User Management
Create a new `userController.js` and `userRoutes.js`.
#### [NEW] `transitops-backend/controllers/userController.js`
- `getAllUsers`: Fetch all users from the `Users` table (excluding passwords) with their role names.
- `updateUserRole`: Update the `role_id` for a specific user.
#### [NEW] `transitops-backend/routes/userRoutes.js`
- `GET /` -> `getAllUsers` (Restricted to Admin)
- `PUT /:id/role` -> `updateUserRole` (Restricted to Admin)
#### [MODIFY] `transitops-backend/server.js`
- Register the new `/api/users` route.

### 2. Frontend: User Management Page
#### [NEW] `transitops-frontend/src/pages/Users.jsx`
- A table listing all registered users (Name, Email, Current Role).
- A dropdown/action to change the user's role.
- Only accessible by the Admin.
#### [MODIFY] `transitops-frontend/src/App.jsx`
- Add a new route `/users` pointing to the `Users` page.
#### [MODIFY] `transitops-frontend/src/components/layout/Sidebar.jsx`
- Add a "User Management" or "Team" link in the sidebar (using `UsersIcon` or `Shield` icon), visible only to the Admin.

## User Review Required

> [!IMPORTANT]
> Who should be this "Admin"? Should we create a completely new **Super Admin** role (Role ID 5), or should the existing **Fleet Manager** (Role ID 1) act as the Admin who can change everyone's permissions? 
> Please let me know your preference so I can proceed correctly.

## Dashboard Filter Fix

> [!NOTE]
> I also noticed your issue with the Dashboard filters (All Types, All Statuses, Gujarat, etc.) not updating certain cards. The reason is that "Active Trips" and "Drivers On Duty" cards currently do not filter based on *Vehicle* Region or Type (since they are separate entities). Do you want me to update the backend logic so those cards also filter down based on the vehicle filters, or should I just fix the "Active/Available Vehicles" cards?
