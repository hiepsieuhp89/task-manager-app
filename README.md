# Task Manager App

A modern task management application built with React, featuring a list view and a Kanban board.

## Demo

Check out the live demo: [todo.xuntun.site](https://todo.xuntun.site)

## Features

- List view for quick task management
- Kanban board for visual task organization
- Drag and drop functionality for reordering tasks
- Real-time updates with optimistic UI
- Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hiepsieuhp89/task-manager-app.git
   cd task-manager-app
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the App Locally

To start the development server:

```
yarn dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```
yarn build
```

The built files will be in the `dist` directory.

## Deployment

To deploy the app:

1. Build the project as described above.
2. Upload the contents of the `dist` directory to your web server.
3. Configure your web server to serve the `index.html` file for all routes.

For specific deployment instructions, refer to your hosting provider's documentation.

## Technologies Used

- React
- Vite
- Tailwind CSS
- react-beautiful-dnd
- Axios
- React Icons
- React Toastify

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
