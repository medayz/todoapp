## Todo App

### API Endpoints:

- **GET** /api/users: Fetches all users
- **POST** /api/users: Adds a new user | _Payload:_ `{ username: string (min length: 3) }`
- **DELETE** /api/users/[userId]: Deletes a user
- **GET** /api/todos?user=<userId>: Fetches all todos of a user
- **POST** /api/todos: Adds a new todo | _Payload:_ `{ text: string (min length: 1), userId: <userId> }`
- **DELETE** /api/todos/[todoId]: Deletes a todo
- **PATCH** /api/todos/[todoId]: Updates a todo status | _Payload:_ `{ status: "current" | "done" }`

### PAGES

- Home page features:
  _Add users by providing a username (max 5 users allowed)_
  _Delete a user_
  _Click on user to go to their todos page_

- Todos page features:
  _Add todos by providing a text description_
  _Click on icon to change status_
  _> New todos become in progress_
  _> Todos in progress become in done_
  _> Done todos can be deleted_
  _You can move back to the home page by clicking "All users" link below the title_

### TECHNOLOGIES AND LIBRARIES USED

- Next: to build a hybrid fullstack app
- Typescript: for type safety
- React Query: for handling server state
- TailwindCSS: for styling
- Supabase: for storage
- clsx: to manage toggle tailwind classes
- Prettier: to keep a consistent formatting
